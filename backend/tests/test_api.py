import json
from io import BytesIO
from app import app

# ---------- Fake Gemini objects to avoid real API calls ----------
FAKE_JSON = {
  "project_year": 2025,
  "projects": [{
    "title": "PNOC044-Translating Thyroid Hormone",
    "layman_summary": "A donor-friendly summary.",
    "fund_usage": {
      "amount_numeric": 340000,
      "amount_display": "$340,000 over two years",
      "currency": "USD",
      "period": "2 years",
      "recipient_org": "PNOC",
      "purpose": "T3 + chemo; liquid biopsy MRD"
    },
    "future_goals": ["Evaluate safety/efficacy"],
    "timeline_snippet": "Because T3 is FDA-approved..."
  }],
  "global_notes": []
}

class _FakeResponse:
    def __init__(self, content: dict):
        self.text = json.dumps(content)

class FakeModel:
    def generate_content(self, prompt):
        # Optionally assert the prompt contains "SCHEMA" / "CONTENT"
        return _FakeResponse(FAKE_JSON)

# ---------- Utilities ----------
def make_text_pdf_bytes():
    """Create a tiny PDF with extractable text using reportlab."""
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    bio = BytesIO()
    c = canvas.Canvas(bio, pagesize=letter)
    c.drawString(72, 720, "PNOC044-Translating Thyroid Hormone")
    c.drawString(72, 700, "Grant Amount: $340,000 over two years")
    c.drawString(72, 680, "Future goal: Evaluate safety/efficacy")
    c.save()
    bio.seek(0)
    return bio.getvalue()

# ---------- Tests ----------
def test_health():
    with app.test_client() as tc:
        r = tc.get("/health")
        assert r.status_code == 200
        data = r.get_json()
        assert data.get("ok") is True

def test_ingest_raw_text_json(monkeypatch):
    # Patch Gemini model used inside app
    import app as appmod
    monkeypatch.setattr(appmod, "model", FakeModel())

    with app.test_client() as tc:
        payload = {
            "raw_text": "Medulloblastoma... Grant Amount: $340,000 over two years",
            "source_label": "PNOC044 update",
            "source_date": "2025-01-10"
        }
        r = tc.post("/ingest-and-summarize", json=payload)
        assert r.status_code == 200, r.data
        data = r.get_json()
        assert "projects" in data
        assert data["projects"][0]["fund_usage"]["amount_numeric"] == 340000

def test_ingest_pdf_multipart(monkeypatch):
    import app as appmod
    monkeypatch.setattr(appmod, "model", FakeModel())

    pdf_bytes = make_text_pdf_bytes()

    with app.test_client() as tc:
        data = {
            "file": (BytesIO(pdf_bytes), "sample.pdf"),
            "source_label": "Researcher PDF",
            "source_date": "2025-01-05"
        }
        r = tc.post("/ingest-and-summarize", data=data, content_type="multipart/form-data")
        assert r.status_code == 200, r.data
        data = r.get_json()
        assert data["projects"][0]["title"].startswith("PNOC044")

def test_errors_when_missing_input():
    with app.test_client() as tc:
        r = tc.post("/ingest-and-summarize", json={})
        assert r.status_code in (400, 415)  # 400: missing; 415: wrong content-type
