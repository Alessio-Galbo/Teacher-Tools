import { getAll, putItem } from "./db.js";
import { addClass } from "./classService.js";
import { addStudent, getStudents, updateStudent } from "./studentService.js";
import { isStudentMatch } from "../modules/school/rolloverHelper.js";
import { getSchoolConfig, addAcademicYear, associateSchoolToYear } from "./schoolService.js";

export async function rolloverClass(options) {
  const { fromClassId, targetYear, destClassName, isTerminal, autoSetup, promotedStudents = [], retainedClassName, retainedStudents = [] } = options;

  const fromClass = (await getAll("classes")).find((c) => c.id === fromClassId);
  if (autoSetup) {
    const cfg = await getSchoolConfig();
    if (!cfg.years.includes(targetYear)) await addAcademicYear(targetYear);
    if (fromClass?.schoolId) await associateSchoolToYear(fromClass.schoolId, targetYear);
  }

  let destClass = null;
  if (!isTerminal && destClassName) {
    destClass = await addClass(destClassName, targetYear, fromClassId, fromClass?.schoolId);
    if (fromClass) {
      fromClass.promotedToClassId = destClass.id;
      fromClass.promotedToYear = targetYear;
      fromClass.promotedToClassName = destClass.name;
      await putItem("classes", fromClass);
    }
  } else if (fromClass) {
    fromClass.promotedToYear = targetYear;
    fromClass.promotedToClassName = "Fine Ciclo";
    await putItem("classes", fromClass);
  }

  const existing = await getStudents(targetYear);
  if (destClass) {
    for (const st of promotedStudents) {
      const match = existing.find((s) => s.classId === destClass.id && isStudentMatch(s, st));
      const p = { ...st, classId: destClass.id, className: destClass.name, schoolYear: targetYear, personId: st.personId || st.id, originStudentId: st.originStudentId || st.id };
      if (match) await updateStudent({ ...match, ...p, id: match.id });
      else await addStudent(p);
    }
  }

  if (retainedStudents.length > 0 && retainedClassName) {
    const retClass = await addClass(retainedClassName, targetYear, null, fromClass?.schoolId);
    for (const st of retainedStudents) {
      const match = existing.find((s) => s.classId === retClass.id && isStudentMatch(s, st));
      const p = { ...st, classId: retClass.id, className: retClass.name, schoolYear: targetYear, personId: st.personId || st.id, originStudentId: st.originStudentId || st.id };
      if (match) await updateStudent({ ...match, ...p, id: match.id });
      else await addStudent(p);
    }
  }

  window.dispatchEvent(new CustomEvent("classesChanged"));
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  return destClass;
}
