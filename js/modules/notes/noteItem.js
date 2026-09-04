import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { removeNote } from "./notesModel.js";

export function createNoteItem(note, onDeleted) {
  return createEl("div", { className: "card note-item" }, [
    createEl("div", { className: "note-meta" }, [
      createEl("span", { className: "note-student" }, note.studentCode),
      createEl("span", { className: "note-date" }, new Date(note.createdAt).toLocaleDateString()),
    ]),
    createEl("div", { className: "note-text" }, note.content),
    createEl("div", { className: "note-footer" }, [
      createEl("div", {}, note.tags.map((tg) => createEl("span", { className: "badge" }, tg))),
      createEl("button", {
        className: "note-delete-btn",
        onClick: async () => {
          if (confirm(t("notes_delete_confirm"))) {
            await removeNote(note.id);
            showToast(t("toast_deleted"), "info");
            if (onDeleted) onDeleted();
          }
        },
      }, "🗑"),
    ]),
  ]);
}
