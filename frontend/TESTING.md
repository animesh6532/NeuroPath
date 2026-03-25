# NeuroPath AI Frontend - Quick Start & Testing Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Verify Backend is Running
```bash
# Backend should be running at http://127.0.0.1:8001
# Check: Open browser and navigate to http://127.0.0.1:8001/docs
# You should see FastAPI Swagger documentation
```

### Step 2: Install Dependencies
```bash
cd d:\PROJECTS\NeuroPath_AI\frontend
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```
- Frontend will start at `http://localhost:3000`
- Vite will show HMR (Hot Module Reload) is connected
- Check console for no errors

### Step 4: Test Authentication Flow
1. Open `http://localhost:3000` in browser
2. Click "Get Started Free"
3. Fill registration form and submit
4. You should see success toast and redirect to login
5. Login with your credentials
6. You should be redirected to dashboard
7. Check browser DevTools > Application > Local Storage:
   - Should have `token` and `user` stored

✅ **If all steps pass, backend and frontend are properly integrated!**

---

## 📋 Comprehensive Testing Checklist

### Authentication Tests

**Test 1: User Registration**
- [ ] Navigate to `/register`
- [ ] Enter valid email and password
- [ ] See success toast "Registration Successful 🚀"
- [ ] Redirected to `/login` after 1.5 seconds
- [ ] Check: No tokens in localStorage yet

**Test 2: User Login**
- [ ] Navigate to `/login`
- [ ] Enter registered email and password
- [ ] See success toast
- [ ] Redirected to `/dashboard`
- [ ] Check localStorage has `token` and `user`

**Test 3: Invalid Login**
- [ ] Try login with wrong password
- [ ] See error toast with backend error message
- [ ] Remain on login page
- [ ] No token stored in localStorage

**Test 4: Protected Routes**
- [ ] Clear localStorage (`Application > Local Storage > Clear All`)
- [ ] Try accessing `http://localhost:3000/dashboard`
- [ ] Should redirect to `/login`
- [ ] Try `/resume`, `/interview`, `/roadmap` - all should redirect to login

**Test 5: Logout**
- [ ] Login first (follow Test 2)
- [ ] Click logout button in navbar
- [ ] Redirected to `/login`
- [ ] localStorage cleared (token and user gone)

---

### Dashboard Tests

**Test 6: Dashboard Load**
- [ ] Login successfully
- [ ] Navigate to `/dashboard`
- [ ] Should see:
  - 4 metric cards (Resume Score, Interview Score, Placement Readiness, Learning Progress)
  - Action buttons (Analyze Resume, Take Interview, Learning Roadmap)
  - Stats section with career info
  - Logout button

**Test 7: Dashboard Navigation**
- [ ] From dashboard, click "Analyze Resume" button
- [ ] Should navigate to `/resume`
- [ ] Click back, dashboard metrics should persist

---

### Resume Analysis Tests

**Test 8: Resume Upload & Analysis**
- [ ] Navigate to `/resume`
- [ ] Select a resume file (PDF or DOC format)
- [ ] Click "Analyze Resume" button
- [ ] Should show loading spinner
- [ ] Results should display with:
  - Resume score circle (0-100)
  - Top career match badge
  - Detected skills as tags
  - Career recommendations
  - Missing skills list
  - Domain scores with progress bars

**Test 9: Resume Error Handling**
- [ ] Try uploading without selecting file
- [ ] Should show error toast
- [ ] No API call made

**Test 10: Multiple Resume Uploads**
- [ ] Upload first resume, see results
- [ ] Upload different resume
- [ ] Previous results cleared, new results shown
- [ ] No state conflicts

---

### AI Interview Tests

**Test 11: Interview Flow - Upload Stage**
- [ ] Navigate to `/interview`
- [ ] See upload section with file input
- [ ] Select resume file
- [ ] Click "Start Interview"
- [ ] Should show loading spinner
- [ ] After loading, should move to interview stage

**Test 12: Interview Flow - Questions Stage**
- [ ] Should see:
  - Current question displayed
  - Progress bar (Question X of Y)
  - Textarea for answer
  - Navigation buttons (Previous, Next, Submit)
- [ ] Type answer in textarea
- [ ] Click Next button
- [ ] Should move to next question (answer saved)
- [ ] Click Previous to verify answer is still there

**Test 13: Interview Flow - Results Stage**
- [ ] After answering all questions, click Submit
- [ ] Should show loading spinner
- [ ] Results should display with:
  - Overall score
  - Weak areas list
  - Strengths list
  - "Start Learning" button
  - "Take Another Interview" button

**Test 14: Interview Restart**
- [ ] From interview results, click "Take Another Interview"
- [ ] Should reset to upload stage
- [ ] Previous answers not saved in state

---

### Learning Roadmap Tests

**Test 15: Generate Roadmap**
- [ ] Navigate to `/roadmap`
- [ ] See default skills: "Advanced React", "System Design", "Database Optimization"
- [ ] Click "Generate Roadmap"
- [ ] Should show loading spinner
- [ ] Roadmap should display with phases:
  - Phase 1, 2, 3... cards
  - Duration for each phase
  - Topics list
  - Resources list
  - Projects list
  - Phase connectors (↓ arrows)

**Test 16: Add Custom Skills**
- [ ] Clear default skills
- [ ] Add custom skill (e.g., "Python")
- [ ] Click "Generate Roadmap"
- [ ] Should generate roadmap for that skill

**Test 17: Roadmap Actions**
- [ ] Click "Start Learning" button
- [ ] Should navigate to external resource or show message
- [ ] Click "Download PDF" (if implemented)
- [ ] Should download roadmap

---

### UI/UX Tests

**Test 18: Responsive Design**
- [ ] Open DevTools (F12)
- [ ] Switch to mobile view (375px width)
- [ ] Pages should stack vertically
- [ ] Buttons/inputs should be clickable
- [ ] Text should be readable
- [ ] No horizontal scrolling

**Test 19: Loading States**
- [ ] All async operations show loading spinner
- [ ] Buttons should be disabled during loading
- [ ] No double submissions possible

**Test 20: Error Notifications**
- [ ] Trigger various errors (missing file, invalid input)
- [ ] Toast notifications appear bottom-right
- [ ] Auto-dismiss after 4 seconds
- [ ] Show proper error icons (✓ success, ✕ error, i info)

**Test 21: Toast Notifications**
- [ ] Success toast: Green background, checkmark icon
- [ ] Error toast: Red background, X icon
- [ ] Info toast: Blue background, i icon
- [ ] All auto-dismiss without user interaction

---

### Navigation Tests

**Test 22: Navbar Navigation - Authenticated**
- [ ] Login and check navbar shows:
  - Logo "🧠 NeuroPath AI"
  - Home link
  - Dashboard link
  - Resume link
  - Interview link
  - Roadmap link
  - Logout button

**Test 23: Navbar Navigation - Unauthenticated**
- [ ] Logout and check navbar shows:
  - Logo "🧠 NeuroPath AI"
  - Home link
  - Login button
  - Register button

**Test 24: Navbar Active Links**
- [ ] Navigate to different pages
- [ ] Active link should be highlighted
- [ ] Clicking navbar links navigates correctly

---

## 🔥 API Integration Validation

### Verify API Endpoints

**Endpoint 1: Register**
- **URL**: POST `http://127.0.0.1:8001/auth/register`
- **Request**: `{name: string, email: string, password: string}`
- **Response**: `{message: string}` or error with 422/400 status
- **Test**: Fill register form, submit, check Network tab for request/response

**Endpoint 2: Login**
- **URL**: POST `http://127.0.0.1:8001/auth/login`
- **Request**: `{email: string, password: string}`
- **Response**: `{access_token: string, token_type: string}`
- **Test**: Login and verify token stored in localStorage

**Endpoint 3: Resume Analysis**
- **URL**: POST `http://127.0.0.1:8001/analyze-resume`
- **Request**: FormData with resume file
- **Response**: Resume analysis data with skills, careers, scores
- **Test**: Upload resume and verify results display

**Endpoint 4: Start Interview**
- **URL**: POST `http://127.0.0.1:8001/start-ai-interview`
- **Request**: FormData with resume file
- **Response**: `{skills: [], questions: []}`
- **Test**: Start interview and verify questions load

**Endpoint 5: Submit Interview**
- **URL**: POST `http://127.0.0.1:8001/submit-interview`
- **Request**: `{answers: [], skills: []}`
- **Response**: Interview results with scores and feedback
- **Test**: Complete interview and verify results

**Endpoint 6: Learning Roadmap**
- **URL**: POST `http://127.0.0.1:8001/learning-roadmap`
- **Request**: `{missing_skills: []}`
- **Response**: `{roadmap: [{phase, duration, topics, resources, projects}]}`
- **Test**: Generate roadmap and verify phases display

### Network Tab Inspection

1. Open DevTools (F12) → Network tab
2. Clear previous requests
3. Perform action (login, upload resume, etc.)
4. Check the request:
   - URL correct
   - Method correct (POST/GET)
   - Headers include `Authorization: Bearer <token>`
   - Request body properly formatted
5. Check the response:
   - Status 200-201 for success
   - Status 400-500 for errors
   - Response JSON properly formatted

---

## 🐛 Debugging Guide

### Common Issues & Solutions

**Issue: Request shows 401 Unauthorized**
- Check: Is token in localStorage?
- Check: Is token being sent in Authorization header?
- Solution: Clear localStorage and login again
- Debug: Open DevTools > Network > Click request > Headers > Authorization header

**Issue: CORS error in console**
- Check: Is backend running at http://127.0.0.1:8001?
- Check: vite.config.js proxy configuration
- Solution: Restart dev server (`npm run dev`)

**Issue: API calls show 404 Not Found**
- Check: Is endpoint URL correct in endpoints.js?
- Check: Matches backend route definition?
- Solution: Verify backend has the route endpoint

**Issue: Token not persisting after refresh**
- Check: Is localStorage actually saving token?
- Solution: Open DevTools > Application > Local Storage > Check token key exists
- Debug: Run in console: `JSON.parse(localStorage.getItem('user'))`

**Issue: Form submission not working**
- Check: Are required fields filled?
- Check: Console for any JavaScript errors
- Solution: Check Network tab for failed request
- Debug: Look at response body for validation errors

### Developer Tools Tips

**Console Debugging**
```javascript
// Check auth context in console
// Check stored token
console.log(localStorage.getItem('token'));

// Check stored user
console.log(JSON.parse(localStorage.getItem('user')));

// Check if page has errors
// Look for red error messages
```

**React DevTools**
- Install React DevTools extension
- Inspect AuthContext to see current state
- Watch for re-renders when auth state changes

**Network Monitor**
- Check all requests are being made
- Verify token in Authorization header
- Inspect response bodies for errors
- See timing for slow requests

---

## ✅ Final Validation

When all tests pass:

1. ✅ Frontend loads at http://localhost:3000
2. ✅ Backend accessible at http://127.0.0.1:8001
3. ✅ Auth flow works (register → login → token storage → protected routes)
4. ✅ All pages load and display data
5. ✅ No console errors
6. ✅ No CORS errors
7. ✅ Token included in API requests
8. ✅ Error handling working (toasts display)
9. ✅ Responsive on mobile/tablet/desktop
10. ✅ Logout clears session properly

**🎉 Congratulations! Your NeuroPath AI frontend is fully integrated and tested!**

---

## 📦 Production Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# Output in dist/ folder ready to deploy
# Deploy to Vercel, Netlify, or your server
# Update VITE_API_URL environment variable to production backend
```

---

## 📞 Support

For issues, check:
1. Backend logs at `http://127.0.0.1:8001/docs`
2. Frontend console errors (DevTools F12)
3. Network tab for failed requests
4. This guide's debugging section
