import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  // ✅ FIX: Move navigation into useEffect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>NeuroPath AI</h1>
          <p className="hero-subtitle">Your Intelligent Career Companion</p>
          <p className="hero-description">
            Leverage AI-powered insights to analyze your resume, practice interviews,
            and get personalized learning paths for your dream career.
          </p>

          <div className="cta-buttons">
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature">
            <div className="feature-icon">📄</div>
            <h3>Resume Analysis</h3>
            <p>Get AI insights on your skills and career potential</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎤</div>
            <h3>AI Interview</h3>
            <p>Practice interviews with intelligent feedback</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🗺️</div>
            <h3>Learning Roadmap</h3>
            <p>Personalized path to master new skills</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Why Choose NeuroPath AI?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>🚀 Accelerate Growth</h3>
            <p>Get targeted insights to fast-track your career development</p>
          </div>
          <div className="benefit-card">
            <h3>🎯 Smart Matching</h3>
            <p>Find careers that match your skills and aspirations</p>
          </div>
          <div className="benefit-card">
            <h3>📊 Data-Driven</h3>
            <p>Make informed decisions with AI-powered analytics</p>
          </div>
          <div className="benefit-card">
            <h3>💡 Personalized</h3>
            <p>Custom learning paths designed for your journey</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home