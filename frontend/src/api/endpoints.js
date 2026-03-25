import API from './api';

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

// ============ RESUME ENDPOINTS ============
export const resumeAPI = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============ INTERVIEW ENDPOINTS ============
export const interviewAPI = {
  startInterview: async (file) => {
    if (!file) {
      return { data: { questions: [] } };
    }
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/start-ai-interview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submitInterview: (data) => API.post('/submit-interview', data),
};

// ============ PLACEMENT & ROADMAP ENDPOINTS ============
export const careerAPI = {
  placementAnalysis: (data) => API.post('/placement-analysis', data),
  learningRoadmap: (data) => API.post('/learning-roadmap', data),
};

// ============ DASHBOARD ENDPOINTS ============
export const dashboardAPI = {
  // frontend uses context only per requirements
  getData: null,
};
