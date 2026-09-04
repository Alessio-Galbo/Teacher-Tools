import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function createRolloverStudentList(students, nextYearStudents = [], getDestName, getRetName) {
  let mode = "promoted";
  const items = [];

  const updateBadges = () => {
    const dest = getDestName() || "...";
    const ret = getRetName() || "...";
    items.forEach(({ student, cb, badgeEl }) => {
      const isPromoted = mode === "promoted" ? cb.checked : !cb.checked;
      badgeEl.className = `badge ${isPromoted ? "badge-success" : "badge-warning"}`;
      badgeEl.textContent = isPromoted
        ? `✅ ${t("school_rollover_badge_promoted")} ➔ ${dest}`
        : `🔁 ${t("school_rollover_badge_retained")} ➔ ${ret}`;
    });
  };

  const modeBtn = createEl("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => {
      mode = mode === "promoted" ? "retained" : "promoted";
      modeBtn.textContent = `⇄ ${t(mode === "promoted" ? "school_rollover_mode_promoted" : "school_rollover_mode_retained")}`;
      updateBadges();
    },
  }, `⇄ ${t("school_rollover_mode_promoted")}`);

  const selectAllBtn = createEl("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    i18n: "school_rollover_select_all",
    onClick: () => { items.forEach((i) => (i.cb.checked = true)); updateBadges(); },
  });

  const deselectAllBtn = createEl("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    i18n: "school_rollover_deselect_all",
    onClick: () => { items.forEach((i) => (i.cb.checked = false)); updateBadges(); },
  });

  const listEl = createEl("div", { className: "student-checklist rollover-list" });
  if (students.length === 0) {
    listEl.appendChild(createEl("p", { className: "app-subtitle", i18n: "school_no_students_in_class" }));
  } else {
    students.forEach((st) => {
      const cb = createEl("input", { type: "checkbox", checked: true, onChange: updateBadges });
      const badgeEl = createEl("span", { className: "badge badge-success" });
      const already = nextYearStudents.some((ns) => ns.name.toLowerCase() === st.name.toLowerCase());
      const alreadyBadge = already ? createEl("span", { className: "badge badge-info" }, `✓ ${t("school_rollover_already_enrolled")}`) : null;

      const row = createEl("label", { className: "student-check-item rollover-item" }, [
        cb,
        createEl("span", { className: "student-name" }, `🎓 ${st.name}`),
        badgeEl,
        alreadyBadge,
      ].filter(Boolean));

      items.push({ student: st, cb, badgeEl });
      listEl.appendChild(row);
    });
    updateBadges();
  }

  const toolbar = createEl("div", { className: "rollover-checklist-toolbar" }, [
    createEl("div", { className: "rollover-btn-group" }, [selectAllBtn, deselectAllBtn]),
    modeBtn,
  ]);

  const container = createEl("div", { className: "rollover-checklist-wrapper" }, [toolbar, listEl]);

  return {
    el: container,
    updateBadges,
    getPromoted: () => items.filter((i) => (mode === "promoted" ? i.cb.checked : !i.cb.checked)).map((i) => i.student),
    getRetained: () => items.filter((i) => (mode === "promoted" ? !i.cb.checked : i.cb.checked)).map((i) => i.student),
  };
}
