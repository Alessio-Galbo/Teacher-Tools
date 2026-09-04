import { createEl, clearEl } from "../../utils/dom.js";
import { getSchoolConfig, getSchools, getClasses } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { getNotes } from "../notes/notesModel.js";
import { createSchoolOverviewBody } from "./schoolOverviewBody.js";

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
    const classes = (await getClasses(year)).filter((c) => c.schoolId === school.id || (!c.schoolId && allSchools.length === 1));
    const schoolClassIds = new Set(classes.map((c) => c.id));
    const schoolClassNames = new Set(classes.map((c) => (c.name || "").toLowerCase()));

    const rawStudents = await getStudents(year);
    const seen = new Set();
    const students = rawStudents.filter((s) => {
      const matches = (s.schoolId && s.schoolId === school.id) ||
        (s.classId && schoolClassIds.has(s.classId)) ||
        (s.className && schoolClassNames.has((s.className || "").toLowerCase()));
      if (!matches) return false;
      const k = s.personId || s.id;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    const notes = (await getNotes(null, school.name)).filter((n) => !n.schoolYear || n.schoolYear === year);


    const yearNav = availableYears.length > 1 ? createEl("div", { className: "overview-year-nav" },
      availableYears.map((yr) => createEl("button", {
        className: `overview-year-btn ${yr === year ? "active" : ""}`,
        onClick: () => render(yr),
      }, `📅 ${yr}`))
    ) : null;

    const header = createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title" }, `🏫 ${school.name}${school.city ? ` (${school.city})` : ""}`),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);

    const body = createSchoolOverviewBody({
      yearNav,
      classes,
      students,
      onClassClick: (c) => {
        overlay.classList.remove("active");
        import("./classOverviewModal.js").then((m) => m.showClassOverviewModal(c.name, year));
      },
    });


    const toolbar = createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_close", onClick: () => overlay.classList.remove("active") }),
    ]);

    overlay.appendChild(createEl("div", { className: "modal-box" }, [header, body, toolbar]));
    overlay.classList.add("active");
  }

  await render(initialYear || config.activeYear);
}
