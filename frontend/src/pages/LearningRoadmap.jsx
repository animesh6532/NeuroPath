import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { interviewAPI } from "../api/endpoints";
import "./LearningRoadmap.css";

function LearningRoadmap() {
  const { analysisData, interviewData, roadmapData, setRoadmapData } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("roadmap_progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ── Auto-fetch roadmap when we have interview data and no roadmap yet ────
  useEffect(() => {
    const fetchRoadmap = async () => {
      // Only fetch if we have interview data and no roadmap yet
      if (!interviewData) return;
      if (Array.isArray(roadmapData) && roadmapData.length > 0) return;

      const weaknesses = Array.isArray(interviewData?.weaknesses)
        ? interviewData.weaknesses
        : [];
      const missingSkills = Array.isArray(analysisData?.missing_skills)
        ? analysisData.missing_skills
        : [];

      // Need at least one input to generate a meaningful roadmap
      // If both are empty the backend will still return a default roadmap
      try {
        setLoading(true);
        setError("");

        const payload = {
          weaknesses,
          missing_skills: missingSkills,
          domain: analysisData?.best_domain || "General",
        };

        const response = await interviewAPI.roadmap(payload);
        // After axios interceptor: response.data = inner `data` field
        // Backend returns { topics: [...] } → AppContext.setRoadmapData handles both shapes
        const rawData = response?.data;
        if (rawData) {
          setRoadmapData(rawData);
        } else {
          setError("Roadmap response was empty.");
        }
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
        setError(
          "Could not generate roadmap. Make sure the backend is running at http://127.0.0.1:8001"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [interviewData, analysisData]); // re-run when interview/analysis data changes

  // ── Guard: no interview data yet ─────────────────────────────────────────
  if (!interviewData) {
    return (
      <div className="roadmap-page">
        <div
          className="roadmap-card"
          style={{ maxWidth: "900px", width: "100%", textAlign: "center" }}
        >
          <h2>Access Restricted</h2>
          <p style={{ color: "#94a3b8" }}>
            Complete an AI interview first to generate your personalised
            learning roadmap.
          </p>
        </div>
      </div>
    );
  }

  // ── Checkbox progress handlers ───────────────────────────────────────────
  const handleToggleStep = (skillIndex, stepIndex) => {
    const key = `${skillIndex}-${stepIndex}`;
    const newProgress = { ...progress, [key]: !progress[key] };
    setProgress(newProgress);
    localStorage.setItem("roadmap_progress", JSON.stringify(newProgress));
  };

  const safeRoadmap = Array.isArray(roadmapData) ? roadmapData : [];
  const totalSteps = safeRoadmap.reduce(
    (acc, m) => acc + (Array.isArray(m.steps) ? m.steps.length : 0),
    0
  );
  const completedSteps = Object.values(progress).filter(Boolean).length;
  const progressPct =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="roadmap-page">
      <div className="roadmap-card" style={{ maxWidth: "900px", width: "100%" }}>
        <h1>Learning Roadmap</h1>
        <p>
          Your personalised step-by-step improvement plan based on your resume
          and interview performance.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#94a3b8", fontSize: "18px" }}>
              ⚙️ Generating your custom learning path...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#f87171" }}>{error}</p>
            <button
              onClick={() => {
                setError("");
                // Force re-fetch by briefly clearing roadmap
                setRoadmapData([]);
              }}
              style={{
                marginTop: "10px",
                padding: "8px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : safeRoadmap.length > 0 ? (
          <>
            {/* Overall progress bar */}
            <div
              style={{
                marginBottom: "24px",
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  color: "#94a3b8",
                  fontSize: "14px",
                }}
              >
                <span>Overall Progress</span>
                <span>
                  {completedSteps}/{totalSteps} steps · {progressPct}%
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            <div className="roadmap-content">
              {safeRoadmap.map((module, skillIndex) => {
                const steps = Array.isArray(module.steps) ? module.steps : [];
                const resources = Array.isArray(module.resources)
                  ? module.resources
                  : [];
                const moduleCompleted = steps.filter(
                  (_, si) => !!progress[`${skillIndex}-${si}`]
                ).length;

                return (
                  <div
                    key={skillIndex}
                    className="roadmap-item"
                    style={{
                      marginBottom: "30px",
                      padding: "20px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <h2 style={{ margin: 0, color: "#60a5fa" }}>
                        {module.skill || module.topic || `Topic ${skillIndex + 1}`}
                      </h2>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {steps.length > 0 && (
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#94a3b8",
                            }}
                          >
                            {moduleCompleted}/{steps.length}
                          </span>
                        )}
                        <span
                          style={{
                            padding: "5px 10px",
                            background: "rgba(59,130,246,0.2)",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#93c5fd",
                          }}
                        >
                          {module.level || module.difficulty || "Intermediate"}
                        </span>
                      </div>
                    </div>

                    {steps.length > 0 && (
                      <>
                        <h4 style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                          Action Plan:
                        </h4>
                        <div
                          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                        >
                          {steps.map((step, stepIndex) => {
                            const isChecked = !!progress[`${skillIndex}-${stepIndex}`];
                            return (
                              <label
                                key={stepIndex}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                  padding: "10px",
                                  background: "rgba(0,0,0,0.2)",
                                  borderRadius: "8px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleStep(skillIndex, stepIndex)}
                                  style={{ width: "18px", height: "18px" }}
                                />
                                <span
                                  style={{
                                    textDecoration: isChecked ? "line-through" : "none",
                                    color: isChecked ? "#64748b" : "#f8fafc",
                                  }}
                                >
                                  {step}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {resources.length > 0 && (
                      <>
                        <h4
                          style={{
                            color: "#cbd5e1",
                            marginTop: "20px",
                            marginBottom: "10px",
                          }}
                        >
                          Resources:
                        </h4>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {resources.map((res, resIdx) => (
                            <li key={resIdx} style={{ marginBottom: "8px" }}>
                              <a
                                href={res}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#3b82f6", textDecoration: "none" }}
                              >
                                🔗 {res}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="roadmap-empty">
            <p>
              No roadmap available yet. Upload a resume and complete an AI
              interview to generate your personalised learning path.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningRoadmap;
