"""
Learning Roadmap Generator
--------------------------
Input:
  weaknesses    : list[str]  — weak areas from interview evaluation
  missing_skills: list[str]  — skills missing from resume vs target career
  domain        : str        — e.g. "Technology", "Finance", "General"

Output:
  list[dict] — a flat list (NOT a wrapped dict) where each item is:
  {
    "skill"     : str,
    "level"     : str,        # "Beginner" | "Intermediate" | "Advanced"
    "steps"     : list[str],
    "resources" : list[str],
  }

NOTE: The API endpoint in main.py wraps this in { "success": True, "data": [...] }.
The frontend axios interceptor unwraps that once, so it receives the list directly.
"""


def generate_learning_roadmap(weaknesses: list, missing_skills: list, domain: str = "") -> list:
    # Deduplicate and normalise inputs
    weaknesses = [w for w in (weaknesses or []) if isinstance(w, str) and w.strip()]
    missing_skills = [s for s in (missing_skills or []) if isinstance(s, str) and s.strip()]
    domain = (domain or "General").strip()

    combined_areas = list(dict.fromkeys(weaknesses + missing_skills))  # preserves order, deduplicates

    roadmap = []

    if not combined_areas:
        # Default roadmap when no specific gaps found
        roadmap.append({
            "skill": f"{domain} System Design" if domain and domain != "General" else "General System Design",
            "level": "Intermediate",
            "steps": [
                "Review system architecture patterns and design principles.",
                "Study scalability and reliability concepts.",
                "Practice with real-world system design case studies.",
                "Attempt mock system design interviews.",
            ],
            "resources": [
                "https://github.com/donnemartin/system-design-primer",
                "https://www.coursera.org/search?query=system+design",
                "https://www.freecodecamp.org/news/search/?q=system+design",
            ],
        })
        return roadmap

    # Level assignment: rotate through to give variety
    levels = ["Beginner", "Intermediate", "Advanced"]

    for i, area in enumerate(combined_areas):
        area_slug = area.replace(" ", "%20")
        area_plus = area.replace(" ", "+")

        level = levels[i % len(levels)]

        roadmap.append({
            "skill": area,
            "level": level,
            "steps": [
                f"Understand the core concepts and fundamentals of {area}.",
                f"Follow a structured {level.lower()}-level tutorial on {area}.",
                f"Build a small hands-on project that applies {area} concepts.",
                f"Review common interview questions related to {area}.",
                f"Optimise and refactor your {area} implementation for best practices.",
            ],
            "resources": [
                f"https://www.coursera.org/search?query={area_slug}",
                f"https://github.com/search?q={area_plus}+tutorial&type=repositories",
                f"https://www.freecodecamp.org/news/search/?q={area_slug}",
                f"https://roadmap.sh/search?q={area_slug}",
            ],
        })

    return roadmap
