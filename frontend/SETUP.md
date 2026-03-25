# NeuroPath AI - React Frontend Setup Guide

## Project Overview

This is a production-level React (Vite) frontend for NeuroPath AI that integrates seamlessly with the FastAPI backend at `http://127.0.0.1:8001`.

## Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.2
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Modern CSS with Flexbox/Grid

## Project Structure

```
src/
├── api/
│   ├── apiClient.js          # Centralized Axios instance with interceptors
│   └── endpoints.js          # Organized API endpoint functions
├── components/
│   ├── Navbar.jsx            # Navigation bar with auth-aware links
│   ├── Navbar.css
│   ├── ProtectedRoute.jsx    # Route wrapper requiring authentication
│   ├── LoadingSpinner.jsx    # Reusable loading indicator
│   ├── LoadingSpinner.css
│   ├── Toast.jsx             # Toast notification system
│   └── Toast.css
├── context/
│   └── AuthContext.jsx       # Global authentication state management
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Home.css
│   ├── Login.jsx             # User authentication
│   ├── Register.jsx          # New user registration
│   ├── Auth.css              # Auth pages styling
│   ├── Dashboard.jsx         # Main dashboard with metrics
│   ├── Dashboard.css
│   ├── ResumeAnalysis.jsx    # Resume upload and analysis
│   ├── ResumeAnalysis.css
│   ├── AIInterview.jsx       # AI interview system
│   ├── AIInterview.css
│   ├── LearningRoadmap.jsx   # Personalized learning paths
│   ├── LearningRoadmap.css
├── App.jsx                   # Main router and layout
├── App.css
├── main.jsx                  # React entry point
├── index.css                 # Global styles
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── index.html                # HTML template
```

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- FastAPI backend running at `http://127.0.0.1:8001`

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd d:\PROJECTS\NeuroPath_AI\frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend will be available at `http://localhost:3000`
   - Vite dev server includes hot reload

4. **Build for production**
   ```bash
   npm run build
   ```
   - Outputs optimized build to `dist/` directory

## Core Features

### 1. Authentication System
- **Register**: New user account creation
- **Login**: User authentication with JWT token storage
- **Logout**: Clear session and redirect to login
- **Protected Routes**: Automatically redirect unauthenticated users to login

**Flow**:
```
Register → Login → Token stored in localStorage → Access Dashboard
```

### 2. Resume Analysis
- Upload resume (PDF/DOC format)
- AI analysis provides:
  - Resume score (0-100)
  - Top career match
  - Detected skills
  - Recommended careers
  - Missing skills
  - Domain scores

### 3. AI Interview System
- Multi-stage process:
  1. Upload resume to initialize interview
  2. Answer AI-generated questions
  3. View results with weak areas and strengths

### 4. Learning Roadmap
- Input desired skills
- Generate personalized learning path with:
  - Phase-based structure (Phase 1, 2, 3...)
  - Duration estimates
  - Topics and resources
  - Practical projects

### 5. Dashboard
- Central hub with:
  - Performance metrics
  - Quick action buttons
  - User statistics
  - Navigation to all features

## API Integration

### API Client Architecture

**File**: `src/api/apiClient.js`
```javascript
- Base URL: http://127.0.0.1:8001
- Request Interceptor: Auto-injects JWT token from localStorage
- Response Interceptor: Handles 401 errors, clears token, redirects to /login
```

### Endpoint Organization

**File**: `src/api/endpoints.js`

Endpoints organized by feature:
- `authAPI.register()` - User registration
- `authAPI.login()` - User login
- `resumeAPI.analyze()` - Resume analysis
- `interviewAPI.startInterview()` - Initialize interview
- `interviewAPI.submitInterview()` - Submit answers
- `careerAPI.placementAnalysis()` - Placement readiness
- `careerAPI.learningRoadmap()` - Generate roadmap
- `dashboardAPI.getData()` - Dashboard metrics

## Authentication Flow

### Token Storage
```javascript
localStorage.setItem('token', 'jwt_token_value');
localStorage.setItem('user', JSON.stringify({name, email}));
```

### Request Header
```
Authorization: Bearer <token>
```

### Error Handling
- 401 responses automatically clear localStorage and redirect to `/login`
- All errors display in toast notifications
- Console errors show full backend response for debugging

## Styling & UI Patterns

### Color Scheme
- **Primary Gradient**: `#667eea` → `#764ba2`
- **Success**: `#10b981`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`
- **Background**: `#f5f7fa`

### Component Patterns
- **Cards**: Shadow `0 4px 12px rgba(0,0,0,0.1)`, border-radius: 8px
- **Loading Spinner**: 50px circle, rotating animation
- **Toast**: Auto-dismiss after 4s, fixed bottom-right
- **Forms**: Centered card layout, gradient backgrounds
- **Buttons**: Hover effects, smooth transitions

## Environment Configuration

### Development (`.env.development`)
```
VITE_API_URL=http://127.0.0.1:8001
VITE_PORT=3000
```

### Production (`.env.production`)
```
VITE_API_URL=[your_production_url]
```

## Debugging

### Browser Console
- All errors logged with full backend response
- Check `localStorage` for token/user data

### Network Tab
- Monitor API calls and responses
- Verify Authorization header includes token

### Application Tab (DevTools)
- Check `Application > Local Storage` for auth data
- Verify token format: `Bearer <jwt>`

### React DevTools
- Inspect Context: AuthContext shows user, token, isAuthenticated
- Check component re-renders during auth state changes

## Common Issues & Solutions

### Issue: 401 Unauthorized on every request
**Solution**: Ensure backend is running at `http://127.0.0.1:8001` and token is stored in localStorage

### Issue: Login page stuck on loading
**Solution**: Check browser console for API errors; verify backend response format

### Issue: Protected routes redirect immediately
**Solution**: Ensure token is valid and not expired; try logging in again

### Issue: CORS errors
**Solution**: Verify vite.config.js proxy is correctly configured; restart dev server

## Performance Optimization

- Code splitting with React Router (each page lazy loaded)
- CSS modules prevent style conflicts
- Vite's fast HMR during development
- Optimized bundle with `npm run build`

## Testing the Frontend

### Manual Test Checklist
- [ ] Register new account
- [ ] Login with valid credentials
- [ ] Access dashboard (protected route)
- [ ] Upload and analyze resume
- [ ] Start and complete AI interview
- [ ] Generate learning roadmap
- [ ] Logout and verify redirect
- [ ] Try accessing protected route without login

### API Contract Validation

**Register**: `POST /auth/register`
```json
Request: {name, email, password}
Response: {message: "User created successfully"}
```

**Login**: `POST /auth/login`
```json
Request: {email, password}
Response: {access_token, token_type: "bearer"}
```

**Resume Analysis**: `POST /analyze-resume`
```json
Request: FormData with resume file
Response: {detected_skills, recommended_careers, top_career, missing_skills, resume_score, career_explanation, best_domain, domain_scores}
```

**AI Interview Start**: `POST /start-ai-interview`
```json
Request: FormData with resume file
Response: {skills, questions}
```

**AI Interview Submit**: `POST /submit-interview`
```json
Request: {answers: [...], skills: [...]}
Response: {results, weak_areas}
```

## Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

Remember to update `VITE_API_URL` environment variable to your production backend URL.

## Support

For issues or questions, refer to:
- Backend API docs: http://127.0.0.1:8001/docs (FastAPI Swagger)
- React docs: https://react.dev
- Vite docs: https://vitejs.dev
- Axios docs: https://axios-http.com
