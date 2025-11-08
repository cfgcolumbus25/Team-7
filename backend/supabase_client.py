"""
Supabase client configuration and helper functions.
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_pdf_to_storage(file_bytes: bytes, filename: str, user_id: str) -> dict:
    """
    Upload PDF to Supabase Storage.
    
    Args:
        file_bytes: PDF file content as bytes
        filename: Name for the file in storage
        user_id: User ID for folder organization
    
    Returns:
        dict with storage_path and public_url
    """
    storage_path = f"{user_id}/{filename}"
    
    print(f"Uploading to storage: bucket='pdfs', path='{storage_path}'")
    
    try:
        response = supabase.storage.from_("pdfs").upload(
            storage_path,
            file_bytes,
            file_options={"content-type": "application/pdf", "upsert": "false"}
        )
        
        print(f"Upload response: {response}")
        
        # Get public URL
        public_url = supabase.storage.from_("pdfs").get_public_url(storage_path)
        
        print(f"Public URL: {public_url}")
        
        return {
            "storage_path": storage_path,
            "public_url": public_url
        }
    except Exception as e:
        print(f"Storage upload error: {e}")
        # If upload fails, still return the path (file might already exist)
        public_url = supabase.storage.from_("pdfs").get_public_url(storage_path)
        return {
            "storage_path": storage_path,
            "public_url": public_url
        }


def save_pdf_metadata(filename: str, original_name: str, storage_path: str, 
                      file_size: int, uploaded_by: str) -> dict:
    """Save PDF metadata to database."""
    data = {
        "filename": filename,
        "original_name": original_name,
        "storage_path": storage_path,
        "file_size": file_size,
        "uploaded_by": uploaded_by,
        "processed": False
    }
    
    response = supabase.table("pdfs").insert(data).execute()
    return response.data[0] if response.data else {}


def save_research_data(pdf_id: str, title: str, year: int, impact: str, 
                       money: str, summary: str, created_by: str = None) -> dict:
    """Save research data to database."""
    data = {
        "title": title,
        "year": year,
        "impact": impact,
        "money": money,
        "summary": summary
    }
    
    # Only add pdf_id if it's provided
    if pdf_id is not None:
        data["pdf_id"] = pdf_id
    
    # Only add created_by if column exists and value is provided
    # Skip for now since column doesn't exist yet
    # if created_by is not None:
    #     data["created_by"] = created_by
    
    response = supabase.table("research_data").insert(data).execute()
    return response.data[0] if response.data else {}


def mark_pdf_processed(pdf_id: str) -> None:
    """Mark PDF as processed."""
    supabase.table("pdfs").update({"processed": True}).eq("id", pdf_id).execute()


def get_research_by_year(year: int) -> list:
    """Get all research data for a specific year."""
    response = supabase.table("research_data").select("*").eq("year", year).execute()
    return response.data or []


def get_all_research() -> list:
    """Get all research data."""
    response = supabase.table("research_data").select("*").order("year", desc=True).execute()
    return response.data or []


def get_all_pdfs() -> list:
    """Get all PDFs with user info."""
    response = supabase.table("pdfs").select("*").order("uploaded_at", desc=True).execute()
    return response.data or []


def save_email_template(research_id: str, subject: str, body: str) -> dict:
    """Save generated email template."""
    data = {
        "research_id": research_id,
        "subject": subject,
        "body": body
    }
    
    response = supabase.table("email_templates").insert(data).execute()
    return response.data[0] if response.data else {}


def register_user(email: str, password_hash: str, name: str) -> dict:
    """Register a new user (custom auth, not Supabase Auth)."""
    data = {
        "email": email,
        "password": password_hash,
        "name": name,
        "role": "user"
    }
    
    response = supabase.table("users").insert(data).execute()
    return response.data[0] if response.data else {}


def get_user_by_email(email: str) -> dict:
    """Get user by email."""
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None
