# Flask Backend with Supabase Integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/jaydenvinson/Desktop/code/Team-7/backend
pip install -r requirements.txt
```

### 2. Set Up Supabase Database

1. Go to your Supabase project: https://foliylmmwevcanfnssna.supabase.co
2. Navigate to SQL Editor
3. Run the SQL from `database-schema.sql` to create tables and policies

### 3. Configure Environment Variables

Update `.env` with your JWT secret (use a long random string)

### 4. Run the Server

```bash
python app.py
```

Server will run on http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### PDFs
- `POST /api/pdfs/upload` - Upload PDF (requires auth)
- `GET /api/pdfs` - Get all PDFs (requires auth)

### Research Data
- `GET /api/research` - Get all research data
- `GET /api/research?year=2024` - Filter by year
- `GET /api/research/year/<year>` - Get by specific year

### Email Generation
- `POST /api/email/generate` - Generate AI email (requires auth)

### Existing Routes (unchanged)
- `POST /ingest-and-summarize` - Process PDF/text with Gemini
- `POST /generate-email` - Generate email from changes
- `GET /health` - Health check

## Features

- ✅ Supabase integration for data persistence
- ✅ PDF upload to Supabase Storage
- ✅ Automatic research data extraction with Gemini AI
- ✅ JWT-based authentication
- ✅ Email generation with AI
- ✅ All existing Gemini functionality preserved

