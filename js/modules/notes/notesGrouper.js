import { t } from "../../i18n.js";

export function groupNotesByScope(notes, scope, { schools = [], classes = [], students = [] }) {
  if (!Array.isArray(notes) || notes.length === 0) return [];

  const isClassCode = (code) => code.toLowerCase().startsWith("classe ") || classes.some((c) => c.name.toLowerCase() === code.toLowerCase());
  const isSchoolCode = (code) => schools.some((s) => s.name.toLowerCase() === code.toLowerCase());

  if (scope.type === "student" && scope.entity) {
    const stName = (scope.entity.name || "").toLowerCase();
    const stNotes = notes.filter((n) => (n.studentCode || "").toLowerCase() === stName);
    const clsNotes = notes.filter((n) => isClassCode(n.studentCode || ""));
    const schNotes = notes.filter((n) => isSchoolCode(n.studentCode || ""));
    return [
      { icon: "🎓", title: `${t("notes_group_student")}: ${scope.entity.name}`, notes: stNotes },
      { icon: "🏢", title: `${t("notes_group_class")} (${scope.entity.className || ""})`, notes: clsNotes },
      { icon: "🏫", title: t("notes_group_school"), notes: schNotes },
    ].filter((g) => g.notes.length > 0);
  }

  if (scope.type === "class" && scope.entity) {
    const clsName = (scope.entity.name || "").toLowerCase();
    const clsNotes = notes.filter((n) => {
      const c = (n.studentCode || "").toLowerCase();
      return c === `classe ${clsName}` || c === clsName;
    });
    const schNotes = notes.filter((n) => isSchoolCode(n.studentCode || ""));
    const stNotes = notes.filter((n) => !clsNotes.includes(n) && !schNotes.includes(n));
    return [
      { icon: "🏢", title: `${t("notes_group_class")} ${scope.entity.name}`, notes: clsNotes },
      { icon: "🎓", title: t("notes_group_student"), notes: stNotes },
      { icon: "🏫", title: t("notes_group_school"), notes: schNotes },
    ].filter((g) => g.notes.length > 0);
  }

  if (scope.type === "school" && scope.entity) {
    const schName = (scope.entity.name || "").toLowerCase();
    const schNotes = notes.filter((n) => (n.studentCode || "").toLowerCase() === schName || isSchoolCode(n.studentCode || ""));
    const schClasses = classes.filter((c) => !c.schoolId || c.schoolId === scope.entity.id);
    const groups = [];
    if (schNotes.length > 0) groups.push({ icon: "🏫", title: `${t("notes_group_school")}: ${scope.entity.name}`, notes: schNotes });
    const handledNotes = new Set(schNotes);

    schClasses.forEach((cls) => {
      const cName = cls.name.toLowerCase();
      const cStudents = students.filter((s) => s.className && s.className.toLowerCase() === cName).map((s) => s.name.toLowerCase());
      const cClassNotes = notes.filter((n) => !handledNotes.has(n) && (n.isClassNote || (n.studentCode || "").toLowerCase() === `classe ${cName}` || (n.studentCode || "").toLowerCase() === cName));
      cClassNotes.forEach((n) => handledNotes.add(n));
      if (cClassNotes.length > 0) groups.push({ icon: "🏢", title: `${t("notes_group_class")} ${cls.name}`, notes: cClassNotes });

      const cStudentNotes = notes.filter((n) => !handledNotes.has(n) && cStudents.includes((n.studentCode || "").toLowerCase()));
      cStudentNotes.forEach((n) => handledNotes.add(n));
      if (cStudentNotes.length > 0) groups.push({ icon: "🎓", title: `${t("notes_group_student")} (${cls.name})`, notes: cStudentNotes });
    });

    const remainingNotes = notes.filter((n) => !handledNotes.has(n));
    if (remainingNotes.length > 0) groups.push({ icon: "🎓", title: t("notes_group_student"), notes: remainingNotes });
    return groups;
  }

  const groups = [];
  const handled = new Set();

  schools.forEach((sch) => {
    const schClasses = classes.filter((c) => !c.schoolId || c.schoolId === sch.id);
    const classNames = new Set(schClasses.map((c) => c.name.toLowerCase()));
    const schStudents = students.filter((s) => s.schoolId === sch.id || classNames.has((s.className || "").toLowerCase()));
    const studentNames = new Set(schStudents.map((s) => s.name.toLowerCase()));

    const schNotes = notes.filter((n) => {
      if (handled.has(n)) return false;
      const code = (n.studentCode || "").toLowerCase();
      return code === sch.name.toLowerCase() || classNames.has(code.replace(/^classe\s+/, "")) || studentNames.has(code);
    });

    schNotes.forEach((n) => handled.add(n));
    if (schNotes.length > 0) {
      groups.push({ icon: "🏫", title: `${sch.name}${sch.city ? ` (${sch.city})` : ""}`, notes: schNotes });
    }
  });

  const remaining = notes.filter((n) => !handled.has(n));
  if (remaining.length > 0) groups.push({ icon: "🎓", title: t("notes_group_student"), notes: remaining });
  return groups;
}
