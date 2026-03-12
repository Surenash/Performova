# Performova LMS

Performova is a modern, AI-driven Learning Management System (LMS) designed to turn mandatory corporate training into engaging, habit-forming daily learning. It combines dynamic interactive lessons, continuous gamification, and real-time behavioral analytics into a single platform.

## Key Features

- **AI-Powered Course Generation:** Upload PDFs, videos, or text documents, and the AI (Gemini 2.5 Flash) will automatically generate a complete curriculum with lessons and interactive quizzes.
- **Bite-Sized Interactive Lessons:** Lessons include various interactive elements like Multiple Choice, True/False, Fill-in-the-blank, Match the Pair, and Drag & Drop sorting.
- **AI Learning Coach:** An integrated chatbot (Gemini-powered) available 24/7 to answer course-related questions and provide guidance.
- **Video Processing:** Automatic transcoding of uploaded videos and secure transcription using Faster-Whisper.
- **Gamification:** Implementation of streaks, XP points, and badges to incentivize continuous engagement.
- **Admin Dashboard:** Data-dense analytics for managers to track team progress, department health, and knowledge gaps.
- **Matrix Admin Panel:** A built-in administrative interface for direct database management.

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** Radix UI & Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit
- **Charts:** Recharts

### Backend
- **Framework:** FastAPI
- **Database:** SQLite (with SQLAlchemy Async & aiosqlite)
- **Migrations:** Alembic
- **AI Orchestration:** Google Gemini 2.5 Flash (via `google-genai` SDK)
- **Audio/Video:** Faster-Whisper (local transcription), FFmpeg (transcoding)
- **Storage:** AWS S3 (via Boto3)
- **Auth:** OAuth2 with JWT (python-jose, passlib)

## Project Structure

```text
├── backend/                # FastAPI Application
│   ├── alembic/            # Database migrations
│   ├── routers/            # API Route handlers
│   ├── ai_chat.py          # AI Coach logic (Gemini)
│   ├── course_generation.py# AI Course generator logic
│   ├── database.py         # SQLAlchemy configuration
│   ├── main.py             # Entry point & app initialization
│   ├── models.py           # SQLAlchemy database models
│   ├── seed_data.py        # Initial database seeding
│   └── video_processing.py # FFmpeg & Whisper integration
├── src/                    # React Frontend
│   ├── components/         # Reusable UI & Interactive elements
│   ├── layouts/            # Page layouts (Main, Dashboard)
│   ├── pages/              # Application views (Landing, Admin, Learner)
│   ├── lib/                # API & Utility functions
│   └── App.tsx             # Main router configuration
└── lms.db                  # Local SQLite database
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.12 or higher
- FFmpeg (required for video processing)
- A Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory (see `.env.example` for reference):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   S3_BUCKET_NAME=your_bucket_name
   ```

4. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Administrative Access

- **Admin Dashboard:** Navigate to `/admin` in the frontend (Login with `admin@performova.com` / `admin`).
- **Matrix Admin Panel:** Navigate to `http://localhost:8000/admin` for direct database management.

## License

This project is licensed under the MIT License.
