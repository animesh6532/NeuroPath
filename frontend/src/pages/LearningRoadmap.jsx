import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import './LearningRoadmap.css'

function Roadmap() {
  const { analysisData } = useContext(AppContext)

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <h1>Learning Roadmap</h1>
        <p>Your personalized career development path</p>
      </div>

      {!analysisData && (
        <div className="empty-state">
          <p>No analysis data found. Please upload your resume first.</p>
        </div>
      )}

      {analysisData && (
        <div className="roadmap-content">
          <section className="careers-section">
            <h2>Recommended Careers</h2>
            {analysisData.recommended_careers?.length ? (
              <div className="careers-list">
                {analysisData.recommended_careers.map((career, idx) => (
                  <div key={idx} className="career-item">
                    <h3>{career.career || career}</h3>
                    {career.score && <p>Match: {Math.round(career.score * 100)}%</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p>No career recommendations available.</p>
            )}
          </section>

          <section className="skills-section">
            <h2>Missing Skills</h2>
            {analysisData.missing_skills?.length ? (
              <div className="skills-list">
                {analysisData.missing_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            ) : (
              <p>No missing skills identified.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default Roadmap
