function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomizeQuestions(questions, shuffleOptions = true) {
  if (!questions || questions.length === 0) return [];
  const cloned = questions.map((q) => {
    const newQ = { ...q, id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` };
    if (q.type === "multiple_choice" && Array.isArray(q.options) && shuffleOptions) {
      newQ.options = shuffleArray(q.options);
    }
    return newQ;
  });
  return shuffleArray(cloned);
}

export function createVariant(baseQuestions, variantLetter = "B") {
  const questions = randomizeQuestions(baseQuestions, true);
  return {
    id: `var_${variantLetter.toLowerCase()}_${Date.now()}`,
    name: `Variante ${variantLetter}`,
    questions
  };
}
