import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSchoolConfig, getClasses } from "../../services/schoolService.js";
import { getStudents, getActiveStudentId, setActiveStudent, removeStudent } from "../../services/studentService.js";
import { getNotes } from "../notes/notesModel.js";
import { showStudentModal } from "./studentModal.js";

export function createSchoolStudentsList(selectedClassFilter = null, onRefreshNeeded) {
  const container = createEl("div", { id: "school-students-section" });

  async function render() {
    container.replaceChildren();
    const config = await getSchoolConfig();
    const allStudents = await getStudents(config.activeYear);
    const classes = await getClasses(config.activeYear);
    const notes = await getNotes();
    const activeId = getActiveStudentId();

    const filtered = selectedClassFilter
      ? allStudents.filter((s) => s.classId === selectedClassFilter.id || s.className === selectedClassFilter.name)
      : allStudents;

    const addBtn = createEl("button", {
      className: "btn btn-primary btn-sm",
      i18n: "students_btn_add",
      onClick: () => showStudentModal({ onSaved: () => { render(); if (onRefreshNeeded) onRefreshNeeded(); } }),
    });

    const header = createEl("div", { className: "card-header" }, [
      createEl("h3", { className: "card-title" }, selectedClassFilter ? `Alunni ${selectedClassFilter.name}` : t("students_all_title")),
      addBtn,
    ]);

    const listEl = createEl("div", { className: "students-list" });
    if (filtered.length === 0) {
      listEl.appendChild(createEl("p", { className: "app-subtitle", i18n: "students_empty" }));
    } else {
      filtered.forEach((st) => {
        const count = notes.filter((n) => n.studentCode === st.name).length;
        const isActive = st.id === activeId;
        const badgeType = st.supportType === "bes" ? "badge-bes" : (st.supportType === "curriculare" ? "badge-curriculare" : "badge-pei");

        const editBtn = createEl("button", {
          className: "btn btn-secondary btn-sm",
          onClick: () => showStudentModal({ student: st, onSaved: () => { render(); if (onRefreshNeeded) onRefreshNeeded(); } }),
        }, "✏️");

        const deleteBtn = createEl("button", {
          className: "note-delete-btn",
          onClick: async () => {
            if (confirm(t("students_delete_confirm"))) {
              await removeStudent(st.id);
              render();
              if (onRefreshNeeded) onRefreshNeeded();
            }
          },
        }, "🗑");

        const actionBtn = isActive
          ? createEl("span", { className: "badge badge-primary" }, "Attivo")
          : createEl("button", {
              className: "btn btn-secondary btn-sm",
              i18n: "students_btn_select",
              onClick: () => { setActiveStudent(st.id); render(); },
            });

        const card = createEl("div", { className: "card note-item" }, [
          createEl("div", { className: "note-meta" }, [
            createEl("span", { className: "card-title" }, `🎓 ${st.name}`),
            createEl("div", { className: "student-card-actions" }, [
              st.className ? createEl("span", { className: "badge" }, st.className) : null,
              createEl("span", { className: `badge ${badgeType}` }, (st.supportType || "pei").toUpperCase()),
              createEl("span", { className: "badge" }, `${count} ${t("students_notes_count")}`),
            ]),
          ]),
          createEl("div", { className: "note-footer" }, [actionBtn, createEl("div", { className: "student-card-actions" }, [editBtn, deleteBtn])]),
        ]);
        listEl.appendChild(card);
      });
    }

    container.appendChild(header);
    container.appendChild(listEl);
  }

  render();
  return { el: container, refresh: render };
}
