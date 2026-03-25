# NeuroPath AI - Frontend

A modern React-based frontend for the NeuroPath AI career intelligence platform.

## Features

- **User Authentication** - Login and registration
- **Resume Upload & Analysis** - Upload resumes and get AI-powered analysis
- **Skills Analysis** - Identify skills from resumes and track skill gaps
- **Career Recommendations** - AI-powered career path suggestions
- **Interactive Interviews** - Practice interviews with AI assistant
- **Learning Roadmaps** - Personalized learning paths for career development
- **Dashboard** - View all analytics and recommendations

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern layouts

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── SkillCard.jsx
│   │   ├── CareerCard.jsx
│   │   ├── Dashboard.jsx
│   │   └── Interview.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   └── Result.jsx
│   ├── services/            # API integration
│   │   └── api.js          # Axios instance and API calls
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── index.html              # HTML template
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with environment variables:
```env
VITE_API_URL=http://localhost:8000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

## API Integration

The frontend connects to the backend API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Resume
- `POST /resume/upload` - Upload resume
- `GET /resume/analysis/:id` - Get resume analysis

### Dashboard
- `GET /dashboard` - Get dashboard data

### Career
- `GET /career/recommendations` - Get career recommendations
- `GET /career/:name` - Get career details

### Skills
- `GET /skills/analysis` - Get skills analysis
- `GET /skills/gap/:career` - Get skill gaps for a career

### Learning
- `GET /learning/path/:skill` - Get learning path
- `PUT /learning/progress/:skillId` - Update learning progress

### Interview
- `GET /interview/questions` - Get interview questions
- `POST /interview/submit` - Submit interview answers

## Components

### Navbar
Navigation bar with links and authentication status

### ResumeUpload
Resume upload form with validation

### Dashboard
Main dashboard with skills and career recommendations

### SkillCard
Individual skill display with levels and gaps

### CareerCard
Career recommendation card with match scores

### Interview
Interactive interview component with questions and answers

## Pages

### Login
User login page

### Register
User registration page

### Home
Main dashboard page with all features

### Result
Result page showing analysis results

## Author

NeuroPath AI Team
