def generate_questions(skills):

    questions = []

    for skill in skills:

        questions.append(f"Explain {skill} in detail.")
        questions.append(f"What are real-world applications of {skill}?")
        questions.append(f"What are challenges or limitations of {skill}?")

    # Remove duplicates & limit
    unique_questions = list(set(questions))

    return unique_questions[:5]