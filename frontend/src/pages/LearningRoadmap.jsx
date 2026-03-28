import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./LearningRoadmap.css";

function LearningRoadmap() {
  const { analysisData } = useContext(AppContext);

  return (
    <div className="roadmap-page">
      <div className="roadmap-card">
        <h1>Learning Roadmap</h1>
        <p>Your personalized learning direction based on skill gaps.</p>

        <div className="roadmap-grid">
          {analysisData?.missing_skills?.length > 0 ? (
            analysisData.missing_skills.map((skill, index) => (
              <div key={index} className="roadmap-item">
                <h3>{skill}</h3>
                <p>Recommended to improve your career readiness.</p>
              </div>
            ))
          ) : (
            <p>No missing skills found yet. Upload a resume first.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningRoadmap;