import { createEl, clearEl } from "../../utils/dom.js";
import { getActiveStudent, getActiveStudentId, getStudents, setActiveStudent, togglePinStudent } from "../../services/studentService.js";
import { getSchoolConfig, getSchools, getClasses } from "../../services/schoolService.js";
import { getNotes } from "../notes/notesModel.js";
import { showStudentModal } from "./studentModal.js";
import { createStudentOverviewBody } from "./studentOverviewBody.js";

export async function showStudentOverviewModal() {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;

  async function render() {
    clearEl(overlay);
    const activeId = getActiveStudentId();
    if (activeId && activeId.startsWith("class_")) {
      const { showClassOverviewModal } = await import("./classOverviewModal.js");
      return showClassOverviewModal(activeId.replace("class_", ""));
    }

    const activeSt = await getActiveStudent();
    if (!activeSt) {
      window.dispatchEvent(new CustomEvent("navigateToTab", { detail: "view-students" }));
      return;
    }

    const config = await getSchoolConfig();
    const schools = await getSchools(config.activeYear);
    const classes = await getClasses(config.activeYear);
    const allStudents = await getStudents(config.activeYear);

    const studentClass = classes.find((c) => c.id === activeSt.classId || c.name === activeSt.className);
    const studentSchool = schools.find((s) => s.id === studentClass?.schoolId) || schools[0];
    const schoolName = studentSchool ? `${studentSchool.name}${studentSchool.city ? ` (${studentSchool.city})` : ""}` : "";

    const peers = allStudents.filter((s) => s.className && s.className === activeSt.className && s.id !== activeSt.id);
    const notes = await getNotes(null, activeSt.name);

    const pinBtn = createEl("button", {
      className: `btn-pin ${activeSt.isPinned ? "pinned" : ""}`,
      title: activeSt.isPinned ? "Rimuovi Pin" : "Fissa in Evidenza",
      onClick: async () => { await togglePinStudent(activeSt.id); render(); },
    }, "📌");

    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => showStudentModal({ student: activeSt, onSaved: render }),
    }, "✏️");

    const header = createEl("div", { className: "modal-header" }, [
      createEl("div", { className: "tree-actions" }, [createEl("h3", { className: "modal-title" }, `🎓 ${activeSt.name}`), pinBtn, editBtn]),
      createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
    ]);

    const body = createStudentOverviewBody({
      activeSt,
      peers,
      notes,
      schoolName,
      year: config.activeYear,
      onPeerSelect: (peerId) => { setActiveStudent(peerId); render(); },
    });

    const toolbar = createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_close", onClick: () => overlay.classList.remove("active") }),
      createEl("button", {
        className: "btn btn-primary",
        i18n: "school_btn_view_diary",
        onClick: () => { overlay.classList.remove("active"); window.dispatchEvent(new CustomEvent("navigateToTab", { detail: "view-notes" })); },
      }),
    ]);

    overlay.appendChild(createEl("div", { className: "modal-box" }, [header, body, toolbar]));
    overlay.classList.add("active");
  }

  await render();
}
