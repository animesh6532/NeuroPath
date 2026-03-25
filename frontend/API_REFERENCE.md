# NeuroPath AI - Frontend API Reference

This document provides a quick reference for all API endpoints used by the React frontend. It serves as a contract between frontend and backend development.

## Base Configuration

```
Base URL: http://127.0.0.1:8001
Port: 8001
Protocol: HTTP

Request Header (all endpoints except auth):
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. User Registration
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password123"
}

Response (201 Created):
{
  "message": "User registered successfully",
  "user_id": "uuid_string"
}

Response (400/422 Error):
{
  "detail": "Email already registered" | "Invalid email format" | "Password too short"
}
```

### 2. User Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "secure_password123"
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}

Response (401 Unauthorized):
{
  "detail": "Invalid email or password"
}
```

**Frontend Behavior**:
- Stores `access_token` in `localStorage` as `token`
- Stores user info in `localStorage` as `user` (JSON object with name/email)
- Includes token in all subsequent requests: `Authorization: Bearer <token>`

---

## Resume Endpoints

### 3. Analyze Resume
```
POST /analyze-resume
Content-Type: multipart/form-data

Request Body:
{
  "file": <PDF or DOC file>,
  "user_id": "optional_user_id"
}

Response (200 OK):
{
  "resume_score": 85,
  "detected_skills": [
    "Python",
    "FastAPI",
    "React",
    "PostgreSQL"
  ],
  "recommended_careers": [
    {
      "career": "Full Stack Developer",
      "match_score": 92,
      "description": "Excellent match for your skills"
    },
    {
      "career": "Backend Developer",
      "match_score": 88,
      "description": "Strong match for backend skills"
    }
  ],
  "top_career": "Full Stack Developer",
  "missing_skills": [
    "System Design",
    "DevOps",
    "AWS"
  ],
  "career_explanation": "Your resume matches Full Stack Developer role with strong Python and React skills...",
  "best_domain": "Technology",
  "domain_scores": {
    "Technology": 92,
    "Finance": 45,
    "Healthcare": 38,
    "Other": 30
  }
}

Response (400 Error):
{
  "detail": "No file provided" | "Invalid file format" | "File too large"
}

Response (401 Unauthorized):
{
  "detail": "Token expired or invalid"
}
```

**Frontend Expectations**:
- Handles both success and error responses with toast notifications
- Displays resume_score as circular progress indicator (0-100)
- Shows detected_skills as tag chips
- Lists recommended_careers as cards with match percentage
- Shows missing_skills as bullet points
- Displays domain_scores as horizontal progress bars

---

## Interview Endpoints

### 4. Start AI Interview
```
POST /start-ai-interview
Content-Type: multipart/form-data

Request Body:
{
  "file": <resume file>,
  "user_id": "optional_user_id"
}

Response (200 OK):
{
  "interview_id": "uuid_string",
  "skills": ["Python", "React", "System Design"],
  "questions": [
    {
      "id": 1,
      "question": "Describe your most complex project and the technologies you used.",
      "category": "experience"
    },
    {
      "id": 2,
      "question": "How do you handle code refactoring in large projects?",
      "category": "technical"
    },
    {
      "id": 3,
      "question": "Tell us about a time you had to debug a production issue.",
      "category": "problem-solving"
    }
  ]
}

Response (400 Error):
{
  "detail": "No file provided" | "Invalid resume"
}
```

**Frontend Expectations**:
- Displays questions one at a time in interview component
- Stores user answers in component state: `{1: "answer1", 2: "answer2", ...}`
- Provides Previous/Next navigation between questions
- Shows progress bar: "Question X of Y"

### 5. Submit Interview Answers
```
POST /submit-interview
Content-Type: application/json

Request Body:
{
  "interview_id": "uuid_string",
  "answers": [
    {
      "question_id": 1,
      "answer": "I built a real-time trading platform using Python and React..."
    },
    {
      "question_id": 2,
      "answer": "I follow SOLID principles and use automated tests..."
    },
    {
      "question_id": 3,
      "answer": "We used distributed logging to trace the issue..."
    }
  ],
  "skills": ["Python", "React", "System Design"]
}

Response (200 OK):
{
  "interview_score": 78,
  "results": [
    {
      "question_id": 1,
      "score": 85,
      "feedback": "Great technical depth demonstrated"
    },
    {
      "question_id": 2,
      "score": 78,
      "feedback": "Good understanding of best practices"
    },
    {
      "question_id": 3,
      "score": 71,
      "feedback": "Consider more systematic debugging approach"
    }
  ],
  "weak_areas": [
    "Problem-solving methodology",
    "Communication clarity"
  ],
  "strengths": [
    "Technical expertise",
    "Project complexity handling",
    "Modern technology stack"
  ],
  "recommendations": [
    "Practice explaining solutions more clearly",
    "Study distributed systems concepts",
    "Work on presentation skills"
  ]
}

Response (400 Error):
{
  "detail": "No answers provided" | "Invalid interview_id"
}
```

**Frontend Expectations**:
- Displays interview_score prominently (0-100)
- Shows results list with individual question scores and feedback
- Lists weak_areas as bullet points
- Lists strengths as achievement badges
- Provides "Take Another Interview" or "Download Report" actions

---

## Career & Learning Endpoints

### 6. Placement Analysis
```
POST /placement-analysis
Content-Type: application/json

Request Body:
{
  "resume_score": 85,
  "interview_score": 78,
  "skills": ["Python", "React"],
  "target_role": "Full Stack Developer"
}

Response (200 OK):
{
  "placement_readiness_score": 82,
  "readiness_level": "High",
  "recommendations": [
    "Improve system design knowledge",
    "Build more portfolio projects",
    "Practice coding interviews"
  ],
  "estimated_timeline": "3-4 months",
  "next_steps": [
    "Complete learning roadmap",
    "Build 2-3 portfolio projects",
    "Practice 50+ coding questions"
  ],
  "salary_range": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  }
}

Response (400 Error):
{
  "detail": "Missing required parameters"
}
```

### 7. Generate Learning Roadmap
```
POST /learning-roadmap
Content-Type: application/json

Request Body:
{
  "missing_skills": ["System Design", "DevOps", "Advanced Algorithms"],
  "current_level": "intermediate",
  "target_role": "Senior Backend Engineer",
  "timeline_weeks": 12
}

Response (200 OK):
{
  "roadmap": [
    {
      "phase": "Phase 1: Fundamentals",
      "duration": "4 weeks",
      "topics": [
        "Distributed Systems Basics",
        "Database Scaling",
        "Caching Strategies"
      ],
      "resources": [
        "System Design Interview course",
        "Database Design fundamentals",
        "Redis documentation"
      ],
      "projects": [
        "Design a Twitter clone",
        "Build a distributed cache"
      ]
    },
    {
      "phase": "Phase 2: Advanced Concepts",
      "duration": "4 weeks",
      "topics": [
        "Microservices Architecture",
        "Kubernetes Basics",
        "Message Queues"
      ],
      "resources": [
        "Microservices patterns book",
        "Kubernetes official docs",
        "RabbitMQ tutorials"
      ],
      "projects": [
        "Build microservices application",
        "Deploy to Kubernetes"
      ]
    },
    {
      "phase": "Phase 3: Practice & Specialization",
      "duration": "4 weeks",
      "topics": [
        "DevOps Tools",
        "CI/CD Pipelines",
        "Performance Optimization"
      ],
      "resources": [
        "AWS/GCP documentation",
        "Jenkins tutorials",
        "Prometheus monitoring"
      ],
      "projects": [
        "Setup complete CI/CD pipeline",
        "Optimize application performance"
      ]
    }
  ]
}

Response (400 Error):
{
  "detail": "Invalid parameters"
}
```

**Frontend Expectations**:
- Displays each phase as a card/section
- Shows phase number (Phase 1, 2, 3...)
- Lists topics, resources, and projects
- Renders vertical timeline with phase connectors (↓ arrows)
- Shows duration for each phase

---

## Dashboard Endpoints

### 8. Get Dashboard Data
```
POST /dashboard
Content-Type: application/json

Request Body:
{
  "user_id": "uuid_string",
  "include_stats": true
}

Response (200 OK):
{
  "resume_score": 85,
  "interview_score": 78,
  "placement_readiness": 82,
  "learning_progress": 65,
  "top_career_match": "Full Stack Developer",
  "skill_level": "Intermediate",
  "learning_focus": "System Design",
  "interviews_taken": 2,
  "recent_activity": [
    {
      "activity": "Resume analyzed",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "activity": "Interview completed",
      "timestamp": "2024-01-14T15:20:00Z"
    }
  ]
}

Response (401 Unauthorized):
{
  "detail": "Token expired"
}
```

**Frontend Expectations**:
- Displays 4 metric cards: Resume Score, Interview Score, Placement Readiness, Learning Progress
- Shows stats: Top Career Match, Skill Level, Learning Focus, Interviews Taken
- Displays recent activity timeline

---

## Error Handling Specification

All endpoints can return these error responses:

### 400 Bad Request
```json
{
  "detail": "Description of what was invalid"
}
```

### 401 Unauthorized
```json
{
  "detail": "Token expired" | "Invalid token" | "Unauthorized"
}
```
**Frontend Action**: Clear localStorage, redirect to /login

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```
**Frontend Action**: Show generic error toast, log to console

---

## Header Requirements

### All Endpoints Except Auth (/auth/*)
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### File Upload Endpoints
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

---

## Request/Response Flow Diagram

```
┌─────────────┐
│  Register   │─────POST─────► /auth/register ───► User Created
└─────────────┘
                                    ▼
┌─────────────┐
│   Login     │─────POST─────► /auth/login ───────► JWT Token
└─────────────┘                                      ▼ (stored)
     │
     └─────────────────────────────────────────────────┘
                          ▼
     ┌──────────────────────────────────────┐
     │  All Protected Endpoints              │
     │  (Authorization: Bearer <token>)      │
     └──────────────────────────────────────┘
                          ▼
     ┌──────────────────────────────────────┐
     │  /analyze-resume                     │
     │  /start-ai-interview                 │
     │  /submit-interview                   │
     │  /placement-analysis                 │
     │  /learning-roadmap                   │
     │  /dashboard                          │
     └──────────────────────────────────────┘
```

---

## Frontend Implementation Details

### API Client Location
- File: `/src/api/apiClient.js`
- Type: Axios instance with interceptors
- Features:
  - Auto-injects token from localStorage
  - Auto-refreshes on 401 response
  - Handles timeouts and retries

### Endpoint Functions Location
- File: `/src/api/endpoints.js`
- Organization: Functions grouped by feature (authAPI, resumeAPI, etc.)
- Usage: Import and use like `authAPI.login({email, password})`

### Example Usage
```javascript
import { authAPI, resumeAPI, interviewAPI } from './api/endpoints.js';

// Register
const registerResponse = await authAPI.register({
  name, email, password
});

// Login
const loginResponse = await authAPI.login({ email, password });

// Analyze Resume
const analysisResponse = await resumeAPI.analyze(formData);

// Start Interview
const interviewResponse = await interviewAPI.startInterview(formData);

// Submit Interview
const resultsResponse = await interviewAPI.submitInterview({
  answers, skills
});
```

---

## CORS Configuration

The frontend is proxied through Vite dev server:
- Frontend requests to `/api/*` are automatically forwarded to backend
- Backend must allow:
  - Methods: GET, POST, OPTIONS
  - Headers: Authorization, Content-Type
  - Credentials: Include

---

## Testing Endpoint Locally

### Using cURL
```bash
# Register
curl -X POST http://127.0.0.1:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://127.0.0.1:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Analyze Resume
curl -X POST http://127.0.0.1:8001/analyze-resume \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

### Using Postman
1. Import this as collection
2. Set base URL: `http://127.0.0.1:8001`
3. Set auth token in Postman environment
4. Test each endpoint with provided request bodies

---

## Version & Changelog

- **Version**: 1.0.0
- **Last Updated**: 2024-01-15
- **Frontend Version**: React 18.2.0 with Vite 5.0.2

### Future Enhancements
- [ ] Refresh token implementation
- [ ] WebSocket for real-time interview feedback
- [ ] File upload progress tracking
- [ ] Batch API operations
- [ ] Offline mode with service workers
