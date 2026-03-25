import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const { analysisData, recentUpload } = useContext(AppContext);

  if (!analysisData) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Resume Analysis Found</h2>
          <p>Upload your resume to get started with career insights.</p>
          <Link to="/resume" className="btn-primary">
            Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  const score = Math.min(Math.max(Number(analysisData.resume_score || 0), 0), 100);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Resume Score' },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  const barData = {
    labels: ['Resume Score'],
    datasets: [
      {
        label: 'Score %',
        data: [score],
        backgroundColor: ['#1f8ef1'],
        borderColor: ['#0066cc'],
        borderWidth: 1,
      },
    ],
  };

  const recommended = Array.isArray(analysisData.recommended_careers)
    ? analysisData.recommended_careers.slice(0, 6)
    : [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Career Analysis Dashboard</h1>
        <p>AI-powered insights from your latest resume.</p>
        {recentUpload && <p className="recent-file">📄 {recentUpload}</p>}
      </div>

      <div className="dashboard-grid">
        <section className="card score-card">
          <h2>Resume Score</h2>
          <div className="chart-container">
            <Bar options={barOptions} data={barData} />
          </div>
          <div className="score-value">{score}%</div>
          <p className="score-hint">Resume strength from analysis</p>
        </section>

        <section className="card career-card">
          <h2>Top Career</h2>
          <div className="career-title">{analysisData.top_career || 'N/A'}</div>
          <p>{analysisData.career_explanation || 'No explanation available yet.'}</p>
        </section>

        <section className="card domain-card">
          <h2>Best Domain</h2>
          <div className="domain-name">{analysisData.best_domain || 'N/A'}</div>
          <p>{analysisData.domain_scores ? 'Domain matching score available' : 'No domain scores'}</p>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="card skills-section">
          <h2>Detected Skills</h2>
          <div className="skills-list">
            {analysisData.detected_skills?.length
              ? analysisData.detected_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))
              : 'No skills detected yet.'}
          </div>
        </section>

        <section className="card missing-section">
          <h2>Skills to Develop</h2>
          <div className="missing-list">
            {analysisData.missing_skills?.length
              ? analysisData.missing_skills.map((skill, idx) => (
                  <div key={idx} className="missing-item">
                    <span className="missing-icon">→</span>
                    <span>{skill}</span>
                  </div>
                ))
              : 'No improvement areas identified yet.'}
          </div>
        </section>

        <section className="card careers-section">
          <h2>Recommended Careers</h2>
          <div className="careers-grid">
            {recommended.length > 0
              ? recommended.map((item, i) => {
                  const careerName = typeof item === 'object' && item !== null ? item.career || item.name : item;
                  const careerScore =
                    typeof item === 'object' && item?.score != null ? ` (${Math.round(item.score * 100)}%)` : '';
                  return (
                    <div key={i} className="career-item">
                      {careerName}
                      <span>{careerScore}</span>
                    </div>
                  );
                })
              : 'No recommendations available yet.'}
          </div>
        </section>
      </div>

      <div className="dashboard-actions">
        <Link to="/resume" className="btn-primary">
          Upload New Resume
        </Link>
        <Link to="/interview" className="btn-secondary">
          Start AI Interview
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
