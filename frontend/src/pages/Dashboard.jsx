import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import SkillCard from "../components/SkillCard";
import CareerCard from "../components/CareerCard";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function Dashboard() {
  const { analysisData, recentUpload } = useContext(AppContext);

  if (!analysisData) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-empty">
          <h2>No Resume Analysis Found</h2>
          <p>Please upload your resume first to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const {
    detected_skills,
    recommended_careers,
    top_career,
    missing_skills,
    resume_score,
    career_explanation,
    best_domain,
  } = analysisData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Resume Analysis Dashboard</h1>
        <p>Your AI-powered career intelligence report</p>
        {recentUpload && <span className="recent-file">📄 {recentUpload}</span>}
      </div>

      <div className="stats-grid">
        <StatCard title="Resume Score" value={`${resume_score}%`} />
        <StatCard title="Best Domain" value={best_domain} />
        <StatCard title="Top Career" value={top_career} />
      </div>

      <div className="dashboard-section">
        <h2>Detected Skills</h2>
        <div className="skills-grid">
          {detected_skills?.length > 0 ? (
            detected_skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))
          ) : (
            <p className="empty-text">No skills detected.</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recommended Careers</h2>
        <div className="career-grid">
          {recommended_careers?.length > 0 ? (
            recommended_careers.map((career, index) => (
              <CareerCard key={index} career={career} />
            ))
          ) : (
            <p className="empty-text">No career recommendations found.</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Missing Skills</h2>
        <div className="skills-grid">
          {missing_skills?.length > 0 ? (
            missing_skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))
          ) : (
            <p className="empty-text">No major skill gaps found.</p>
          )}
        </div>
      </div>

      <div className="dashboard-section explanation-box">
        <h2>Career Explanation</h2>
        <p>{career_explanation}</p>
      </div>
    </div>
  );
}

export default Dashboard;