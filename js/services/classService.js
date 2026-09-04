import { getAll, putItem, deleteItem } from "./db.js";
import { getSchoolConfig, getActiveSchoolId } from "./schoolService.js";

export async function getClasses(year = null, schoolId = null) {
  let classes = await getAll("classes");
  if (classes.length === 0) {
    const defaults = [
      { id: "cls_3A", name: "3°A", schoolId: "sch_1", schoolYear: "2024/2025", createdAt: new Date().toISOString() },
      { id: "cls_4B", name: "4°B", schoolId: "sch_1", schoolYear: "2024/2025", createdAt: new Date().toISOString() },
    ];
    for (const c of defaults) await putItem("classes", c);
    classes = defaults;
  }
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
    createdAt: new Date().toISOString(),
  };
  await putItem("classes", cls);
  window.dispatchEvent(new CustomEvent("classesChanged"));
  return cls;
}

export async function removeClass(id) {
  await deleteItem("classes", id);
  window.dispatchEvent(new CustomEvent("classesChanged"));
}

export async function rolloverClass(options) {
  const { fromClassId, targetYear, destClassName, promotedStudents = [], retainedClassName, retainedStudents = [] } = options;
  const { addStudent } = await import("./studentService.js");
  const destClass = await addClass(destClassName, targetYear, fromClassId);
  for (const st of promotedStudents) {
    await addStudent({ ...st, classId: destClass.id, className: destClass.name, schoolYear: targetYear });
  }
  if (retainedStudents.length > 0 && retainedClassName) {
    const retClass = await addClass(retainedClassName, targetYear);
    for (const st of retainedStudents) {
      await addStudent({ ...st, classId: retClass.id, className: retClass.name, schoolYear: targetYear });
    }
  }
  window.dispatchEvent(new CustomEvent("classesChanged"));
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  return destClass;
}
