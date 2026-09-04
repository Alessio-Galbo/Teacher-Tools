import { createEl, clearEl } from "../../utils/dom.js";
import { getSchoolConfig, getSchools, getClasses } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { getNotes } from "../notes/notesModel.js";

export async function showSchoolOverviewModal(schoolId, initialYear = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;

  const config = await getSchoolConfig();
  const cleanId = (schoolId || "").replace(/^school_/, "");
  const allSchools = await getSchools();
  const school = allSchools.find((s) => s.id === cleanId) || allSchools[0];
  if (!school) return;

  const availableYears = config.years || [config.activeYear];

  async function render(year) {
    clearEl(overlay);
    const classes = (await getClasses(year)).filter((c) => !c.schoolId || c.schoolId === school.id);
    const students = (await getStudents(year)).filter((s) => !s.schoolId || s.schoolId === school.id || classes.some((c) => c.id === s.classId));
    const notes = (await getNotes(null, school.name)).filter((n) => !n.schoolYear || n.schoolYear === year);

    const yearNav = availableYears.length > 1 ? createEl("div", { className: "overview-year-nav" },
      availableYears.map((yr) => createEl("button", {
        className: `overview-year-btn ${yr === year ? "active" : ""}`,
        onClick: () => render(yr),
      }, `📅 ${yr}`))
    ) : null;

    const classChips = classes.map((c) => {
      const count = students.filter((s) => s.classId === c.id || s.className === c.name).length;
      return createEl("span", {
        className: "overview-peer-chip",
        onClick: () => {
          overlay.classList.remove("active");
          import("./classOverviewModal.js").then((m) => m.showClassOverviewModal(c.name, year));
        },
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

    const header = createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title" }, `🏫 ${school.name}${school.city ? ` (${school.city})` : ""}`),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);

    const body = createEl("div", { className: "modal-body" }, [
      yearNav, statsGrid,
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "overview_school_classes" }),
        classChips.length > 0 ? createEl("div", { className: "tags-bar" }, classChips) : createEl("p", { className: "app-subtitle", i18n: "overview_no_classes" }),
      ]),
    ]);

    const toolbar = createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_close", onClick: () => overlay.classList.remove("active") }),
    ]);

    overlay.appendChild(createEl("div", { className: "modal-box" }, [header, body, toolbar]));
    overlay.classList.add("active");
  }

  await render(initialYear || config.activeYear);
}
