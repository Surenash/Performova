# Performova LMS

Performova is a modern Learning Management System (LMS) designed to turn mandatory training into engaging, habit-forming daily learning. It combines dynamic interactive lessons, continuous gamification, and real-time behavioral analytics into a single platform.

This repository serves as the unified frontend application, merging the best features from the "Emergent" design strategy (gamification, continuous learning, and streak tracking) and the "AI Studio" model (dark mode UI elements, clean layouts, and rich analytics).

## Key Features

- **Dynamic Island Navigation:** A sleek, floating header inspired by modern design paradigms to access features quickly and toggle between Light and Dark modes.
- **AI-Powered Learning Paths:** Analyzes employee roles, knowledge gaps, and learning speed to automatically generate custom curriculums.
- **Bite-Sized Interactive Lessons:** Ditching hour-long videos for 5-minute interactive exercises with immediate feedback.
- **Gamification That Works:** Implements streaks, badges, weekly leaderboards, and XP tracking to incentivize continuous engagement.
- **Real-Time Analytics:** Provides managers with a bird's-eye view of team health, completion rates by department, and identified knowledge gaps.
- **Always-on AI Coaching:** An integrated chatbot within the Learner Dashboard that answers course-related questions 24/7.
- **Custom Content Upload:** Supports dragging and dropping PDFs, videos, or SCORM packages directly into the learning infrastructure.

## Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Performova-combined
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## Project Structure

- `src/components/`: Reusable UI components (like badges, buttons, cards from Shadcn UI).
- `src/layouts/`: Layout wrappers for public (MainLayout) and dashboard (DashboardLayout) pages.
- `src/pages/`: Main application views.
  - `LandingPage.tsx`: The primary marketing site showcasing features.
  - `LoginPage.tsx`: Authentication entry point simulating roles (Admin vs. Learner).
  - `LearnerDashboard.tsx`: Dashboard for employees to track paths, streaks, and interact with the AI Coach.
  - `AdminDashboard.tsx`: Control center for managers to view analytics and manage teams.
- `src/App.tsx`: Central router configuration.
- `src/index.css`: Global stylesheet defining custom CSS properties for Light and Dark themes.

## License

This project is licensed under the MIT License.
