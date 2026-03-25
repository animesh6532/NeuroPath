# backend/app/ml/placement/placement_engine.py

from backend.app.ml.placement.scoring import (
    calculate_base_score,
    apply_skill_penalty,
    normalize_score,
    get_readiness_level
)


def generate_improvement_plan(missing_skills, interview_score):
    """
    Suggest improvements based on weaknesses
    """

    suggestions = []

    # Skill-based suggestions
    for skill in missing_skills[:5]:
        suggestions.append(f"Improve your knowledge in {skill}")

    # Interview-based suggestions
    if interview_score < 5:
        suggestions.append("Practice basic interview questions")
        suggestions.append("Improve communication skills")

    elif interview_score < 7:
        suggestions.append("Work on explaining concepts clearly")

    else:
        suggestions.append("Focus on advanced topics and system design")

    return suggestions


def predict_placement(resume_score: float, interview_score: float, missing_skills: list):
    """
    Main function for placement prediction
    """

    # Step 1: Base score
    base_score = calculate_base_score(resume_score, interview_score)

    # Step 2: Apply penalty
    penalized_score = apply_skill_penalty(base_score, missing_skills)

    # Step 3: Normalize
    final_score = normalize_score(penalized_score)

    # Step 4: Readiness level
    readiness = get_readiness_level(final_score)

    # Step 5: Improvement suggestions
    suggestions = generate_improvement_plan(missing_skills, interview_score)

    return {
        "placement_score": final_score,
        "readiness": readiness,
        "improvement_plan": suggestions
    }