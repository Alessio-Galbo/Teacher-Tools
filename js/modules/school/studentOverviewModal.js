import { createEl, clearEl } from "../../utils/dom.js";
import { getActiveStudent, getActiveStudentId, getStudents, setActiveStudent, togglePinStudent } from "../../services/studentService.js";
import { getSchoolConfig, getSchools, getClasses } from "../../services/schoolService.js";
import { getAll } from "../../services/db.js";
import { getNotes } from "../notes/notesModel.js";
import { showStudentModal } from "./studentModal.js";
import { createStudentOverviewBody } from "./studentOverviewBody.js";
import { formatSchoolFullName } from "./schoolLocationHelper.js";

export async function showStudentOverviewModal(initialYear = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;

  const activeId = getActiveStudentId();
  if (activeId && activeId.startsWith("class_")) {
    const { showClassOverviewModal } = await import("./classOverviewModal.js");
    return showClassOverviewModal(activeId.replace("class_", ""), initialYear);
  }
  if (activeId && activeId.startsWith("school_")) {
    const { showSchoolOverviewModal } = await import("./schoolOverviewModal.js");
    return showSchoolOverviewModal(activeId.replace("school_", ""), initialYear);
  }
  if (!activeId || activeId === "__ALL__") {
    const { showGlobalOverviewModal } = await import("./globalOverviewModal.js");
    return showGlobalOverviewModal(initialYear);
  }

  const baseSt = await getActiveStudent();
  if (!baseSt) return;

  const config = await getSchoolConfig();
  const allStudentsList = await getAll("students");
  const pId = baseSt.personId || baseSt.id;
  const historyList = allStudentsList.filter((s) => (s.personId && s.personId === pId) || s.name === baseSt.name);
  const availableYears = [...new Set(historyList.map((s) => s.schoolYear).filter(Boolean))];
  if (availableYears.length === 0 && config.activeYear) availableYears.push(config.activeYear);

  async function render(year) {
    clearEl(overlay);
    const activeSt = historyList.find((s) => s.schoolYear === year) || baseSt;
    const schools = await getSchools(year);
    const classes = await getClasses(year);
    const yearStudents = await getStudents(year);

    const studentClass = classes.find((c) => c.id === activeSt.classId || c.name === activeSt.className);
    const studentSchool = schools.find((s) => s.id === studentClass?.schoolId) || schools[0];
    const schoolName = studentSchool ? formatSchoolFullName(studentSchool) : "";
    const peers = yearStudents.filter((s) => s.className && s.className === activeSt.className && s.id !== activeSt.id);
    const notes = (await getNotes(null, activeSt.name)).filter((n) => !n.schoolYear || n.schoolYear === year);

    const pinBtn = createEl("button", {
      className: `btn-pin ${activeSt.isPinned ? "pinned" : ""}`,
      title: activeSt.isPinned ? "Rimuovi Pin" : "Fissa in Evidenza",
      onClick: async () => { await togglePinStudent(activeSt.id); render(year); },
    }, "📌");

    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => showStudentModal({ student: activeSt, onSaved: () => render(year) }),
    }, "✏️");

    const header = createEl("div", { className: "modal-header" }, [
      createEl("div", { className: "tree-actions" }, [createEl("h3", { className: "modal-title" }, `🎓 ${activeSt.name}`), pinBtn, editBtn]),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);

    const body = createStudentOverviewBody({
      activeSt, peers, notes, schoolName, year, availableYears,
      onPeerSelect: (peerId) => { setActiveStudent(peerId); render(year); },
      onYearSelect: (yr) => render(yr),
    });

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

  await render(initialYear || baseSt.schoolYear || config.activeYear);
}
