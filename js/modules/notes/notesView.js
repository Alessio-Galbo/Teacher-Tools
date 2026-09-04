import { createEl, clearEl } from "../../utils/dom.js";
import { getNotes } from "./notesModel.js";
import { createNoteItem } from "./noteItem.js";
import { showNoteModal } from "./noteModal.js";
import { getActiveStudentId, getStudents } from "../../services/studentService.js";
import { getClasses, getSchools } from "../../services/schoolService.js";
import { createSearchBar } from "./notesSearchBar.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";
import { createTagFilterBar } from "./notesTagFilter.js";
import { resolveTargetScope } from "./notesHierarchy.js";
import { groupNotesByScope } from "./notesGrouper.js";

let searchKeyword = "";
let selectedTag = null;
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
    searchKeyword = keyword.trim().toLowerCase();
    if (refreshListFn) refreshListFn();
  });

  const toolbar = createEl("div", { className: "notes-toolbar" }, [addNoteBtn, searchBar]);
  const tagFilterWrapper = createEl("div", { className: "notes-tag-filter-wrapper" });
  const listContainer = createEl("div", { id: "notes-list" });

  async function buildNotes() {
    const activeId = getActiveStudentId();
    const [schools, classes, students, allNotes] = await Promise.all([getSchools(), getClasses(), getStudents(), getNotes()]);
    const scope = resolveTargetScope(activeId, { schools, classes, students });
    const scopedNotes = allNotes.filter(scope.filter);

    clearEl(tagFilterWrapper);
    tagFilterWrapper.appendChild(createTagFilterBar(scopedNotes, selectedTag, (tag) => {
      selectedTag = tag;
      if (refreshListFn) refreshListFn();
    }));

    let filtered = scopedNotes;
    if (selectedTag) filtered = filtered.filter((n) => n.tags && n.tags.includes(selectedTag));
    if (searchKeyword) {
      filtered = filtered.filter((n) =>
        (n.content && n.content.toLowerCase().includes(searchKeyword)) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(searchKeyword)))
      );
    }

    if (filtered.length === 0) return createEl("p", { className: "app-subtitle", i18n: "notes_empty" });

    const groups = groupNotesByScope(filtered, scope, { schools, classes, students });
    const onRefresh = () => { if (refreshListFn) refreshListFn(); };

    return groups.map((grp) =>
      createEl("div", { className: "notes-group" }, [
        createEl("div", { className: "notes-group-header" }, [
          createEl("span", { className: "notes-group-icon" }, grp.icon),
          createEl("h3", { className: "notes-group-title" }, grp.title),
          createEl("span", { className: "badge notes-group-count" }, String(grp.notes.length)),
        ]),
        createEl("div", { className: "notes-group-list" },
          grp.notes.map((n) => createNoteItem(n, onRefresh, (noteToEdit) => showNoteModal({ note: noteToEdit, onSaved: onRefresh })))
        ),
      ])
    );
  }

  refreshListFn = createDebouncedRenderer(listContainer, buildNotes);

  container.appendChild(header);
  container.appendChild(toolbar);
  container.appendChild(tagFilterWrapper);
  container.appendChild(listContainer);
  refreshListFn();
}

window.addEventListener("activeStudentChanged", () => { if (refreshListFn) refreshListFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshListFn) refreshListFn(); });
