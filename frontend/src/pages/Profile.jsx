import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import "./Profile.css";

function Profile() {
  const { user } = useContext(AuthContext);
  const { recentUpload, analysisData } = useContext(AppContext);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>

        <div className="profile-grid">
          <div className="profile-box">
            <h3>Email</h3>
            <p>{user?.email || "Not available"}</p>
          </div>

          <div className="profile-box">
            <h3>Recent Resume</h3>
            <p>{recentUpload || "No file uploaded yet"}</p>
          </div>

          <div className="profile-box">
            <h3>Top Career</h3>
            <p>{analysisData?.top_career || "Not available"}</p>
          </div>

          <div className="profile-box">
            <h3>Best Domain</h3>
            <p>{analysisData?.best_domain || "Not available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;