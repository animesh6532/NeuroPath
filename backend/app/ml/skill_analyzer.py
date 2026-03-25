import re

SKILLS = [
    "python",
    "machine learning",
    "sql",
    "java",
    "c++",
    "pandas",
    "numpy",
    "tensorflow",
    "data analysis"
]


def extract_skills(text):

    text = text.lower()

    detected = []

    for skill in SKILLS:

        if re.search(skill, text):
            detected.append(skill)

    return detected