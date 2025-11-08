"""Test Supabase storage directly."""
from supabase_client import supabase
import io

def test_storage():
    """Test uploading and listing files in storage."""
    print("Testing Supabase Storage...")
    
    try:
        # Create a simple test file
        test_content = b"This is a test PDF file"
        test_path = "test-user/test-file.pdf"
        
        print(f"\n1. Uploading test file to: {test_path}")
        response = supabase.storage.from_("pdfs").upload(
            test_path,
            test_content,
            file_options={"content-type": "application/pdf", "upsert": "true"}
        )
        print(f"   Upload response: {response}")
        
        print(f"\n2. Listing files in 'pdfs' bucket:")
        files = supabase.storage.from_("pdfs").list()
        print(f"   Found {len(files)} items:")
        for f in files:
            print(f"   - {f}")
        
        print(f"\n3. Getting public URL:")
        url = supabase.storage.from_("pdfs").get_public_url(test_path)
        print(f"   URL: {url}")
        
        print("\n✅ Storage test passed!")
        
    except Exception as e:
        print(f"\n❌ Storage test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_storage()
