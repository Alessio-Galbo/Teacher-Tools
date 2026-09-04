import { getAll, getItem, putItem, deleteItem } from "../../../services/db.js";

export async function getSavedQuizzes(academicYear = null) {
  const all = await getAll("quizzes");
  if (!academicYear) return all;
  return all.filter((q) => !q.academicYear || q.academicYear === academicYear);
}

export async function getQuizById(id) {
  return await getItem("quizzes", id);
}

export async function saveQuiz(data) {
  const quiz = {
    id: data.id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: data.title || "",
    topic: data.topic || "",
    subject: data.subject || "",
    maxScore: typeof data.maxScore === "number" ? data.maxScore : (parseFloat(data.maxScore) || 10),
    autoCalcPoints: data.autoCalcPoints ?? false,
    defaultPoints: data.defaultPoints || { multiple_choice: 1, true_false: 0.5, cloze: 1, open: 2 },
    academicYear: data.academicYear || "",
    classId: data.classId || "",
    variants: data.variants && data.variants.length > 0 ? data.variants : [
      { id: "var_A", name: "Variante A", questions: data.questions || [] }
    ],
    updatedAt: new Date().toISOString()
  };
  await putItem("quizzes", quiz);
  return quiz;
}

export async function removeQuiz(id) {
  await deleteItem("quizzes", id);
}
