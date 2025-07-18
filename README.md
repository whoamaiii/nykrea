"# Student Well-being Dashboard

## Overview

This React application is designed to track and analyze student well-being, with a focus on neurodiversity. It allows teachers to log students' feelings and sensory inputs, view timelines, analyze patterns through charts, and generate AI-powered insights using the Google Gemini API.

The app uses localStorage for data persistence and includes demo data for initial setup.

## Features

- **Student Management**: Add and select students via the sidebar.
- **Logging**: Log feelings (e.g., Happy, Sad) and sensory inputs (Visual, Auditory, Tactile) with intensities and notes.
- **Timeline**: View, edit, and delete logs in a chronological timeline.
- **Recent Activity**: Quick view of the most recent logs.
- **Analytics**: Interactive charts showing mood distribution, trends, sensory intensities, correlations, and patterns.
- **AI Insights**: Generate actionable insights from log data using Gemini AI.

## Tech Stack

- React 18
- Vite for bundling
- Tailwind CSS for styling
- Recharts for charts
- Date-fns for date handling
- Google Gemini API for AI insights

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure API key for AI features:
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key to the `.env` file
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   ```bash
   cp .env.example .env
   # Then edit .env and add your API key
   ```
4. Run the development server: `npm run dev`
5. Open http://localhost:5173 in your browser.

**Note**: The `.env` file is gitignored to protect your API key. Never commit API keys to version control.

## Usage

- Select a student from the sidebar or add a new one.
- In the Logging tab, log feelings or sensory inputs.
- Switch to Analytics tab for data visualizations.
- Click 'Get Gemini AI Insights' for AI analysis (requires logs and valid API key).

## 📚 Documentation

- **[Development Guide](DEVELOPMENT.md)** - Architecture, patterns, and development guidelines
- **[Bug Fixes](BUGFIXES.md)** - Recent bug fixes and technical details  
- **[Contributing](CONTRIBUTING.md)** - How to contribute to the project

## 🔧 Recent Bug Fixes

This version includes fixes for:
- ✅ Inconsistent timestamp handling causing analytics issues
- ✅ Student deletion logic error  
- ✅ Log ID collision prevention

See [BUGFIXES.md](BUGFIXES.md) for detailed technical information.

## Components

- **App.jsx**: Main app component managing state, students, and log operations. Uses localStorage for persistence.
- **Sidebar.jsx**: Displays student list and allows adding new students.
- **MainContent.jsx**: Handles logging and analytics tabs, AI insights generation.
- **StudentLoggingView.jsx**: UI for logging feelings and sensory inputs.
- **LogTimeline.jsx**: Displays and manages (edit/delete) the log history.
- **RecentActivity.jsx**: Shows the most recent logs.
- **Analytics.jsx**: Renders various charts and stats using Recharts.
- **InsightsModal.jsx**: Modal for displaying AI insights.
- **utils/analyticsHelpers.js**: Helper functions for data analysis and chart preparation.

## Data Structure

Students are objects with id, name, and logs array. Logs have id, type ('feeling' or 'sensory'), value, timestamp, and optional notes/description/intensity/category.

## Notes

- This is a POC; enhance security (e.g., API keys, authentication).
- Data is stored in localStorage; consider backend integration for persistence.
- Expand analytics and AI prompts as needed.

## License

MIT License (or specify your license)." 