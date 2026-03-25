import './CareerCard.css'

function CareerCard({ career, matchScore, description, growthPotential }) {
  return (
    <div className="career-card">
      <div className="career-header">
        <h3>{career}</h3>
        <div className="match-badge">
          {matchScore}% Match
        </div>
      </div>
      
      <p className="career-description">{description}</p>
      
      <div className="career-stats">
        <div className="stat">
          <span className="stat-label">Match Score</span>
          <div className="stat-bar">
            <div 
              className="stat-fill" 
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>
        
        {growthPotential && (
          <div className="stat">
            <span className="stat-label">Growth Potential</span>
            <span className="growth-value">{growthPotential}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CareerCard
