from backend.app.ml.interview.question_generator import generate_questions
from backend.app.ml.interview.answer_evaluator import evaluate_answer
from backend.app.ml.interview.followup_generator import generate_followup
from backend.app.ml.interview.interview_memory import InterviewMemory


def run_interview(skills, answers):

    questions = generate_questions(skills)

    memory = InterviewMemory()

    results = []

    for i in range(len(questions)):

        q = questions[i]
        ans = answers[i] if i < len(answers) else ""

        score, feedback = evaluate_answer(q, ans)

        followup = generate_followup(q, score)

        memory.add(q, ans, score)

        results.append({
            "question": q,
            "answer": ans,
            "score": score,
            "feedback": feedback,
            "follow_up": followup
        })

    weak_areas = memory.get_weak_areas()

    return results, weak_areas