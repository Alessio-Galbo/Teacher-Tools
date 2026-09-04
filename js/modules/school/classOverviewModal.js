import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getStudents, setActiveStudent } from "../../services/studentService.js";
import { getNotes } from "../notes/notesModel.js";

export async function showClassOverviewModal(className) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const allStudents = await getStudents();
  const classStudents = allStudents.filter((s) => s.className === className);
  const notes = await getNotes(null, `Classe ${className}`);

  const header = createEl("div", { className: "modal-header" }, [
    createEl("h3", { className: "modal-title" }, `🏢 Classe ${className}`),
    createEl("button", { className: "modal-close-btn", onClick: () => overlay.classList.remove("active") }, "✕"),
  ]);

  const studentChips = classStudents.map((st) =>
    createEl("span", {
      className: "overview-peer-chip",
      onClick: () => {
        setActiveStudent(st.id);
        overlay.classList.remove("active");
        import("./studentOverviewModal.js").then((m) => m.showStudentOverviewModal());
      },
    }, `🎓 ${st.name} (${(st.supportType || "pei").toUpperCase()})`)
  );

  const recentNotes = notes.slice(0, 3).map((n) =>
    createEl("div", { className: "overview-note-item" }, [
      createEl("div", { className: "note-meta" }, [
        createEl("span", { className: "badge" }, n.tags.join(" ") || "#Classe"),
        createEl("span", { className: "note-date" }, new Date(n.createdAt).toLocaleDateString()),
      ]),
      createEl("p", { className: "note-text" }, n.content),
    ])
  );

  const body = createEl("div", { className: "modal-body" }, [
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "school_roster_label" }),
      studentChips.length > 0 ? createEl("div", { className: "tags-bar" }, studentChips) : createEl("p", { className: "app-subtitle", i18n: "school_no_students_in_class" }),
    ]),
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "school_recent_notes" }),
      recentNotes.length > 0 ? createEl("div", {}, recentNotes) : createEl("p", { className: "app-subtitle", i18n: "notes_empty" }),
    ]),
  ]);

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
