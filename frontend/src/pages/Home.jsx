import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-badge">AI-Powered Career Intelligence</div>

          <h1>
            Build Your Career with <span>NeuroPath AI</span>
          </h1>

          <p className="hero-subtitle">
            Analyze your resume, predict your best domain, prepare for AI-based
            mock interviews, improve placement readiness, and get a personalized
            roadmap — all in one professional platform.
          </p>

          <div className="hero-buttons">
            {!isAuthenticated ? (
              <>
                <button
                  className="hero-btn primary"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                className="hero-btn primary"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <h3>Platform Highlights</h3>
            <ul>
              <li>📄 Resume Intelligence Engine</li>
              <li>🎤 AI Mock Interview System</li>
              <li>📊 Placement Readiness Predictor</li>
              <li>🧠 Personalized Skill Roadmap</li>
              <li>👤 Career Dashboard & Profile</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>What You Can Do</h2>
        <p className="section-subtext">
          Everything is built to support students and job seekers with
          practical, AI-driven insights.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Resume Analyze</h3>
            <p>
              Upload your PDF resume and get detected skills, best domain,
              missing skills, top career path, and score.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>AI Mock Interview</h3>
            <p>
              Practice realistic technical interviews based on your skills and
              improve with AI-generated feedback.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Placement Prediction</h3>
            <p>
              Check how ready you are for placement using resume quality,
              interview performance, and skill gaps.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Learning Roadmap</h3>
            <p>
              Generate a custom roadmap to improve your weak areas and become
              job-ready faster.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;