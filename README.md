# Team-7

# Lilabean Foundation Impact Dashboard
**Turning donations and research into transparent, actionable impact.**

## 1. The Problem

Nonprofit organizations struggle to communicate their impact to donors and stakeholders in a clear, engaging way. Research findings, donation data, and fundraising milestones often exist scattered across PDFs, spreadsheets, and internal documents. Donors want to see where their contributions go, but there's no unified platform that makes this information accessible, visual, and meaningful. Without transparency, trust erodes and engagement drops.

## 2. Our Solution

The Lilabean Foundation Impact Dashboard is a comprehensive platform that transforms raw research data and donation information into an interactive, visual experience. It automatically extracts insights from PDFs using AI, visualizes fundraising progress with charts, and provides both public-facing overviews and admin tools for managing research tiles.

**AI-Powered Research Extraction** — Automatically processes PDFs and raw text to extract research findings, funding amounts, and impact summaries using Google Gemini AI.

**Interactive Timeline & Visualizations** — Dynamic research timeline with year filtering, bar charts for fundraising progress, and milestone tracking.

**Email Generation** — AI-generated stakeholder emails summarizing recent research additions and impact updates.

**Role-Based Access** — Separate dashboards for admins (research approval, data management) and regular users (donation history, achievements).

**Real-Time Data** — Live integration with Supabase for persistent storage, PDF management, and research data retrieval.

**Transparent Impact Reporting** — Public-facing overview page showing fundraising history, research milestones, and stories of hope.

Our mission is to bridge the gap between data and understanding, making every donation and research finding count.

## 3. Tech Stack

**Frontend:**
- React 19.1.1 with React Router DOM 7.9.5
- Vite 7.2.2 (build tool)
- Material-UI (MUI) 7.3.5 for components
- Recharts 2.15.4 for data visualization
- Supabase JS 2.80.0 for database client
- Framer Motion 12.23.24 for animations

**Backend:**
- Flask (Python web framework)
- Pydantic 2+ for data validation
- PyMuPDF & pypdf for PDF processing
- python-dotenv for environment management
- bcrypt & JWT for authentication

**AI/ML:**
- Google Gemini AI (gemini-2.5-flash) for research extraction and email generation
- JSON mode for structured output

**Web/Data:**
- Supabase (PostgreSQL database + storage)
- RESTful API architecture
- Recharts for interactive charts

**Core Features:**
- PDF ingestion and text extraction
- AI-powered research summarization
- JWT-based authentication
- Role-based access control (admin/user)
- Real-time data synchronization
- Email template generation
- Interactive data visualizations

## 4. How to Run It Locally

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account (for database)
- Google Gemini API key

### Installation

**1. Clone the repository:**

```bash
git clone <repository-url>
cd Team-7
```

**2. Set up the Backend:**

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_long_random_jwt_secret_here
PORT=8000
```

Set up the Supabase database by running the SQL from `backend/database-schema.sql` in your Supabase SQL Editor.

**3. Set up the Frontend:**

```bash
cd ../frontend
npm install
```

### Running the App

**Start the Backend Server:**

```bash
cd backend
python app.py
```

Server runs on `http://localhost:8000`

**Start the Frontend App:**

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user (email, password, role)
- `POST /api/auth/login` — Login user (returns JWT token)

### Research Data
- `GET /api/research` — Get all research data (optional `?year=2024` query param)
- `GET /api/research/year/<year>` — Get research by specific year
- `POST /api/research/add` — Add research tile (requires auth)

### PDF Management
- `POST /api/pdfs/upload` — Upload PDF to Supabase storage (requires auth)
- `GET /api/pdfs` — Get all PDFs (requires auth)

### AI Processing
- `POST /ingest-and-summarize` — Process PDF or raw text with Gemini AI, extract research data
- `POST /generate-email` — Generate AI email from recent research changes

### Health
- `GET /health` — Health check endpoint

## 6. Project Structure

```
Team-7/
├── backend/
│   ├── app.py                 # Flask server & API routes
│   ├── supabase_client.py     # Supabase integration functions
│   ├── email_generator.py     # Email generation logic
│   ├── requirements.txt       # Python dependencies
│   ├── database-schema.sql    # Supabase schema
│   ├── schema.sql             # Additional schema definitions
│   └── tests/
│       └── test_api.py        # API tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component & routing
│   │   ├── main.jsx           # React entry point
│   │   ├── pages/
│   │   │   ├── Overview.jsx          # Public overview page
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   │   ├── Donate.jsx            # Donation page
│   │   │   ├── SignIn.jsx            # Login page
│   │   │   └── PDFLibrary.jsx        # PDF library view
│   │   ├── components/
│   │   │   ├── ResearchTimeline.jsx  # Interactive timeline
│   │   │   ├── header.jsx            # Site header
│   │   │   ├── NavBar.jsx            # Navigation
│   │   │   └── ...                   # Other UI components
│   │   ├── services/
│   │   │   └── api.js                # API client & Supabase setup
│   │   ├── contexts/
│   │   │   └── UserContext.jsx        # User state management
│   │   └── data/
│   │       └── researchData.js       # Static research data
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js        # Vite configuration
└── README.md
```

## 7. How It Works

1. **PDF Upload & Processing** — Admin uploads a PDF or pastes raw text through the dashboard. The backend extracts text using PyMuPDF.

2. **AI Extraction** — The extracted text is sent to Google Gemini AI with structured prompts. Gemini returns JSON with research title, year, funding amount, impact description, and summary.

3. **Data Storage** — Extracted research data is saved to Supabase PostgreSQL database. PDFs are stored in Supabase Storage buckets.

4. **Admin Review** — Admins review AI-extracted tiles in a preview modal, can edit fields, and approve to save to the database.

5. **Public Display** — Approved research tiles appear on the public Overview page in an interactive timeline, filtered by year.

6. **Visualization** — Recharts generates bar charts showing fundraising progress over time. Users see donation history and achievements.

7. **Email Generation** — Admins can generate AI-powered emails summarizing recent research additions, which are sent to stakeholders.

8. **Authentication** — JWT tokens manage user sessions. Role-based access controls what users can see and edit.

## 8. Challenges We Ran Into

- **Material-UI Label Behavior** — MUI TextField labels were disappearing on focus. Fixed by using `InputLabelProps={{ shrink: true }}` to keep labels permanently visible.

- **CORS Configuration** — Flask backend needed proper CORS headers for frontend requests. Added `ProxyFix` middleware and CORS handling.

- **Supabase RLS Policies** — Row-level security policies required careful setup to allow public read access for research data while protecting admin-only endpoints.

- **Gemini JSON Mode** — Ensuring consistent JSON output from Gemini required specific generation config with `response_mime_type: "application/json"` and structured prompts.

- **State Management** — Coordinating between localStorage (for auth tokens) and React Context (for user state) required careful synchronization, especially on page refresh.

- **PDF Text Extraction** — Some PDFs had encoding issues or were image-based. Added fallback handling and text normalization.

- **Absolute Positioning Conflicts** — "Back to Overview" buttons initially overlapped the header. Switched to normal flow positioning with margins.

## 9. What's Next

- **Enhanced PDF Processing** — Support for image-based PDFs using OCR (Tesseract or cloud OCR APIs).

- **Real-Time Donation Feed** — WebSocket integration for live donation updates on the public donate page.

- **Advanced Filtering** — Multi-year selection, search by research topic, and tag-based filtering on the timeline.

- **Email Scheduling** — Automated email generation and sending on a schedule (weekly/monthly summaries).

- **Export Functionality** — Generate PDF reports of research milestones and donation summaries for stakeholders.

- **Analytics Dashboard** — Admin-only analytics showing donation trends, most-viewed research, and engagement metrics.

- **Multi-Language Support** — Internationalization for research summaries and email templates.

- **Mobile Optimization** — Responsive design improvements for mobile viewing of timelines and charts.

## 10. Environment Variables

**Backend (`.env` in `backend/` directory):**

```bash
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_long_random_secret_for_jwt_signing
PORT=8000
GEMINI_MODEL_NAME=gemini-2.5-flash  # Optional, defaults to gemini-2.5-flash
```

**Frontend (optional, if using environment-specific Supabase URLs):**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

_Note: Currently, Supabase credentials are hardcoded in `frontend/src/services/api.js`. For production, move these to environment variables._
 <br /> <br /> The code ("Code") in this repository was created solely by the student teams during a coding competition hosted by JPMorgan Chase Bank, N.A. ("JPMC"). JPMC did not create or contribute to the development of the Code. This Code is provided AS IS and JPMC makes no warranty of any kind, express or implied, as to the Code, including but not limited to, merchantability, satisfactory quality, non-infringement, title or fitness for a particular purpose or use.