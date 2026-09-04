import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isStudentMatch } from "./rolloverHelper.js";

export function createRolloverStudentList(students, nextYearStudents = [], getDestName, getRetName, isTerminalFn = () => false) {
  let mode = "promoted";
  const items = [];

  const updateBadges = () => {
    const isTerm = isTerminalFn();
    const dest = isTerm ? t("school_rollover_badge_graduated") : (getDestName() || "...");
    const ret = getRetName() || "...";
    items.forEach(({ cb, badgeEl, isLocked, match }) => {
      if (isLocked) {
        badgeEl.className = "badge badge-info";
        badgeEl.textContent = `🔒 ${t("school_rollover_locked_enrolled")} (${match?.className || "..."}) ✓`;
        return;
      }
      const isProm = mode === "promoted" ? cb.checked : !cb.checked;
      badgeEl.className = `badge ${isProm ? "badge-success" : "badge-warning"}`;
      badgeEl.textContent = isProm ? `✅ ${t("school_rollover_badge_promoted")} ➔ ${dest}` : `🔁 ${t("school_rollover_badge_retained")} ➔ ${ret}`;
    });
  };

  const modeBtn = createEl("button", { type: "button", className: "btn btn-secondary btn-sm", onClick: () => {
    mode = mode === "promoted" ? "retained" : "promoted";
    modeBtn.textContent = `⇄ ${t(mode === "promoted" ? "school_rollover_mode_promoted" : "school_rollover_mode_retained")}`;
    updateBadges();
  }}, `⇄ ${t("school_rollover_mode_promoted")}`);

  const selectAllBtn = createEl("button", { type: "button", className: "btn btn-secondary btn-sm", i18n: "school_rollover_select_all", onClick: () => {
    items.forEach((i) => { if (!i.isLocked) i.cb.checked = true; }); updateBadges();
  }});

  const deselectAllBtn = createEl("button", { type: "button", className: "btn btn-secondary btn-sm", i18n: "school_rollover_deselect_all", onClick: () => {
    items.forEach((i) => { if (!i.isLocked) i.cb.checked = false; }); updateBadges();
  }});

  const listEl = createEl("div", { className: "student-checklist rollover-list" });
  if (students.length === 0) {
    listEl.appendChild(createEl("p", { className: "app-subtitle", i18n: "school_no_students_in_class" }));
  } else {
    students.forEach((st) => {
      const match = nextYearStudents.find((ns) => isStudentMatch(st, ns));
      const isLocked = !!match;
      const cb = createEl("input", { type: "checkbox", checked: !isLocked, disabled: isLocked, onChange: updateBadges });
      const badgeEl = createEl("span", { className: "badge badge-success" });
      const row = createEl("label", { className: `student-check-item rollover-item ${isLocked ? "locked" : ""}` }, [
        cb, createEl("span", { className: "student-name" }, `🎓 ${st.name}`), badgeEl
      ]);
      items.push({ student: st, cb, badgeEl, isLocked, match });
      listEl.appendChild(row);
    });
    updateBadges();
  }

  const toolbar = createEl("div", { className: "rollover-checklist-toolbar" }, [
    createEl("div", { className: "rollover-btn-group" }, [selectAllBtn, deselectAllBtn]), modeBtn,
  ]);

  return {
    el: createEl("div", { className: "rollover-checklist-wrapper" }, [toolbar, listEl]),
    updateBadges,
    getPromoted: () => items.filter((i) => !i.isLocked && (mode === "promoted" ? i.cb.checked : !i.cb.checked)).map((i) => i.student),
    getRetained: () => items.filter((i) => !i.isLocked && (mode === "promoted" ? !i.cb.checked : i.cb.checked)).map((i) => i.student),
  };
}
