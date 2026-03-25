import { useLocation, useNavigate } from 'react-router-dom'
import './Result.css'

function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const { uploadData } = location.state || {}

  if (!uploadData) {
    return (
      <div className="result">
        <div className="result-empty">
          <h2>No results to display</h2>
          <p>Please upload a resume first</p>
          <button onClick={() => navigate('/home')} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="result">
      <div className="result-header">
        <h1>Analysis Results</h1>
        <p>Based on your resume analysis</p>
      </div>

      <div className="result-content">
        <section className="result-section">
          <h2>Resume Summary</h2>
          <div className="result-box">
            {uploadData.summary && (
              <p>{uploadData.summary}</p>
            )}
          </div>
        </section>

        {uploadData.skills && (
          <section className="result-section">
            <h2>Identified Skills</h2>
            <div className="skills-list">
              {uploadData.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {uploadData.recommendations && (
          <section className="result-section">
            <h2>Career Recommendations</h2>
            <div className="recommendations-list">
              {uploadData.recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-item">
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="result-actions">
          <button onClick={() => navigate('/home')} className="action-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Result
