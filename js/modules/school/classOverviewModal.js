import { createEl, clearEl } from "../../utils/dom.js";
import { getStudents, setActiveStudent } from "../../services/studentService.js";
import { getSchoolConfig } from "../../services/schoolService.js";
import { getAll } from "../../services/db.js";
import { getNotes } from "../notes/notesModel.js";
import { createClassOverviewBody } from "./classOverviewBody.js";
import { showClassEditModal } from "./classEditModal.js";

export async function showClassOverviewModal(classIdOrName, initialYear = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;

  const config = await getSchoolConfig();
  const allClasses = await getAll("classes");
  const foundClass = allClasses.find((c) => c.id === classIdOrName || c.name === classIdOrName);
  const className = foundClass ? foundClass.name : classIdOrName.replace(/^(class_|cls_)/, "").replace(/^Classe\s+/, "");
  const matchingClasses = allClasses.filter((c) => c.name === className || c.id === classIdOrName);
  const availableYears = [...new Set(matchingClasses.map((c) => c.schoolYear).filter(Boolean))];
  if (availableYears.length === 0 && config.activeYear) availableYears.push(config.activeYear);

  async function render(year) {
    clearEl(overlay);
    const targetClass = allClasses.find((c) => c.schoolYear === year && (c.name === className || c.id === classIdOrName));
    const displayName = targetClass ? targetClass.name : className;
    const yearStudents = await getStudents(year);
    const rawClassStudents = yearStudents.filter((s) => (targetClass && s.classId === targetClass.id) || s.className === displayName);

    const seen = new Set();
    const classStudents = rawClassStudents.filter((s) => {
      const k = s.personId || s.id;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    const notes = (await getNotes(null, `Classe ${displayName}`)).filter((n) => !n.schoolYear || n.schoolYear === year);

    const yearNav = availableYears.length > 1 ? createEl("div", { className: "overview-year-nav" },
      availableYears.map((yr) => createEl("button", {
        className: `overview-year-btn ${yr === year ? "active" : ""}`,
        onClick: () => render(yr),
      }, `📅 ${yr}`))
    ) : null;

    const header = createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title" }, `🏢 Classe ${displayName}`),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);


    const body = createClassOverviewBody({
      yearNav,
      targetClass,
      classStudents,
      notes,
      onStudentClick: (st) => {
        setActiveStudent(st.id);
        overlay.classList.remove("active");
        import("./studentOverviewModal.js").then((m) => m.showStudentOverviewModal());
      },
      onEditDidactic: targetClass ? () => {
        showClassEditModal(targetClass, () => render(year));
      } : null,
    });

    const toolbar = createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_close", onClick: () => overlay.classList.remove("active") }),
      createEl("button", {
        className: "btn btn-primary", i18n: "school_btn_view_diary",
        onClick: () => {
          overlay.classList.remove("active");
          window.dispatchEvent(new CustomEvent("navigateToTab", { detail: "view-notes" }));
        },
      }),
    ]);

    overlay.appendChild(createEl("div", { className: "modal-box" }, [header, body, toolbar]));
    overlay.classList.add("active");
  }

  await render(initialYear || config.activeYear);
}
