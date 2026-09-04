import { createEl, clearEl } from "../../utils/dom.js";
import { getNotes } from "./notesModel.js";
import { showNoteModal } from "./noteModal.js";
import { getActiveStudentId, getStudents } from "../../services/studentService.js";
import { getClasses, getSchools, getSchoolConfig } from "../../services/schoolService.js";
import { createSearchBar } from "./notesSearchBar.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";
import { createTagFilterBar } from "./notesTagFilter.js";
import { createYearFilterBar } from "./notesYearFilter.js";
import { resolveTargetScope } from "./notesHierarchy.js";
import { groupNotesByScope } from "./notesGrouper.js";
import { renderNotesGroups } from "./notesGroupRenderer.js";

let searchKeyword = "";
let selectedTag = null;
let yearMode = "current";
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

  const searchBar = createSearchBar((kw) => {
    searchKeyword = kw.trim().toLowerCase();
    if (refreshListFn) refreshListFn();
  });

  const toolbar = createEl("div", { className: "notes-toolbar" }, [addNoteBtn, searchBar]);
  const filterRow = createEl("div", { className: "notes-filter-row" });
  const listContainer = createEl("div", { id: "notes-list" });

  async function buildNotes() {
    const config = await getSchoolConfig();
    const activeYear = config.activeYear;
    const activeId = getActiveStudentId();
    const [schools, classes, students, allNotes] = await Promise.all([
      getSchools(),
      getClasses(),
      getStudents(),
      getNotes(null, "", yearMode === "current" ? activeYear : null),
    ]);

    const scope = resolveTargetScope(activeId, { schools, classes, students });
    const scopedNotes = allNotes.filter(scope.filter);

    clearEl(filterRow);
    filterRow.appendChild(createYearFilterBar(activeYear, yearMode, (mode) => {
      yearMode = mode;
      if (refreshListFn) refreshListFn();
    }));
    filterRow.appendChild(createTagFilterBar(scopedNotes, selectedTag, (tag) => {
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
    return renderNotesGroups(groups, onRefresh);
  }

  refreshListFn = createDebouncedRenderer(listContainer, buildNotes);
  container.append(header, toolbar, filterRow, listContainer);
  refreshListFn();
}

window.addEventListener("activeStudentChanged", () => { if (refreshListFn) refreshListFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshListFn) refreshListFn(); });
