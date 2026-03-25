from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')


def evaluate_answer(question, answer):

    ideal_answer = f"A strong answer to '{question}' should include explanation, examples, and clarity."

    emb1 = model.encode(answer, convert_to_tensor=True)
    emb2 = model.encode(ideal_answer, convert_to_tensor=True)

    similarity = util.cos_sim(emb1, emb2).item()

    score = round(similarity * 10, 2)

    if score < 4:
        feedback = "Poor answer, lacks clarity"
    elif score < 7:
        feedback = "Average answer, needs depth"
    else:
        feedback = "Strong answer"

    return score, feedback