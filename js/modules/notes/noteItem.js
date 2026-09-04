import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { removeNote } from "./notesModel.js";

export function createNoteItem(note, onDeleted, onEdit) {
  const code = note.studentCode || "";
  const isClass = note.isClassNote || code.startsWith("Classe ");
  const icon = isClass ? "🏢" : "🎓";

  const editBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only",
    title: t("notes_btn_edit"),
    onClick: () => { if (onEdit) onEdit(note); },
  }, "✏️");

  const deleteBtn = createEl("button", {
    className: "note-delete-btn btn-sm btn-icon-only",
    title: t("notes_delete_confirm"),
    onClick: async () => {
      if (confirm(t("notes_delete_confirm"))) {
        await removeNote(note.id);
        showToast(t("toast_deleted"), "info");
        if (onDeleted) onDeleted();
      }
    },
  }, "🗑");

  return createEl("div", { className: "card note-item" }, [
    createEl("div", { className: "note-meta" }, [
      createEl("span", { className: "note-student" }, `${icon} ${code}`),
      createEl("span", { className: "note-date" }, new Date(note.createdAt).toLocaleDateString()),
    ]),
    createEl("div", { className: "note-text" }, note.content),
    createEl("div", { className: "note-footer" }, [
      createEl("div", { className: "note-tags-list" }, (note.tags || []).map((tg) => createEl("span", { className: "badge" }, tg))),
      createEl("div", { className: "tree-actions" }, [editBtn, deleteBtn]),
    ]),
  ]);
}
