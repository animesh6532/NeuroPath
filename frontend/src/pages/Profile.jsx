import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import { profileAPI } from "../api/endpoints";
import "./Profile.css";

// ─── safe helper ──────────────────────────────────────────────────────────────
const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeStr = (v, fallback = "") => (typeof v === "string" ? v : fallback);

function Profile() {
  const { user } = useContext(AuthContext);
  const {
    analysisData,
    interviewData,
    aptitudeResult,
    recentUpload,
    userProfile,
    replaceUserProfile,
  } = useContext(AppContext);

  const [isEditing,      setIsEditing]      = useState(false);
  const [isSaving,       setIsSaving]       = useState(false);
  const [saveError,      setSaveError]      = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "", bio: "", profile_image: "", cover_image: "", custom_skills: [],
  });
  const [newSkill, setNewSkill] = useState("");

  // ── Derived safe values ────────────────────────────────────────────────
  const email       = safeStr(user?.email, "user@example.com");
  const defaultName = email.split("@")[0];
  const initial     = email.charAt(0).toUpperCase();

  const displayName  = safeStr(userProfile?.name,          defaultName);
  const bio          = safeStr(userProfile?.bio,            "");
  const profileImage = safeStr(userProfile?.profile_image, "") || null;
  const coverImage   = safeStr(userProfile?.cover_image,   "") || null;

  const domain  = safeStr(analysisData?.best_domain,  "Not Assigned");
  const career  = safeStr(analysisData?.top_career,   "Pending Assessment");

  const resumeScore    = analysisData?.resume_score    != null ? `${analysisData.resume_score}%`           : "N/A";
  const interviewScore = interviewData?.score          != null ? `${interviewData.score}%`                 : "N/A";
  const confidence     = interviewData?.confidence     != null ? `${interviewData.confidence}%`            : "N/A";
  const aptitudeScore  = aptitudeResult?.score         != null ? `${aptitudeResult.score}/${aptitudeResult.total ?? "?"}` : "N/A";

  const detectedSkills = safeArr(analysisData?.detected_skills);
  const missingSkills  = safeArr(analysisData?.missing_skills);
  const customSkills   = safeArr(userProfile?.custom_skills);
  const allSkills      = [...new Set([...detectedSkills, ...customSkills])];

  // ── Fetch profile on mount ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setProfileLoading(true);
        const res = await profileAPI.getProfile(email);
        console.log("[Profile] fetch response:", res?.data);
        if (cancelled) return;
        const data = res?.data;
        if (data && typeof data === "object") {
          replaceUserProfile(data);
          setFormData({
            name:          safeStr(data.name),
            bio:           safeStr(data.bio),
            profile_image: safeStr(data.profile_image),
            cover_image:   safeStr(data.cover_image),
            custom_skills: safeArr(data.custom_skills),
          });
        }
      } catch (err) {
        console.warn("[Profile] fetch skipped:", err?.message ?? err);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [email]); // stable — email comes from auth and doesn't change

  // Sync form when profile loads from context (e.g. after page revisit)
  useEffect(() => {
    if (!userProfile || typeof userProfile !== "object") return;
    setFormData({
      name:          safeStr(userProfile.name),
      bio:           safeStr(userProfile.bio),
      profile_image: safeStr(userProfile.profile_image),
      cover_image:   safeStr(userProfile.cover_image),
      custom_skills: safeArr(userProfile.custom_skills),
    });
  }, [userProfile]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result ?? "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !formData.custom_skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, custom_skills: [...prev.custom_skills, trimmed] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      custom_skills: prev.custom_skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setIsSaving(true);

    // Build payload — always include email so backend can key by it
    const payload = {
      name:          safeStr(formData.name),
      bio:           safeStr(formData.bio),
      profile_image: safeStr(formData.profile_image),
      cover_image:   safeStr(formData.cover_image),
      custom_skills: safeArr(formData.custom_skills),
      email,
    };

    console.log("[Profile] saving payload:", { ...payload, profile_image: payload.profile_image ? "[base64]" : "" });

    try {
      const res = await profileAPI.updateProfile(payload);
      console.log("[Profile] save response:", res?.data);

      // Backend returns full profile object inside res.data (after interceptor unwrap)
      const saved = res?.data && typeof res.data === "object" ? res.data : payload;

      // Validate the saved object has at least a name field before trusting it
      const safeSaved = {
        name:          safeStr(saved.name,          payload.name),
        bio:           safeStr(saved.bio,           payload.bio),
        profile_image: safeStr(saved.profile_image, payload.profile_image),
        cover_image:   safeStr(saved.cover_image,   payload.cover_image),
        custom_skills: safeArr(saved.custom_skills).length
          ? safeArr(saved.custom_skills)
          : safeArr(payload.custom_skills),
        email,
      };

      // Persist to context + localStorage
      replaceUserProfile(safeSaved);
      try { localStorage.setItem("user_profile", JSON.stringify(safeSaved)); } catch {}

      setIsEditing(false);
    } catch (err) {
      console.error("[Profile] save failed:", err);
      setSaveError(
        err?.response?.data?.message
          ?? err?.message
          ?? "Failed to save profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ── Guards ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container" style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "#94a3b8" }}>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container" style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "#94a3b8", fontSize: "18px" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Cover */}
        <div
          className="cover-photo"
          style={{
            backgroundImage: coverImage
              ? `url(${coverImage})`
              : "linear-gradient(135deg, #3b82f6, #6366f1)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button className="edit-profile-btn" onClick={() => { setSaveError(""); setIsEditing(true); }}>
            Edit Profile
          </button>
        </div>

        {/* Avatar */}
        <div className="avatar-wrapper">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-img" />
          ) : (
            <div className="avatar-placeholder">{initial}</div>
          )}
        </div>

        {/* Info */}
        <div className="profile-info">
          <h1>{displayName}</h1>
          <p className="email-text">{email}</p>
          <p className="role-domain">{career} • {domain} Domain</p>
          {bio && <p className="bio-text">{bio}</p>}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            ["Resume Score",    resumeScore],
            ["Interview Score", interviewScore],
            ["Confidence",      confidence],
            ["Aptitude",        aptitudeScore],
          ].map(([label, value]) => (
            <div className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="skills-section">
          <div className="skills-block">
            <h3>Skills</h3>
            <div className="tags-container">
              {allSkills.length > 0
                ? allSkills.map((s, i) => <span key={i} className="tag tag-blue">{s}</span>)
                : <span className="empty-text">No skills added yet.</span>}
            </div>
          </div>
          <div className="skills-block">
            <h3 style={{ color: "#fca5a5" }}>Missing Skills (Required for {career})</h3>
            <div className="tags-container">
              {missingSkills.length > 0
                ? missingSkills.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)
                : <span className="empty-text">No missing skills detected.</span>}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="timeline">
            {recentUpload && (
              <div className="timeline-item">
                <span className="timeline-dot bg-blue"></span>
                <div className="timeline-content">
                  <h4>Resume Uploaded</h4><p>{recentUpload}</p>
                </div>
              </div>
            )}
            {interviewData && (
              <div className="timeline-item">
                <span className="timeline-dot bg-green"></span>
                <div className="timeline-content">
                  <h4>AI Interview Completed</h4><p>Scored {interviewScore}</p>
                </div>
              </div>
            )}
            {aptitudeResult && (
              <div className="timeline-item">
                <span className="timeline-dot bg-purple"></span>
                <div className="timeline-content">
                  <h4>Aptitude Test Taken</h4><p>Scored {aptitudeScore}</p>
                </div>
              </div>
            )}
            {!recentUpload && !interviewData && !aptitudeResult && (
              <p className="empty-text">No recent activity.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────────── */}
      {isEditing && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isSaving) setIsEditing(false); }}>
          <div className="modal-content">
            <h2>Edit Profile</h2>

            {saveError && (
              <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#fca5a5", fontSize: "14px" }}>
                ⚠️ {saveError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your Name"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows="3"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "profile_image")} disabled={isSaving} />
                {formData.profile_image && (
                  <img src={formData.profile_image} alt="Preview" style={{ width: 60, height: 60, borderRadius: "50%", marginTop: 8, objectFit: "cover" }} />
                )}
              </div>

              <div className="form-group">
                <label>Cover Photo</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover_image")} disabled={isSaving} />
              </div>

              <div className="form-group">
                <label>Custom Skills</label>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(e); }}
                    disabled={isSaving}
                  />
                  <button type="button" onClick={handleAddSkill} className="btn-secondary" disabled={isSaving}>Add</button>
                </div>
                <div className="tags-container">
                  {formData.custom_skills.map((skill, i) => (
                    <span key={i} className="tag tag-blue" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        disabled={isSaving}
                        style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 0, lineHeight: 1 }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => { if (!isSaving) { setIsEditing(false); setSaveError(""); } }}
                  className="btn-cancel"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
