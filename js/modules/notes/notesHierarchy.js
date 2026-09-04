export function resolveTargetScope(activeId, { schools = [], classes = [], students = [] }) {
  if (!activeId || activeId === "__ALL__") {
    return { type: "all", filter: () => true };
  }

  if (activeId.startsWith("school_")) {
    const schId = activeId.replace("school_", "");
    const school = schools.find((s) => s.id === schId || `school_${s.id}` === activeId);
    const schName = school ? school.name.toLowerCase() : "";
    const schClasses = classes.filter((c) => !c.schoolId || c.schoolId === schId).map((c) => c.name.toLowerCase());
    const schStudents = students.filter((s) => s.schoolId === schId || (s.className && schClasses.includes(s.className.toLowerCase()))).map((s) => s.name.toLowerCase());

    return {
      type: "school", entity: school,
      filter: (n) => {
        const code = (n.studentCode || "").toLowerCase().trim();
        if (schName && code === schName) return true;
        if (schClasses.some((c) => code === `classe ${c}` || code === c)) return true;
        return schStudents.includes(code);
      },
    };
  }

  if (activeId.startsWith("class_")) {
    const clsName = activeId.replace("class_", "").toLowerCase().trim();
    const clsObj = classes.find((c) => c.name.toLowerCase() === clsName);
    const parentSchool = clsObj && clsObj.schoolId ? schools.find((s) => s.id === clsObj.schoolId) : null;
    const parentSchName = parentSchool ? parentSchool.name.toLowerCase() : "";
    const clsStudents = students.filter((s) => s.className && s.className.toLowerCase() === clsName).map((s) => s.name.toLowerCase());

    return {
      type: "class", entity: clsObj || { name: clsName },
      filter: (n) => {
        const code = (n.studentCode || "").toLowerCase().trim();
        if (code === `classe ${clsName}` || code === clsName) return true;
        if (clsStudents.includes(code)) return true;
        return parentSchName ? code === parentSchName : false;
      },
    };
  }

  const student = students.find((s) => s.id === activeId);
  const stName = student ? student.name.toLowerCase().trim() : "";
  const clsName = student && student.className ? student.className.toLowerCase().trim() : "";
  const clsObj = clsName ? classes.find((c) => c.name.toLowerCase() === clsName) : null;
  const parentSchool = (clsObj && clsObj.schoolId ? schools.find((s) => s.id === clsObj.schoolId) : null) || (student && student.schoolId ? schools.find((s) => s.id === student.schoolId) : null);
  const parentSchName = parentSchool ? parentSchool.name.toLowerCase() : "";

  return {
    type: "student", entity: student,
    filter: (n) => {
      const code = (n.studentCode || "").toLowerCase().trim();
      if (stName && code === stName) return true;
      if (clsName && (code === `classe ${clsName}` || code === clsName)) return true;
      return parentSchName ? code === parentSchName : false;
    },
  };
}
