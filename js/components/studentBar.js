import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { getStudents, getActiveStudentId, setActiveStudent } from "../services/studentService.js";
import { getClasses, getSchoolConfig, getSchools } from "../services/schoolService.js";
import { showStudentModal } from "../modules/school/studentModal.js";
import { showStudentOverviewModal } from "../modules/school/studentOverviewModal.js";
import { createDebouncedRenderer } from "../utils/renderHelper.js";
import { createStudentSearchDropdown } from "./studentSearchDropdown.js";

export function initStudentBar(container) {
  if (!container) return;

  async function build() {
    const config = await getSchoolConfig();
    const schools = await getSchools(config.activeYear);
    const classes = await getClasses(config.activeYear);
    const students = await getStudents(config.activeYear);
    const activeId = getActiveStudentId();

    const pinned = students.filter((s) => s.isPinned);
    const unassigned = students.filter((s) => !s.className && !s.isPinned);

    const dropdown = createStudentSearchDropdown(
      { config, schools, classes, students, pinned, unassigned },
      activeId,
      (id) => setActiveStudent(id)
    );

    const label = createEl("label", { className: "student-bar-label", i18n: "student_selector_label" });
    const overviewBtn = createEl("button", { className: "student-bar-btn", title: t("school_overview_btn"), onClick: () => showStudentOverviewModal() }, "📜");

    return createEl("div", { className: "student-bar-inner" }, [label, dropdown, overviewBtn]);
  }

  const render = createDebouncedRenderer(container, build);

  window.addEventListener("studentListChanged", render);
  window.addEventListener("schoolConfigChanged", render);
  window.addEventListener("schoolsListChanged", render);
  window.addEventListener("classesChanged", render);
  window.addEventListener("languageChanged", render);
  window.addEventListener("globalYearChanged", render);
  window.addEventListener("activeStudentChanged", render);
  window.addEventListener("dataRestored", render);
  render();
}
