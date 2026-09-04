import { createEl } from "../../utils/dom.js";

export function createClassOverviewBody({
  yearNav,
  targetClass,
  classStudents,
  notes,
  onStudentClick,
  onEditDidactic,
}) {
  const didacticSection = createEl("div", { className: "form-group" }, [
    createEl("div", { className: "overview-section-header" }, [
      createEl("label", { className: "form-label", i18n: "school_class_didactic_label" }),
      onEditDidactic ? createEl("button", {
        className: "btn btn-secondary btn-sm",
        onClick: onEditDidactic,
        title: "Modifica",
      }, "✏️") : null,
    ].filter(Boolean)),
    targetClass?.didacticNotes
      ? createEl("div", { className: "overview-private-notes" }, [
          createEl("p", { className: "note-text" }, targetClass.didacticNotes),
        ])
      : createEl("p", { className: "app-subtitle", i18n: "school_class_no_didactic" }),
  ]);

  const studentChips = classStudents.map((st) => createEl("span", {
    className: "overview-peer-chip",
    onClick: () => onStudentClick(st),
  }, `🎓 ${st.name} (${(st.supportType || "pei").toUpperCase()})`));

  const studentsSection = createEl("div", { className: "form-group" }, [
    createEl("label", { className: "form-label", i18n: "school_roster_label" }),
    studentChips.length > 0
      ? createEl("div", { className: "tags-bar" }, studentChips)
      : createEl("p", { className: "app-subtitle", i18n: "school_no_students_in_class" }),
  ]);

  const recentNotes = notes.slice(0, 3).map((n) => createEl("div", { className: "overview-note-item" }, [
    createEl("div", { className: "note-meta" }, [
      createEl("span", { className: "badge" }, n.tags.join(" ") || "#Classe"),
      createEl("span", { className: "note-date" }, new Date(n.createdAt).toLocaleDateString()),
    ]),
    createEl("p", { className: "note-text" }, n.content),
  ]));

  const notesSection = createEl("div", { className: "form-group" }, [
    createEl("label", { className: "form-label", i18n: "school_recent_notes" }),
    recentNotes.length > 0
      ? createEl("div", {}, recentNotes)
      : createEl("p", { className: "app-subtitle", i18n: "notes_empty" }),
  ]);

  return createEl("div", { className: "modal-body" }, [
    yearNav,
    didacticSection,
    studentsSection,
    notesSection,
  ].filter(Boolean));
}
