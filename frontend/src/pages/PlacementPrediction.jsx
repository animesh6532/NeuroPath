import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./PlacementPrediction.css";

function PlacementPrediction() {
  const { analysisData } = useContext(AppContext);

  const score = analysisData?.resume_score || 0;

  let prediction = "Low";
  if (score >= 80) prediction = "High";
  else if (score >= 60) prediction = "Moderate";

  return (
    <div className="placement-page">
      <div className="placement-card">
        <h1>Placement Prediction</h1>
        <p>AI-based placement readiness based on your resume analysis.</p>

        <div className="prediction-box">
          <h2>{prediction} Placement Chance</h2>
          <p>Resume Score: {score}%</p>
          <p>Top Career Match: {analysisData?.top_career || "Not available"}</p>
          <p>Best Domain: {analysisData?.best_domain || "Not available"}</p>
        </div>
      </div>
    </div>
  );
}

export default PlacementPrediction;