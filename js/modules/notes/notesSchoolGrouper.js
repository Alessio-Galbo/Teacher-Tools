import { t } from "../../i18n.js";

function buildSchoolSubgroups(sch, notes, handled, { classes, students }) {
  const schName = sch.name.toLowerCase();
  const schClasses = classes.filter((c) => !c.schoolId || c.schoolId === sch.id);
  const subs = [];

  const instNotes = notes.filter((n) => !handled.has(n) && (n.studentCode || "").toLowerCase() === schName);
  instNotes.forEach((n) => handled.add(n));
  if (instNotes.length > 0) subs.push({ icon: "🏫", title: t("notes_group_school"), notes: instNotes });

  schClasses.forEach((cls) => {
    const cName = cls.name.toLowerCase();
    const clsNotes = notes.filter((n) => !handled.has(n) && (n.isClassNote || (n.studentCode || "").toLowerCase() === `classe ${cName}` || (n.studentCode || "").toLowerCase() === cName));
    clsNotes.forEach((n) => handled.add(n));
    if (clsNotes.length > 0) subs.push({ icon: "🏢", title: `${t("notes_group_class")} (${cls.name})`, notes: clsNotes });

    const cStudents = students.filter((s) => s.classId === cls.id || (s.className && s.className.toLowerCase() === cName)).map((s) => s.name.toLowerCase());
    const stNotes = notes.filter((n) => !handled.has(n) && cStudents.includes((n.studentCode || "").toLowerCase()));
    stNotes.forEach((n) => handled.add(n));
    if (stNotes.length > 0) subs.push({ icon: "🎓", title: `${t("notes_group_student")} (${cls.name})`, notes: stNotes });
  });

  const schStudents = students.filter((s) => s.schoolId === sch.id).map((s) => s.name.toLowerCase());
  const remNotes = notes.filter((n) => !handled.has(n) && schStudents.includes((n.studentCode || "").toLowerCase()));
  remNotes.forEach((n) => handled.add(n));
  if (remNotes.length > 0) subs.push({ icon: "🎓", title: t("notes_group_student"), notes: remNotes });

  return subs;
}

export function groupAllSchoolsNotes(notes, { schools = [], classes = [], students = [] }) {
  const handled = new Set();
  const macroGroups = [];

  schools.forEach((sch) => {
    const subgroups = buildSchoolSubgroups(sch, notes, handled, { classes, students });
    if (subgroups.length > 0) {
      const total = subgroups.reduce((sum, s) => sum + s.notes.length, 0);
      macroGroups.push({ isMacro: true, icon: "🏫", title: `${sch.name}${sch.city ? ` (${sch.city})` : ""}`, count: total, subgroups });
    }
  });

  const remaining = notes.filter((n) => !handled.has(n));
  if (remaining.length > 0) {
    const unassignedCls = remaining.filter((n) => n.isClassNote || (n.studentCode || "").toLowerCase().startsWith("classe "));
    const unassignedSt = remaining.filter((n) => !unassignedCls.includes(n));
    const unassignedSubs = [];
    if (unassignedCls.length > 0) unassignedSubs.push({ icon: "🏢", title: t("notes_group_class"), notes: unassignedCls });
    if (unassignedSt.length > 0) unassignedSubs.push({ icon: "🎓", title: t("notes_group_student"), notes: unassignedSt });
    if (unassignedSubs.length > 0) {
      macroGroups.push({ isMacro: true, icon: "📂", title: t("notes_unassigned_school"), count: remaining.length, subgroups: unassignedSubs });
    }
  }

  return macroGroups;
}

