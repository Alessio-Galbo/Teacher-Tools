import { createEl, clearEl } from "../../utils/dom.js";
import { getNotes } from "./notesModel.js";
import { createNoteItem } from "./noteItem.js";
import { showNoteModal } from "./noteModal.js";
import { getActiveStudent, getActiveStudentId } from "../../services/studentService.js";
import { createSearchBar } from "./notesSearchBar.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";

let searchKeyword = "";
let refreshListFn = null;

export function renderNotesView(container) {
  clearEl(container);
  const header = createEl("div", { className: "section-header" }, [
    createEl("h2", { className: "section-title", i18n: "notes_title" }),
  ]);

  const addNoteBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "notes_btn_new_note",
    onClick: () => showNoteModal({ onSaved: () => { if (refreshListFn) refreshListFn(); } }),
  });

  const searchBar = createSearchBar((keyword) => {
    searchKeyword = keyword;
    if (refreshListFn) refreshListFn();
  });

  const toolbar = createEl("div", { className: "notes-toolbar" }, [addNoteBtn, searchBar]);
  const listContainer = createEl("div", { id: "notes-list" });

  async function buildNotes() {
    const activeId = getActiveStudentId();
    const isClass = activeId && activeId.startsWith("class_");
    const activeSt = isClass ? null : await getActiveStudent();
    const filterStudent = activeId === "__ALL__" ? "" : (isClass ? `Classe ${activeId.replace("class_", "")}` : (activeSt ? activeSt.name : ""));

    const notes = await getNotes(null, searchKeyword || filterStudent);
    if (notes.length === 0) {
      return createEl("p", { className: "app-subtitle", i18n: "notes_empty" });
    }
    return notes.map((note) => createNoteItem(note, () => { if (refreshListFn) refreshListFn(); }));
  }

  refreshListFn = createDebouncedRenderer(listContainer, buildNotes);

  container.appendChild(header);
  container.appendChild(toolbar);
  container.appendChild(listContainer);

  refreshListFn();
}

window.addEventListener("activeStudentChanged", () => { if (refreshListFn) refreshListFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshListFn) refreshListFn(); });
