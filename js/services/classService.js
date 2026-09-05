import { getAll, putItem } from "./db.js";
import { getSchoolConfig, getActiveSchoolId } from "./schoolService.js";
import { removeClassAndCleanup } from "./classCleanupService.js";

export async function getClasses(year = null, schoolId = null) {
  const classes = await getAll("classes");
  let res = classes;
  if (year) res = res.filter((c) => c.schoolYear === year);
  if (schoolId) res = res.filter((c) => !c.schoolId || c.schoolId === schoolId);
  return res;
}

export async function addClass(name, schoolYear, originClassId = null, schoolId = null) {
  if (!name || !name.trim()) return null;
  const config = await getSchoolConfig();
  const targetYear = schoolYear || config.activeYear;
  const targetSchool = schoolId || getActiveSchoolId();

  const existing = (await getClasses(targetYear, targetSchool)).find((c) => c.name === name.trim().toUpperCase());
  if (existing) return existing;

  const cls = {
    id: "cls_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    name: name.trim().toUpperCase(),
    schoolId: targetSchool,
    schoolYear: targetYear,
    originClassId: originClassId || null,
    didacticNotes: "",
    createdAt: new Date().toISOString(),
  };
  await putItem("classes", cls);
  window.dispatchEvent(new CustomEvent("classesChanged"));
  return cls;
}

export async function updateClass(id, updates) {
  const cls = (await getAll("classes")).find((c) => c.id === id);
  if (!cls) return null;
  const oldName = cls.name;
  const updated = { ...cls, ...updates };
  await putItem("classes", updated);

  if (updates.name && updates.name !== oldName) {
    const students = await getAll("students");
    for (const s of students) {
      if (s.classId === id || s.className === oldName) {
        s.className = updates.name;
        await putItem("students", s);
      }
    }
  }

  window.dispatchEvent(new CustomEvent("classesChanged"));
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  return updated;
}

export const removeClass = removeClassAndCleanup;
export { rolloverClass } from "./classRolloverService.js";
