import { createEl, clearEl } from "../../utils/dom.js";
import { getNotes } from "./notesModel.js";
import { showNoteModal } from "./noteModal.js";
import { getActiveStudentId, getStudents } from "../../services/studentService.js";
import { getClasses, getSchools, getSchoolConfig } from "../../services/schoolService.js";
import { createSearchInput } from "./notesSearchBar.js";
import { createNotesHeader } from "./notesHeader.js";
import { createDebouncedRenderer } from "../../utils/renderHelper.js";
import { createTagFilterBar } from "./notesTagFilter.js";
import { createYearButtons } from "./notesYearFilter.js";
import { resolveTargetScope } from "./notesHierarchy.js";
import { groupNotesByScope } from "./notesGrouper.js";
import { renderNotesGroups } from "./notesGroupRenderer.js";

let searchKeyword = "";
let selectedTag = null;
let yearMode = "current";
let refreshListFn = null;
let viewMode = localStorage.getItem("teacher_tools_notes_view_mode") || "tiles";

export function renderNotesView(container) {
  clearEl(container);
  const listContainer = createEl("div", { id: "notes-list" });
  const updateViewClass = () => {
    listContainer.className = viewMode === "tiles" ? "notes-view-tiles" : "notes-view-list";
  };
  updateViewClass();

  const header = createNotesHeader({
    onToggleViewMode: (m) => { viewMode = m; localStorage.setItem("teacher_tools_notes_view_mode", m); updateViewClass(); },
    currentViewMode: () => viewMode,
    getSearchKeyword: () => searchKeyword,
  });

  const addNoteBtn = createEl("button", {
    className: "btn btn-primary btn-sm", i18n: "notes_btn_new_note",
    onClick: () => showNoteModal({ onSaved: () => { if (refreshListFn) refreshListFn(); } }),
  });
  const searchInput = createSearchInput((kw) => { searchKeyword = kw; if (refreshListFn) refreshListFn(); });
  const actionsRow = createEl("div", { className: "notes-actions-row" }, [addNoteBtn]);
  const searchRow = createEl("div", { className: "notes-search-row" }, [searchInput]);
  const toolbar = createEl("div", { className: "notes-toolbar" }, [actionsRow, searchRow]);
  const filterRow = createEl("div", { className: "notes-filter-row" });

  async function buildNotes() {
    const config = await getSchoolConfig();
    const activeId = getActiveStudentId();
    const [schools, classes, students, allNotes] = await Promise.all([
      getSchools(), getClasses(), getStudents(),
      getNotes(null, "", yearMode === "current" ? config.activeYear : null),
    ]);

    const scope = resolveTargetScope(activeId, { schools, classes, students });
    const scopedNotes = allNotes.filter(scope.filter);

    const [currentBtn, allBtn] = createYearButtons(config.activeYear, yearMode, (m) => { yearMode = m; if (refreshListFn) refreshListFn(); });
    actionsRow.replaceChildren(addNoteBtn, currentBtn, allBtn);
    clearEl(filterRow);
    filterRow.appendChild(createTagFilterBar(scopedNotes, selectedTag, (tg) => { selectedTag = tg; if (refreshListFn) refreshListFn(); }));

    let filtered = scopedNotes;
    if (selectedTag) filtered = filtered.filter((n) => n.tags && n.tags.includes(selectedTag));
    if (searchKeyword) {
      filtered = filtered.filter((n) => (n.content && n.content.toLowerCase().includes(searchKeyword)) || (n.tags && n.tags.some((t) => t.toLowerCase().includes(searchKeyword))));
    }

    if (filtered.length === 0) return createEl("p", { className: "app-subtitle", i18n: "notes_empty" });
    const groups = groupNotesByScope(filtered, scope, { schools, classes, students });
    return renderNotesGroups(groups, () => { if (refreshListFn) refreshListFn(); });
  }

  refreshListFn = createDebouncedRenderer(listContainer, buildNotes);
  container.append(header, toolbar, filterRow, listContainer);
  refreshListFn();
}

window.addEventListener("activeStudentChanged", () => { if (refreshListFn) refreshListFn(); });
window.addEventListener("globalYearChanged", () => { if (refreshListFn) refreshListFn(); });
