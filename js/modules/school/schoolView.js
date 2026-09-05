import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSchools, getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { showSchoolModal } from "./schoolModal.js";
import { createSchoolCard } from "./schoolCard.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";
import { getNextSchoolYear } from "./rolloverHelper.js";

let refreshViewFn = null;
let schoolViewMode = localStorage.getItem("teacher_tools_school_view_mode") || "grid";

export function renderSchoolView(container) {
  clearEl(container);

  const addSchoolBtn = createEl("button", {
    className: "btn btn-primary btn-sm school-header-add-btn",
    title: t("school_btn_add_school"),
    onClick: () => showSchoolModal({ onSaved: () => { if (refreshViewFn) refreshViewFn(); } }),
  }, [
    createEl("span", { className: "school-btn-mobile-icon" }, "+ 🏫"),
    createEl("span", { className: "school-btn-desktop-text", i18n: "school_btn_add_school" }),
  ]);

  const schoolsContainer = createEl("div");
  const updateSchoolViewClass = () => {
    schoolsContainer.className = `schools-container ${schoolViewMode === "grid" ? "view-grid" : "view-rows"}`;
  };
  updateSchoolViewClass();

  const viewModeBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only view-mode-toggle-btn",
    title: t("school_view_toggle"),
    onClick: () => {
      schoolViewMode = schoolViewMode === "grid" ? "rows" : "grid";
      localStorage.setItem("teacher_tools_school_view_mode", schoolViewMode);
      updateSchoolViewClass();
      updateViewModeBtn();
    },
  });
  function updateViewModeBtn() {
    viewModeBtn.textContent = schoolViewMode === "grid" ? "☰" : "⊞";
  }
  updateViewModeBtn();

  const header = createEl("div", { className: "section-header-row" }, [
    createEl("div", { className: "section-header-info" }, [
      createEl("h2", { className: "section-title", i18n: "school_title" }),
      createEl("p", { className: "section-subtitle", i18n: "school_subtitle" }),
    ]),
    createEl("div", { className: "section-header-actions" }, [viewModeBtn, addSchoolBtn]),
  ]);

  async function build() {
    const config = await getSchoolConfig();
    const schools = await getSchools(config.activeYear);
    const allClasses = await getClasses();
    const classes = allClasses.filter((c) => c.schoolYear === config.activeYear);
    const students = await getStudents(config.activeYear);
    const nextYearStudents = await getStudents(getNextSchoolYear(config.activeYear));

    if (schools.length === 0) {
      return [createEl("div", { className: "card empty-card" }, [
        createEl("p", { className: "text-muted", i18n: "school_no_schools_in_year" }),
      ])];
    }

    return schools.map((sch) =>
      createSchoolCard(sch, classes, students, config, () => { if (refreshViewFn) refreshViewFn(); }, allClasses, nextYearStudents)
    );
  }

  refreshViewFn = createDebouncedRenderer(schoolsContainer, build);
  container.append(header, schoolsContainer);
  refreshViewFn();
}

window.addEventListener("schoolsListChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("classesChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("studentListChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshViewFn) refreshViewFn(); });
