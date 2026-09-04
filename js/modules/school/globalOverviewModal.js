import { createEl, clearEl } from "../../utils/dom.js";
import { getSchoolConfig, getSchools, getClasses } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";

export async function showGlobalOverviewModal(initialYear = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;

  const config = await getSchoolConfig();
  const availableYears = config.years || [config.activeYear];

  async function render(year) {
    clearEl(overlay);
    const schools = await getSchools(year);
    const classes = await getClasses(year);
    const students = await getStudents(year);

    const yearNav = availableYears.length > 1 ? createEl("div", { className: "overview-year-nav" },
      availableYears.map((yr) => createEl("button", {
        className: `overview-year-btn ${yr === year ? "active" : ""}`,
        onClick: () => render(yr),
      }, `📅 ${yr}`))
    ) : null;

    const pei = students.filter((s) => (s.supportType || "pei") === "pei").length;
    const bes = students.filter((s) => s.supportType === "bes").length;
    const curr = students.filter((s) => s.supportType === "curriculare").length;

    const statsGrid = createEl("div", { className: "overview-grid" }, [
      createEl("div", { className: "overview-info-item" }, [
        createEl("span", { className: "form-label", i18n: "overview_total_schools" }),
        createEl("span", { className: "badge" }, `${schools.length}`),
      ]),
      createEl("div", { className: "overview-info-item" }, [
        createEl("span", { className: "form-label", i18n: "overview_total_classes" }),
        createEl("span", { className: "badge" }, `${classes.length}`),
      ]),
      createEl("div", { className: "overview-info-item" }, [
        createEl("span", { className: "form-label", i18n: "overview_total_students" }),
        createEl("span", { className: "badge badge-primary" }, `${students.length} (${pei} PEI, ${bes} BES, ${curr} Curr)`),
      ]),
    ]);

    const schoolChips = schools.map((s) => createEl("span", {
      className: "overview-peer-chip",
      onClick: () => {
        overlay.classList.remove("active");
        import("./schoolOverviewModal.js").then((m) => m.showSchoolOverviewModal(s.id, year));
      },
    }, `🏫 ${s.name}${s.city ? ` (${s.city})` : ""}`));

    const header = createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "overview_global_title" }),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);

    const body = createEl("div", { className: "modal-body" }, [
      yearNav, statsGrid,
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "school_card_title" }),
        schoolChips.length > 0 ? createEl("div", { className: "tags-bar" }, schoolChips) : createEl("p", { className: "app-subtitle", i18n: "school_no_schools_in_year" }),
      ]),
    ]);

    const toolbar = createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_close", onClick: () => overlay.classList.remove("active") }),
      createEl("button", {
        className: "btn btn-primary", i18n: "school_btn_view_diary",
        onClick: () => { overlay.classList.remove("active"); window.dispatchEvent(new CustomEvent("navigateToTab", { detail: "view-notes" })); },
      }),
    ]);

    overlay.appendChild(createEl("div", { className: "modal-box" }, [header, body, toolbar]));
    overlay.classList.add("active");
  }

  await render(initialYear || config.activeYear);
}
