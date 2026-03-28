import API from "./axios";

/* =========================
   AUTH API
========================= */
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
};

/* =========================
   RESUME API
========================= */
export const resumeAPI = {
  analyze: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return API.post("/analyze-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

/* =========================
   DASHBOARD API
========================= */
export const dashboardAPI = {
  generate: (payload) => API.post("/dashboard", payload),
  test: () => API.get("/dashboard"),
};

/* =========================
   AI INTERVIEW API
========================= */
export const interviewAPI = {
  start: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return API.post("/start-ai-interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  submit: (payload) => API.post("/submit-interview", payload),

  direct: (payload) => API.post("/ai-interview", payload),
};

/* =========================
   PLACEMENT API
========================= */
export const placementAPI = {
  analyze: (payload) => API.post("/placement-analysis", payload),
};

/* =========================
   LEARNING ROADMAP API
========================= */
export const roadmapAPI = {
  generate: (payload) => API.post("/learning-roadmap", payload),
};

/* =========================
   PROCTORING API
========================= */
export const proctoringAPI = {
  analyze: (payload) => API.post("/proctoring/analyze-events", payload),
};