import { createEl } from "../../utils/dom.js";

export function createSchoolOverviewBody({ yearNav, classes = [], students = [], onClassClick = null }) {
  const classChips = classes.map((c) => {
    const count = students.filter((s) => s.classId === c.id || s.className === c.name).length;
    return createEl("span", {
      className: "overview-peer-chip",
      onClick: () => { if (onClassClick) onClassClick(c); },
    }, `🏢 ${c.name} (${count})`);
  });

  const pei = students.filter((s) => (s.supportType || "pei") === "pei").length;
  const bes = students.filter((s) => s.supportType === "bes").length;
  const curr = students.filter((s) => s.supportType === "curriculare").length;

  const statsGrid = createEl("div", { className: "overview-grid" }, [
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "overview_total_classes" }),
      createEl("span", { className: "badge" }, `${classes.length}`),
    ]),
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "overview_total_students" }),
      createEl("span", { className: "badge badge-primary" }, `${students.length} (${pei} PEI, ${bes} BES, ${curr} Curr)`),
    ]),
  ]);

  return createEl("div", { className: "modal-body" }, [
    yearNav, statsGrid,
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "overview_school_classes" }),
      classChips.length > 0 ? createEl("div", { className: "tags-bar" }, classChips) : createEl("p", { className: "app-subtitle", i18n: "overview_no_classes" }),
    ]),
  ]);
}
