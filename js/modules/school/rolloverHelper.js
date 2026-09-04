export function isTerminalClass(name, school = null) {
  const max = school?.maxGrade || 5;
  const match = (name || "").match(/^(\d+)/);
  if (!match) return false;
  return parseInt(match[1], 10) >= max;
}

export function getNextClassName(name, school = null) {
  if (isTerminalClass(name, school)) return "";
  const match = (name || "").match(/^(\d+)(.*)$/);
  return match ? `${+match[1] + 1}${match[2]}` : (name ? `${name} (Succ.)` : "Classe");
}

export function getNextSchoolYear(cur) {
  const p = (cur || "2024/2025").split("/");
  return p.length === 2 && !isNaN(p[0]) ? `${+p[0] + 1}/${+p[1] + 1}` : "2025/2026";
}

export function isStudentMatch(s1, s2) {
  if (!s1 || !s2) return false;
  if (s1.personId && s2.personId && s1.personId === s2.personId) return true;
  if (s1.originStudentId && (s1.originStudentId === s2.id || s1.originStudentId === s2.originStudentId)) return true;
  if (s2.originStudentId && (s2.originStudentId === s1.id)) return true;
  return (s1.name || "").trim().toLowerCase() === (s2.name || "").trim().toLowerCase();
}

export function getPromotionStatus(cls, classStudents, nextYearStudents, nextClass, allClasses = []) {
  const total = classStudents.length;
  if (total === 0) return { status: "none", isPromoted: false };

  const destClassObj = nextClass || (cls.promotedToClassId && allClasses.find((c) => c.id === cls.promotedToClassId));
  const isTerm = cls.promotedToClassName === "Fine Ciclo";
  if (!destClassObj && !isTerm) return { status: "none", isPromoted: false };

  const yr = destClassObj?.schoolYear || cls.promotedToYear || "";
  const nm = destClassObj?.name || cls.promotedToClassName || "";

  const validNextClassIds = new Set(allClasses.filter((c) => !yr || c.schoolYear === yr).map((c) => c.id));
  const validNextStudents = nextYearStudents.filter((ns) => !ns.classId || validNextClassIds.has(ns.classId));
  const enrolledCount = classStudents.filter((st) => validNextStudents.some((ns) => isStudentMatch(st, ns))).length;

  if (enrolledCount === 0) return { status: "none", isPromoted: false };
  if (enrolledCount < total) {
    return {
      status: "partial", isPromoted: true, enrolledCount, total,
      label: isTerm ? `⚠️ 🎓 Fine Ciclo • ${enrolledCount}/${total}` : `⚠️ ↗ ${nm || "..."} (${yr}) • ${enrolledCount}/${total}`,
      badgeClass: "badge-warning",
    };
  }
  return {
    status: "complete", isPromoted: true, enrolledCount, total,
    label: isTerm ? "🎓 Fine Ciclo ✓" : `↗ ${nm || "..."} (${yr}) ✓`,
    badgeClass: "badge-success",
  };

}
