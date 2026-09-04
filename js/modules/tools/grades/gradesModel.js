import { getAll, getItem, putItem, deleteItem } from "../../../services/db.js";

export async function getAssessments(academicYear) {
  const all = await getAll("assessments");
  if (!academicYear) return all;
  return all.filter((a) => a.academicYear === academicYear);
}

export async function getAssessment(id) {
  return await getItem("assessments", id);
}

export async function saveAssessment(data) {
  const assessment = {
    id: data.id || `asm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: data.title || "",
    subject: data.subject || "",
    date: data.date || new Date().toISOString().split("T")[0],
    classId: data.classId || "",
    schoolId: data.schoolId || "",
    academicYear: data.academicYear || "",
    type: data.type || "written",
    weight: typeof data.weight === "number" ? data.weight : 1.0,
    grades: data.grades || {},
    updatedAt: new Date().toISOString()
  };
  await putItem("assessments", assessment);
  return assessment;
}

export async function removeAssessment(id) {
  await deleteItem("assessments", id);
}
