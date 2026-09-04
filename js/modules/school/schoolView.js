import { createEl, clearEl } from "../../utils/dom.js";
import { getSchools, getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { showSchoolModal } from "./schoolModal.js";
import { createSchoolCard } from "./schoolCard.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";
import { getNextSchoolYear } from "./rolloverHelper.js";

let refreshViewFn = null;

export function renderSchoolView(container) {
  clearEl(container);

  const addSchoolBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "school_btn_add_school",
    onClick: () => showSchoolModal({ onSaved: () => { if (refreshViewFn) refreshViewFn(); } }),
  });

  const header = createEl("div", { className: "section-header-row" }, [
    createEl("div", { className: "section-header-info" }, [
      createEl("h2", { className: "section-title", i18n: "school_title" }),
      createEl("p", { className: "section-subtitle", i18n: "school_subtitle" }),
    ]),
    addSchoolBtn,
  ]);

  const schoolsContainer = createEl("div", { className: "schools-container" });

  async function build() {
    const config = await getSchoolConfig();
    const schools = await getSchools(config.activeYear);
    const allClasses = await getClasses();
    const classes = allClasses.filter((c) => c.schoolYear === config.activeYear);
    const students = await getStudents(config.activeYear);
    const nextYearStudents = await getStudents(getNextSchoolYear(config.activeYear));

    if (schools.length === 0) {
      const emptyBtn = createEl("button", {
        className: "btn btn-primary",
        i18n: "school_btn_add_school",
        onClick: () => showSchoolModal({ onSaved: () => { if (refreshViewFn) refreshViewFn(); } }),
      });
      return [createEl("div", { className: "card empty-card" }, [
        createEl("p", { className: "text-muted", i18n: "school_no_schools_in_year" }),
        createEl("div", { className: "form-group" }, [emptyBtn]),
      ])];
    }

    return schools.map((sch) =>
      createSchoolCard(sch, classes, students, config, () => { if (refreshViewFn) refreshViewFn(); }, allClasses, nextYearStudents)
    );
  }

  refreshViewFn = createDebouncedRenderer(schoolsContainer, build);

  container.appendChild(header);
  container.appendChild(schoolsContainer);

  refreshViewFn();
}

window.addEventListener("schoolsListChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("classesChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("studentListChanged", () => { if (refreshViewFn) refreshViewFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshViewFn) refreshViewFn(); });
