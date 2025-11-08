import os
import io
import re
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from pydantic import BaseModel, Field, ValidationError, field_validator
import bcrypt
import jwt

# --- Supabase integration ---
from supabase_client import (
    supabase,
    upload_pdf_to_storage,
    save_pdf_metadata,
    save_research_data,
    mark_pdf_processed,
    get_research_by_year,
    get_all_research,
    get_all_pdfs,
    save_email_template,
    register_user,
    get_user_by_email
)

# --- env (so you can keep GEMINI_API_KEY in .env) ---
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# --- Gemini ---
import google.generativeai as genai

# Prefer 1.5 Pro (or 1.5 Flash if you want cheaper/faster)
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "DUMMY_FOR_TESTS"))
model = genai.GenerativeModel(
    model_name=GEMINI_MODEL_NAME,
    generation_config={
        "temperature": 0.2,
        "response_mime_type": "application/json",  # JSON mode
    },
)

# --- PDF extraction (PyMuPDF) ---
import fitz  # PyMuPDF

# ----------------- Flask setup -----------------
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)

ALLOWED_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-key")  # Add this line here!

@app.after_request
def apply_cors(resp):
    origin = request.headers.get("Origin")
    if origin == ALLOWED_ORIGIN:
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        resp.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return resp

@app.route("/ingest-and-summarize", methods=["OPTIONS"])
def preflight():
    return ("", 204)

# ----------------- Schema (Pydantic) -----------------
class FundUsage(BaseModel):
    amount_numeric: Optional[float] = None
    amount_display: str = ""
    currency: str = "USD"
    period: str = ""
    recipient_org: str = ""
    purpose: str = ""

class Project(BaseModel):
    title: str
    trial_id: str = ""             # <-- keep this as string; empty if unknown
    layman_summary: str
    fund_usage: FundUsage
    future_goals: List[str] = Field(default_factory=list)
    timeline_snippet: str

    @field_validator("trial_id", mode="before")
    @classmethod
    def _coerce_trial_id(cls, v):
        if v is None:
            return ""
        v = str(v).strip()
        v = re.sub(r"[\s-]+", "", v.upper())
        return v

class OutputPayload(BaseModel):
    project_year: Optional[int] = None
    projects: List[Project] = Field(default_factory=list)
    global_notes: List[str] = Field(default_factory=list)

# This is the schema we ask the model to follow (strings "" when missing; only numerics can be null)
SCHEMA_JSON = """{
  "project_year": null,
  "projects": [
    {
      "title": "",
      "trial_id": "",
      "layman_summary": "",
      "fund_usage": {
        "amount_numeric": null,
        "amount_display": "",
        "currency": "USD",
        "period": "",
        "recipient_org": "",
        "purpose": ""
      },
      "future_goals": [],
      "timeline_snippet": ""
    }
  ],
  "global_notes": []
}"""

SYSTEM_PROMPT = (
  "You are a medical writer for a pediatric cancer nonprofit. "
  "Convert technical text into accurate, concise lay language for donors."
)

# ----------------- Helpers -----------------
CHUNK_CHARS = 6500
CHUNK_OVERLAP = 500

def chunk_text(s: str, max_chars=CHUNK_CHARS, overlap=CHUNK_OVERLAP):
    s = s.strip()
    if len(s) <= max_chars:
        return [s]
    parts, i = [], 0
    while i < len(s):
        parts.append(s[i:min(i+max_chars, len(s))])
        i += (max_chars - overlap)
    return parts

def pdf_to_text(file_bytes: bytes) -> str:
    """Layout-aware text with page markers so the model can reference pages."""
    parts = []
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for i, page in enumerate(doc, start=1):
            t = page.get_text("text") or ""
            parts.append(f"[PDF p{i}]\n{t}")
    return normalize_text("\n\n".join(parts))

def normalize_text(s: str) -> str:
    # unwrap hyphenation across newlines: "medullo-\nblastoma" -> "medulloblastoma"
    s = re.sub(r"-\s*\n\s*", "", s)
    # join single line breaks inside paragraphs (keep blank lines)
    s = re.sub(r"([^\n])\n(?!\n)", r"\1 ", s)
    # fix spaced thousands: "90, 000" -> "90,000"; "100 000" -> "100,000"
    s = re.sub(r"(?<=\d),(?:\s+)(?=\d{3})", ",", s)
    s = re.sub(r"(?<=\d)\s(?=\d{3}\b)", ",", s)
    # collapse multi-spaces
    s = re.sub(r"[ \t]{2,}", " ", s)
    return s.strip()

# --- general extractors for trial_id + plausible grant amount ---
TRIAL_ID_RE = re.compile(r"\b(PNOC|NCT|PBTC|COG)\s*[-]?\s*\d+\b", re.I)
MONEY_TOKEN_RE = re.compile(
    r"(?i)(\$?\s?\d{1,3}(?:[,\s]\d{3})+(?:\.\d{2})?|\$\s?\d+|\d{4,})(?:\s*(?:USD|dollars|over\s+\d+\s+years?)?)"
)
TOTAL_BUDGET_CUES = re.compile(r"(?i)\b(total (project )?budget|subtotal|indirects|overhead|total:)\b")
GRANT_CUES = re.compile(r"(?i)\b(grant amount|grant:|awarded|provided by|funded by|our (?:foundation|nonprofit)|we (?:will|plan to) fund|committed)\b")

def extract_trial_id(text: str) -> str:
    m = TRIAL_ID_RE.search(text)
    if not m:
        return ""
    return re.sub(r"[\s-]+", "", m.group(0).upper())  # PNOC044, NCT0123456

def _normalize_money_token(tok: str) -> str:
    tok = tok.strip()
    if not tok.startswith("$"):
        # add $ to naked numbers >= 4 digits (e.g., 781000)
        if re.fullmatch(r"\d{4,}(?:\.\d{2})?", tok):
            tok = "$" + tok
    tok = tok.replace(" ", "")
    if re.fullmatch(r"\$\d{4,}(?:\.\d{2})?", tok) and "," not in tok:
        num = tok[1:]
        try:
            if "." in num:
                left, right = num.split(".")
                left = f"{int(left):,}"
                tok = f"${left}.{right}"
            else:
                tok = f"${int(num):,}"
        except Exception:
            pass
    return tok

def _money_to_numeric(tok: str) -> Optional[float]:
    digits = re.sub(r"[^\d.]", "", tok or "")
    if not digits:
        return None
    try:
        return float(digits)
    except Exception:
        return None

def choose_grant_amount(text: str) -> Tuple[str, Optional[float]]:
    """
    Heuristic: scan lines. Prefer amounts on lines with 'grant/awarded/provided/funded/committed'.
    Downrank lines that look like total project budget/indirects.
    Return (amount_display, amount_numeric) or ("", None) if nothing plausible.
    """
    best = None  # (display, numeric, score)
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        toks = [t.group(0) for t in MONEY_TOKEN_RE.finditer(line)]
        if not toks:
            continue
        score = 0
        if GRANT_CUES.search(line):
            score += 3
        if TOTAL_BUDGET_CUES.search(line):
            score -= 2
        if re.search(r"(?i)\bgrant\b", line):
            score += 1
        for tok in toks:
            disp = _normalize_money_token(tok)
            val = _money_to_numeric(disp)
            if val and val < 1_000:
                continue
            cand = (disp, val, score)
            if best is None:
                best = cand
            else:
                if cand[2] > best[2] or (cand[2] == best[2] and (cand[1] or 0) > (best[1] or 0)):
                    best = cand
    if best:
        return best[0], best[1]
    return "", None

def make_hints_for_any_text(text: str, label: str = "", sdate: str = "") -> dict:
    trial_id = extract_trial_id(text)
    amount_display, amount_numeric = choose_grant_amount(text)
    return {
        "trial_id": trial_id,                    # e.g., "PNOC044" or ""
        "grant_amount": {
            "amount_display": amount_display,    # "$340,000 over two years" or ""
            "amount_numeric": amount_numeric     # 340000.0 or null
        },
        "source": {"label": label or "", "date": sdate or ""}
    }

# --- prompt building + LLM call ---
def build_user_prompt(content: str, hints: dict) -> str:
    return "\n\n".join([
      SYSTEM_PROMPT,
      "",
      "Return STRICT JSON matching the schema exactly. If info is missing, keep string fields as empty strings \"\" and numeric fields as null.",
      "CRITICAL RULES:",
      "1) Include `trial_id` if present in CONTENT or HINTS (e.g., PNOC044, NCT######).",
      "2) If multiple passages describe the SAME trial_id, MERGE into a single project entry.",
      "3) Do NOT invent amounts. If HINTS.grant_amount is provided and not contradicted by CONTENT, use it.",
      "4) Fund usage: set both amount_numeric and amount_display when a grant amount is present; otherwise leave blank/null.",
      f"SCHEMA:\n{SCHEMA_JSON}",
      "STYLE:\n- Layman summaries: 2–6 sentences, no jargon.\n"
      "- Fund usage: extract numeric amount, display string, period, org, purpose if present; otherwise leave blank.\n"
      "- Future goals: concrete, short phrases.\n"
      "- timeline_snippet: 1–3 sentences for a donor timeline card.",
      f"HINTS:\n{json.dumps(hints or {}, indent=2)}",
      f"CONTENT:\n{content}"
    ])

def _extract_json_from_gemini(resp) -> str:
    raw = getattr(resp, "text", None)
    if raw:
        return raw
    # fallback: walk candidates
    for cand in getattr(resp, "candidates", []) or []:
        content = getattr(cand, "content", None)
        parts = getattr(content, "parts", None) if content else None
        if parts:
            for p in parts:
                t = getattr(p, "text", None)
                if t:
                    return t
    return ""

def call_llm_json(content: str, hints: dict) -> dict:
    prompt = build_user_prompt(content, hints)
    for _ in range(2):  # one retry if JSON is malformed/empty
        resp = model.generate_content(prompt)
        raw = _extract_json_from_gemini(resp)
        try:
            return json.loads(raw or "{}")
        except Exception:
            prompt += "\n\nRespond with VALID JSON ONLY. No commentary."
    return {"project_year": None, "projects": [], "global_notes": ["Model failed to return valid JSON."]}

# --- sanitize + optional dedupe ---
def _sanitize_llm_output(raw_out: dict) -> dict:
    """Coerce nulls to strings where needed and normalize fields."""
    if not isinstance(raw_out, dict):
        return {"project_year": None, "projects": [], "global_notes": []}

    projects = raw_out.get("projects") or []
    cleaned = []
    for p in projects:
        if not isinstance(p, dict):
            continue
        for key in ("title", "trial_id", "layman_summary", "timeline_snippet"):
            val = p.get(key)
            p[key] = "" if val is None else str(val)

        # normalize trial_id format
        if p["trial_id"]:
            p["trial_id"] = re.sub(r"[\s-]+", "", p["trial_id"].upper())

        fu = p.get("fund_usage") or {}
        fu.setdefault("amount_display", "")
        fu.setdefault("currency", "USD")
        fu.setdefault("period", "")
        fu.setdefault("recipient_org", "")
        fu.setdefault("purpose", "")
        # numeric cleanup
        if isinstance(fu.get("amount_numeric"), str):
            digits = re.sub(r"[^\d.]", "", fu["amount_numeric"])
            fu["amount_numeric"] = float(digits) if digits else None
        p["fund_usage"] = fu

        if not isinstance(p.get("future_goals"), list):
            p["future_goals"] = []

        cleaned.append(p)

    raw_out["projects"] = cleaned

    if not isinstance(raw_out.get("global_notes"), list):
        raw_out["global_notes"] = []

    if isinstance(raw_out.get("project_year"), str):
        try:
            raw_out["project_year"] = int(raw_out["project_year"])
        except ValueError:
            raw_out["project_year"] = None

    return raw_out

def merge_projects_by_trial_id(projects: List[dict]) -> List[dict]:
    """Light dedupe: if multiple entries share trial_id, merge into one."""
    by_id = {}
    for p in projects:
        key = p.get("trial_id", "") or p.get("title", "").lower().strip()
        if key in by_id:
            base = by_id[key]
            # keep longest lay summary
            if len(p.get("layman_summary", "")) > len(base.get("layman_summary", "")):
                base["layman_summary"] = p["layman_summary"]
            # union future_goals
            base["future_goals"] = sorted(set((base.get("future_goals") or []) + (p.get("future_goals") or [])), key=str.lower)
            # prefer non-null amount_numeric
            bu = base.get("fund_usage") or {}
            pu = p.get("fund_usage") or {}
            if bu.get("amount_numeric") is None and pu.get("amount_numeric") is not None:
                bu["amount_numeric"] = pu["amount_numeric"]
                bu["amount_display"] = pu.get("amount_display", bu.get("amount_display",""))
            for k in ("period", "recipient_org", "purpose"):
                if not bu.get(k) and pu.get(k):
                    bu[k] = pu[k]
            base["fund_usage"] = bu
        else:
            by_id[key] = p
    return list(by_id.values())

# ----------------- API -----------------
@app.route("/ingest-and-summarize", methods=["POST"])
def ingest_and_summarize():
    """
    Accepts:
      multipart/form-data:
        - file: PDF (optional)
        - raw_text: string (optional)
        - source_label: string (optional)
        - source_date: YYYY-MM-DD (optional)
      OR application/json:
        { "raw_text": "...", "source_label": "...", "source_date": "YYYY-MM-DD" }
    Returns: OutputPayload JSON or { error, details? }
    """
    try:
        ctype = request.headers.get("Content-Type","")
        label = (request.form.get("source_label") if "multipart/form-data" in ctype else None) or ""
        sdate = (request.form.get("source_date") if "multipart/form-data" in ctype else None) or ""

        if "multipart/form-data" in ctype:
            raw_text = (request.form.get("raw_text") or "").strip()
            if raw_text:
                text = normalize_text(raw_text)
            elif "file" in request.files:
                f = request.files["file"]
                if not f or f.mimetype != "application/pdf":
                    return jsonify({"error":"Only PDF or raw_text supported"}), 400
                text = pdf_to_text(f.read())
            else:
                return jsonify({"error":"Provide raw_text or a PDF file"}), 400

        elif "application/json" in ctype:
            data = request.get_json(silent=True) or {}
            label = (data.get("source_label") or "").strip()
            sdate = (data.get("source_date") or "").strip()
            text = (data.get("raw_text") or "").strip()
            if not text:
                return jsonify({"error":"raw_text required for JSON requests"}), 400
            text = normalize_text(text)

        else:
            return jsonify({"error":"Unsupported Content-Type"}), 415

        if not text:
            return jsonify({"error":"No readable text found"}), 422

        # provenance note + hints
        provenance = f'[SOURCE: label="{label}", date={sdate}]'
        combined = f"{provenance}\n{text}".strip()
        hints = make_hints_for_any_text(combined, label=label, sdate=sdate)

        parts = chunk_text(combined)
        if len(parts) == 1:
            raw_out = call_llm_json(parts[0], hints)
        else:
            # Call per chunk and merge (simple concatenation + dedupe)
            partials = [call_llm_json(p, hints) for p in parts]
            raw_out = {"project_year": None, "projects": [], "global_notes": []}
            for p in partials:
                if raw_out["project_year"] is None and p.get("project_year"):
                    raw_out["project_year"] = p["project_year"]
                if isinstance(p.get("projects"), list):
                    raw_out["projects"].extend(p["projects"])
                if isinstance(p.get("global_notes"), list):
                    raw_out["global_notes"].extend(p["global_notes"])

        # sanitize, dedupe, validate
        raw_out = _sanitize_llm_output(raw_out)
        if isinstance(raw_out.get("projects"), list):
            raw_out["projects"] = merge_projects_by_trial_id(raw_out["projects"])

        try:
            parsed = OutputPayload.model_validate(raw_out)
        except ValidationError as ve:
            return jsonify({"error":"LLM JSON validation failed", "details": json.loads(ve.json())}), 502

        return jsonify(parsed.model_dump()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/health")
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat()})

@app.route("/generate-email", methods=["POST", "OPTIONS"])
def generate_email():
    """
    Generate an AI-powered email from research changes.
    
    Request JSON:
        {
            "changes": [
                {
                    "id": "approved-123",
                    "type": "research_tile_added",
                    "title": "Project Title",
                    "year": 2024,
                    "amount": "$250,000",
                    "impact": "Brief impact description",
                    "timestamp": 1234567890
                }
            ]
        }
    
    Returns:
        {
            "subject": "Email subject line",
            "body": "Full email body text"
        }
    """
    if request.method == "OPTIONS":
        return ("", 204)
    
    try:
        from email_generator import generate_research_email
        
        data = request.get_json(silent=True) or {}
        changes = data.get("changes", [])
        
        if not changes:
            return jsonify({"error": "No changes provided"}), 400
        
        result = generate_research_email(changes)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------- Auth Helpers -----------------
def create_token(user_id: str, email: str, role: str) -> str:
    """Create JWT token."""
    payload = {
        "id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> dict:
    """Verify JWT token."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def require_auth(f):
    """Decorator to require authentication."""
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return ("", 204)
        
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Access denied"}), 401
        
        token = auth_header.split(" ")[1]
        try:
            user = verify_token(token)
            request.user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 403
    
    return decorated

# ----------------- Auth Routes -----------------
@app.route("/api/auth/register", methods=["POST", "OPTIONS"])
def auth_register():
    if request.method == "OPTIONS":
        return ("", 204)
    
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip()
        password = (data.get("password") or "").strip()
        role = (data.get("role") or "").strip()  # new field
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Check if user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
        
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        
        # Save the new user to Supabase
        user_data = register_user(
            email=email,
            password=hashed_password.decode("utf-8"),
            role=role  # save role
        )
        
        # Automatically log in the user after registration
        token = create_token(user_data["id"], email, role)
        
        return jsonify({
            "id": user_data["id"],
            "email": email,
            "role": role,
            "token": token
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/login", methods=["POST", "OPTIONS"])
def auth_login():
    if request.method == "OPTIONS":
        return ("", 204)
    
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip()
        password = (data.get("password") or "").strip()
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Fetch the user from Supabase
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check if the password matches
        if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Create a JWT token
        token = create_token(user["id"], email, user.get("role", "user"))
        
        return jsonify({
            "id": user["id"],
            "email": email,
            "role": user.get("role", "user"),
            "token": token
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------- Research Data Routes -----------------
@app.route("/api/research", methods=["GET", "OPTIONS"])
def get_research():
    """Get all research data from Supabase database."""
    if request.method == "OPTIONS":
        return ("", 204)
    
    try:
        year = request.args.get("year")
        
        if year:
            data = get_research_by_year(int(year))
        else:
            data = get_all_research()
        
        print(f"Returning {len(data)} research items from database")
        return jsonify(data), 200
    except Exception as e:
        print(f"Error fetching research: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/research/year/<int:year>", methods=["GET", "OPTIONS"])
def get_research_by_year_route(year):
    """Get research data for a specific year from Supabase."""
    if request.method == "OPTIONS":
        return ("", 204)
    
    try:
        data = get_research_by_year(year)
        print(f"Returning {len(data)} research items for year {year}")
        return jsonify(data), 200
    except Exception as e:
        print(f"Error fetching research for year {year}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/research/add", methods=["POST", "OPTIONS"])
@require_auth
def add_research_manual():
    """Manually add a research tile (used by admin dashboard when approving tiles)."""
    try:
        data = request.get_json() or {}
        
        title = data.get("title", "").strip()
        year = data.get("year")
        impact = data.get("impact", "").strip()
        money = data.get("money", "").strip()
        summary = data.get("summary", "").strip()
        
        if not title or not year:
            return jsonify({"error": "Title and year are required"}), 400
        
        # Save to Supabase with user info
        research_data = save_research_data(
            pdf_id=None,
            title=title,
            year=int(year),
            impact=impact,
            money=money,
            summary=summary,
            created_by=request.user["id"]
        )
        
        print(f"Successfully saved research tile: {research_data}")
        return jsonify(research_data), 201
        
    except Exception as e:
        print(f"Error adding research: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
