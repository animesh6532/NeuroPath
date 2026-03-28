import "./AIInterview.css";

function AIInterview() {
  return (
    <div className="ai-interview-page">
      <div className="ai-interview-card">
        <h1>AI Mock Interview</h1>
        <p>
          Practice industry-style interviews with AI-generated questions,
          voice prompts, and performance tracking.
        </p>

        <div className="ai-feature-grid">
          <div className="ai-feature-box">
            <h3>🎤 Voice Interview</h3>
            <p>AI asks questions using voice and listens to your answers.</p>
          </div>

          <div className="ai-feature-box">
            <h3>📹 Camera Monitoring</h3>
            <p>OpenCV-powered monitoring for mock interview realism.</p>
          </div>

          <div className="ai-feature-box">
            <h3>🧠 AI Evaluation</h3>
            <p>Get feedback on confidence, relevance, and communication.</p>
          </div>
        </div>

        <button className="ai-start-btn">Start Interview</button>
      </div>
    </div>
  );
}

export default AIInterview;