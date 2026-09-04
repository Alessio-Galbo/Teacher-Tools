import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export function buildDropdownItems(listEl, data, activeId, onSelect, onDone) {
  const { config, schools, classes, students, pinned, unassigned } = data;

  const makeItem = (id, label, levelClass, searchTerms) => {
    const isSel = id === activeId;
    const item = createEl("div", {
      className: `student-dropdown-item ${levelClass} ${isSel ? "active" : ""}`,
      onClick: (e) => {
        e.stopPropagation();
        onDone(id);
        if (onSelect) onSelect(id);
      },
    }, label);
    item.dataset.search = (label + " " + (searchTerms || "")).toLowerCase();
    return item;
  };

  listEl.appendChild(makeItem("__ALL__", `📅 ${t("student_all")} (A.S. ${config.activeYear})`, "level-root", "tutti"));
  if (pinned.length > 0) {
    listEl.appendChild(createEl("div", { className: "student-dropdown-header" }, `── 📌 ${t("student_group_pinned")} ──`));
    pinned.forEach((s) => listEl.appendChild(makeItem(s.id, `📌 ${s.name}${s.className ? ` (${s.className})` : ""}`, "level-class", s.name)));
  }

  schools.forEach((sch) => {
    listEl.appendChild(makeItem(`school_${sch.id}`, `🏫 ${sch.name}${sch.city ? ` (${sch.city})` : ""}`, "level-school", sch.name));
    const schCls = classes.filter((c) => !c.schoolId || c.schoolId === sch.id);
    schCls.forEach((c) => {
      listEl.appendChild(makeItem(`class_${c.name}`, `🏢 Classe ${c.name}`, "level-class", `${sch.name} ${c.name}`));
      const clsSts = students.filter((s) => (s.classId === c.id || s.className === c.name) && !s.isPinned);
      clsSts.forEach((st) => listEl.appendChild(makeItem(st.id, `🎓 ${st.name}`, "level-student", `${sch.name} ${c.name} ${st.name}`)));
    });
  });

  if (unassigned.length > 0) {
    listEl.appendChild(createEl("div", { className: "student-dropdown-header" }, `── 🎓 ${t("school_unassigned_class")} ──`));
    unassigned.forEach((s) => listEl.appendChild(makeItem(s.id, `🎓 ${s.name}`, "level-class", s.name)));
  }
}
