import os
import io
import json
from datetime import datetime
from typing import List, Optional

from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from pydantic import BaseModel, Field, ValidationError
from pypdf import PdfReader

# --- Gemini (Google Generative AI) ---
# pip install google-generativeai
import google.generativeai as genai

# ----------------- Flask setup -----------------
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)

ALLOWED_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
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

# ----------------- Gemini client -----------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "DUMMY_FOR_TESTS")
genai.configure(api_key=GEMINI_API_KEY)

# Prefer 1.5 Pro (or 1.5 Flash if you want cheaper/faster)
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-pro")

# Set JSON output
_generation_config = {
    "temperature": 0.2,
    "response_mime_type": "application/json",
}
# You can add safety_settings here if desired.

model = genai.GenerativeModel(
    model_name=GEMINI_MODEL_NAME,
    generation_config=_generation_config,
)

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
    layman_summary: str
    fund_usage: FundUsage
    future_goals: List[str] = Field(default_factory=list)
    timeline_snippet: str

class OutputPayload(BaseModel):
    project_year: Optional[int] = None
    projects: List[Project] = Field(default_factory=list)
    global_notes: List[str] = Field(default_factory=list)

# ----------------- Helpers -----------------
CHUNK_CHARS = 8000
CHUNK_OVERLAP = 600

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
    reader = PdfReader(io.BytesIO(file_bytes))
    pages = []
    for i, page in enumerate(reader.pages):
        pages.append(f"[PDF p{i+1}] {page.extract_text() or ''}")
    return "\n\n".join(pages)

SCHEMA_JSON = """{
  "project_year": null,
  "projects": [
    {
      "title": "",
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

def build_user_prompt(content: str) -> str:
    # Gemini doesn't require role separation; we compose a single instruction string.
    return "\n\n".join([
      SYSTEM_PROMPT,
      "",
      "Return STRICT JSON matching the schema exactly. If info is missing, keep keys with null/empty values.",
      "If multiple passages cover the same project, consolidate into one project entry. "
      "On conflicting amounts, prefer the most recent source_date (if present) and put alternatives in global_notes.",
      f"SCHEMA:\n{SCHEMA_JSON}",
      "STYLE:\n- Layman summaries: 2–6 sentences, no jargon.\n"
      "- Fund usage: extract numeric amount, display string, period, org, purpose.\n"
      "- Future goals: concrete, short phrases.\n"
      "- timeline_snippet: 1–3 sentences for a donor timeline card.",
      f"CONTENT:\n{content}"
    ])

def call_llm_json(content: str) -> dict:
    prompt = build_user_prompt(content)
    # For single-turn requests, generate_content with a single string is fine.
    resp = model.generate_content(prompt)
    # Gemini returns the JSON string in resp.text when response_mime_type="application/json"
    raw = resp.text or "{}"
    return json.loads(raw)

def merge_partials(parts: List[dict]) -> dict:
    out = {"project_year": None, "projects": [], "global_notes": []}
    for p in parts:
        if out["project_year"] is None and p.get("project_year"):
            out["project_year"] = p["project_year"]
        if isinstance(p.get("projects"), list):
            out["projects"].extend(p["projects"])
        if isinstance(p.get("global_notes"), list):
            out["global_notes"].extend(p["global_notes"])
    return out

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
        label = ""; sdate = ""; text = ""

        if "multipart/form-data" in ctype:
            label = (request.form.get("source_label") or "").strip()
            sdate = (request.form.get("source_date") or "").strip()
            raw_text = (request.form.get("raw_text") or "").strip()

            if raw_text:
                text = raw_text
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
        else:
            return jsonify({"error":"Unsupported Content-Type"}), 415

        if not text:
            return jsonify({"error":"No readable text found"}), 422

        provenance = f'[SOURCE: label="{label}", date={sdate}]'
        combined = f"{provenance}\n{text}".strip()

        parts = chunk_text(combined)
        if len(parts) == 1:
            raw_out = call_llm_json(parts[0])
        else:
            raw_out = merge_partials([call_llm_json(p) for p in parts])

        try:
            parsed = OutputPayload.model_validate(raw_out)
        except ValidationError as ve:
            return jsonify({"error":"LLM JSON validation failed", "details": json.loads(ve.json())}), 502

        return jsonify(parsed.model_dump())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/health")
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
