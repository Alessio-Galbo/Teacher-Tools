import { createEl } from "../../utils/dom.js";
import { createNoteItem } from "./noteItem.js";
import { showNoteModal } from "./noteModal.js";

function renderSubgroup(grp, onRefresh) {
  return createEl("div", { className: "notes-group notes-subgroup" }, [
    createEl("div", { className: "notes-group-header notes-subgroup-header" }, [
      createEl("span", { className: "notes-group-icon" }, grp.icon),
      createEl("h4", { className: "notes-group-title" }, grp.title),
      createEl("span", { className: "badge notes-group-count" }, String(grp.notes.length)),
    ]),
    createEl("div", { className: "notes-group-list" },
      grp.notes.map((n) =>
        createNoteItem(n, onRefresh, (noteToEdit) => showNoteModal({ note: noteToEdit, onSaved: onRefresh }))
      )
    ),
  ]);
}

export function renderNotesGroups(groups, onRefresh) {
  return groups.map((grp) => {
    if (grp.isMacro && Array.isArray(grp.subgroups)) {
      return createEl("div", { className: "notes-macro-group" }, [
        createEl("div", { className: "notes-macro-header" }, [
          createEl("span", { className: "notes-macro-icon" }, grp.icon || "🏫"),
          createEl("h3", { className: "notes-macro-title" }, grp.title),
          createEl("span", { className: "badge notes-macro-count" }, String(grp.count || 0)),
        ]),
        createEl("div", { className: "notes-macro-subgroups" },
          grp.subgroups.map((sub) => renderSubgroup(sub, onRefresh))
        ),
      ]);
    }
    return renderSubgroup(grp, onRefresh);
  });
}

