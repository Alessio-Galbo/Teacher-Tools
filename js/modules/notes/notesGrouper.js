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

  const classNotes = notes.filter((n) => isClassCode(n.studentCode || "") || isSchoolCode(n.studentCode || ""));
  const stNotes = notes.filter((n) => !classNotes.includes(n));
  return [
    { icon: "🏢", title: `${t("notes_group_class")} / ${t("notes_group_school")}`, notes: classNotes },
    { icon: "🎓", title: t("notes_group_student"), notes: stNotes },
  ].filter((g) => g.notes.length > 0);
}
