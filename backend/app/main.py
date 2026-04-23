from fastapi import FastAPI, UploadFile, File, Depends
import shutil
import os
import json

from pdfminer.high_level import extract_text

from backend.app.ml.resume_scorer import calculate_resume_score
from backend.app.ml.career_explainer import explain_career
from backend.app.ml.semantic_matcher import semantic_match
from backend.app.ml.skill_analyzer import extract_skills, extract_projects, extract_experience
from backend.app.ml.career_data import CAREER_DATA
from backend.app.ml.skill_gap import find_skill_gap

from backend.app.ml.interview.question_generator import generate_questions_from_skills
from backend.app.ml.interview.interview_engine import evaluate_interview_answers

from backend.app.ml.placement.placement_engine import predict_placement_result
from backend.app.ml.learning.roadmap_generator import generate_learning_roadmap
from backend.app.ml.aptitude.aptitude_generator import generate_aptitude_test, evaluate_aptitude_test
from backend.app.ml.coding.coding_challenges import get_daily_challenges

from backend.app.dashboard.dashboard_service import generate_dashboard

from backend.app.auth.routes import router as auth_router
from backend.app.auth.dependencies import get_current_user

from fastapi.middleware.cors import CORSMiddleware

from backend.app.proctoring.proctor_routes import router as proctor_router
from backend.app.assistant.assistant_routes import router as assistant_router

app = FastAPI(title="NeuroPath AI Backend", version="1.1.0")

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(proctor_router)
app.include_router(assistant_router, tags=["Assistant"])


# ── Response helpers ─────────────────────────────────────────────────────────
def ok(data, message="OK"):
    return {"success": True, "message": message, "data": data}

def err(message):
    return {"success": False, "message": str(message), "data": None}


# ── Profile store helpers ────────────────────────────────────────────────────
PROFILE_FILE = "user_profiles.json"

def _load_profiles() -> dict:
    try:
        if os.path.exists(PROFILE_FILE):
            with open(PROFILE_FILE, "r") as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
    except Exception as e:
        print(f"[profile] load error: {e}")
    return {}

def _save_profiles(profiles: dict):
    try:
        with open(PROFILE_FILE, "w") as f:
            json.dump(profiles, f, indent=2)
    except Exception as e:
        print(f"[profile] save error: {e}")

def _build_safe_profile(raw: dict, email: str = "") -> dict:
    """Return a guaranteed-safe profile dict — no missing keys, no None values."""
    custom = raw.get("custom_skills", [])
    if not isinstance(custom, list):
        custom = []
    return {
        "name":          str(raw.get("name",          "") or ""),
        "bio":           str(raw.get("bio",           "") or ""),
        "profile_image": str(raw.get("profile_image", "") or ""),
        "cover_image":   str(raw.get("cover_image",   "") or ""),
        "custom_skills": [str(s) for s in custom if s],
        "email":         str(raw.get("email", email) or email),
    }


# ── RESUME ANALYSIS ──────────────────────────────────────────────────────────
@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        resume_text = extract_text(file_location)
        skills      = extract_skills(resume_text)
        projects    = extract_projects(resume_text)
        experience  = extract_experience(resume_text)
        careers     = semantic_match(resume_text)
        top_career  = careers[0]["career"] if careers else "Software Engineer"
        missing     = find_skill_gap(skills, top_career)

        domain_scores = {}
        for item in careers:
            d = CAREER_DATA.get(item["career"], {}).get("domain", "General")
            domain_scores[d] = domain_scores.get(d, 0) + item["score"]
        best_domain   = max(domain_scores, key=domain_scores.get) if domain_scores else "General"
        resume_score  = calculate_resume_score(skills, top_career, missing)
        explanation   = explain_career(skills, top_career)

        return ok({
            "detected_skills":      skills,
            "projects":             projects,
            "experience":           experience,
            "recommended_careers":  careers,
            "top_career":           top_career,
            "missing_skills":       missing,
            "resume_score":         resume_score,
            "career_explanation":   explanation,
            "best_domain":          best_domain,
            "domain_scores":        domain_scores,
        }, "Resume analyzed successfully")
    except Exception as e:
        return err(e)
    finally:
        if os.path.exists(file_location):
            try: os.remove(file_location)
            except: pass


# ── GENERATE INTERVIEW ────────────────────────────────────────────────────────
@app.post("/generate-interview")
async def generate_interview(data: dict):
    try:
        skills    = data.get("skills", [])
        questions = generate_questions_from_skills(skills)
        return ok({"skills": skills, "questions": questions}, "Questions generated")
    except Exception as e:
        return err(e)


# ── SUBMIT INTERVIEW ──────────────────────────────────────────────────────────
@app.post("/submit-interview")
async def submit_interview(data: dict):
    try:
        skills  = data.get("skills", [])
        answers = data.get("answers", [])
        results = evaluate_interview_answers(answers, skills)
        weak    = results.get("weaknesses", [])
        if not isinstance(weak, list):
            weak = []
        return ok({
            "score":        results.get("score", 0),
            "confidence":   results.get("confidence_score", 0),
            "communication":results.get("communication_score", 0),
            "weaknesses":   weak,
            "full_results": results,
        }, "Interview evaluated")
    except Exception as e:
        return err(e)


# ── AI INTERVIEW TEST ─────────────────────────────────────────────────────────
@app.post("/ai-interview")
async def ai_interview(data: dict):
    try:
        results    = evaluate_interview_answers(data.get("answers", []), data.get("skills", []))
        weak_areas = results.get("weaknesses", [])
        if not isinstance(weak_areas, list):
            weak_areas = []
        return ok({"interview_results": results, "weak_areas": weak_areas}, "AI interview evaluated")
    except Exception as e:
        return err(e)


# ── PLACEMENT ─────────────────────────────────────────────────────────────────
@app.post("/placement-analysis")
async def placement_analysis(data: dict):
    try:
        result = predict_placement_result(
            {"score": data.get("interview_score", 0),
             "confidence_score": data.get("confidence", 0),
             "communication_score": data.get("communication", 0)},
            data.get("missing_skills", []),
            data.get("domain", "Technology"),
        )
        return ok(result, "Placement analyzed")
    except Exception as e:
        return err(e)


# ── ROADMAP ───────────────────────────────────────────────────────────────────
@app.post("/generate-roadmap")
async def generate_roadmap(data: dict):
    try:
        roadmap = generate_learning_roadmap(
            data.get("weaknesses", []),
            data.get("missing_skills", []),
            data.get("domain", "General"),
        )
        if not isinstance(roadmap, list):
            roadmap = []
        return ok(roadmap, "Roadmap generated")
    except Exception as e:
        return err(e)


# ── DAILY CHALLENGE ───────────────────────────────────────────────────────────
@app.get("/daily-challenge")
async def daily_challenge():
    try:
        return ok({"challenges": get_daily_challenges()}, "Challenges fetched")
    except Exception as e:
        return err(e)


# ── APTITUDE ──────────────────────────────────────────────────────────────────
@app.get("/aptitude-test")
async def aptitude_test():
    try:
        return ok({"questions": generate_aptitude_test(20)}, "Test fetched")
    except Exception as e:
        return err(e)

@app.post("/submit-aptitude")
async def submit_aptitude(data: dict):
    try:
        return ok(evaluate_aptitude_test(data.get("answers", [])), "Test evaluated")
    except Exception as e:
        return err(e)


# ── DASHBOARD ─────────────────────────────────────────────────────────────────
@app.post("/dashboard")
async def dashboard_post(data: dict):
    try:
        return ok(generate_dashboard(data), "Dashboard data fetched")
    except Exception as e:
        return err(e)

@app.get("/dashboard")
def dashboard_get(user=Depends(get_current_user)):
    return ok(None, f"Welcome {user}")


# ── PROFILE ───────────────────────────────────────────────────────────────────

@app.get("/profile/{user_id}")
async def get_profile_by_id(user_id: str):
    """Fetch profile by email / user_id."""
    try:
        profiles = _load_profiles()
        raw      = profiles.get(user_id, {})
        return ok(_build_safe_profile(raw, user_id), "Profile fetched")
    except Exception as e:
        return err(e)


@app.get("/get-profile")
async def get_profile_legacy():
    """Legacy single-profile endpoint — returns first stored profile."""
    try:
        profiles = _load_profiles()
        raw      = next(iter(profiles.values()), {})
        return ok(_build_safe_profile(raw), "Profile fetched")
    except Exception as e:
        return err(e)


@app.post("/profile/update")
async def update_profile(data: dict):
    """
    Save profile keyed by email.
    Always returns the FULL saved profile object (not just a message).
    """
    try:
        email    = str(data.get("email", "") or "default").strip()
        profiles = _load_profiles()
        # Merge with existing so we never lose fields not included in this request
        existing = profiles.get(email, {})
        merged   = {**existing, **data}
        safe     = _build_safe_profile(merged, email)
        profiles[email] = safe
        _save_profiles(profiles)
        print(f"[profile] saved for '{email}': {list(safe.keys())}")
        return ok(safe, "Profile updated")
    except Exception as e:
        print(f"[profile] update error: {e}")
        return err(e)


@app.post("/update-profile")
async def update_profile_legacy(data: dict):
    """Legacy endpoint — same logic as /profile/update."""
    return await update_profile(data)
