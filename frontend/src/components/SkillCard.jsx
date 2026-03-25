import './SkillCard.css'

function SkillCard({ skill, level, gap }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'expert': return '#27ae60'
      case 'proficient': return '#3498db'
      case 'intermediate': return '#f39c12'
      case 'beginner': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  return (
    <div className="skill-card">
      <h3>{skill}</h3>
      <div className="skill-level">
        <div className="level-bar">
          <div 
            className="level-fill" 
            style={{
              width: `${level * 20}%`,
              backgroundColor: getStatusColor(level)
            }}
          />
        </div>
        <span className="level-text">{level}/5</span>
      </div>
      {gap && (
        <p className="skill-gap">Gap: {gap}%</p>
      )}
    </div>
  )
}

export default SkillCard
