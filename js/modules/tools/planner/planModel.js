import { getAll, getItem, putItem, deleteItem } from "../../../services/db.js";

export async function getPlans(academicYear = null) {
  const all = await getAll("didactic_plans");
  if (!academicYear) return all;
  return all.filter((p) => !p.academicYear || p.academicYear === academicYear);
}

export async function getPlan(id) {
  return await getItem("didactic_plans", id);
}

export async function savePlan(data) {
  const plan = {
    id: data.id || `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: data.title || "",
    subject: data.subject || "",
    academicYear: data.academicYear || "",
    period: data.period || "",
    classIds: Array.isArray(data.classIds) ? data.classIds : [],
    goals: data.goals || "",
    activities: data.activities || "",
    methods: data.methods || "",
    assessment: data.assessment || "",
    updatedAt: new Date().toISOString()
  };
  await putItem("didactic_plans", plan);
  return plan;
}

export async function removePlan(id) {
  await deleteItem("didactic_plans", id);
}
