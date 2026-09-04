import { createEl } from "../../utils/dom.js";
import { getNotes } from "./notesModel.js";
import { showSummaryModal } from "./summaryModal.js";
import { getActiveStudentId, getStudents } from "../../services/studentService.js";
import { getSchools, getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { resolveTargetScope } from "./notesHierarchy.js";
import { generateStructuredSummary } from "./notesSummaryGenerator.js";

export function createSearchBar(onSearchChange) {
  let searchKeyword = "";
  const searchInput = createEl("input", {
    className: "input-text",
    i18nPlaceholder: "notes_search_placeholder",
    onInput: (e) => {
      searchKeyword = e.target.value.trim().toLowerCase();
      onSearchChange(searchKeyword);
    },
  });

  const summaryBtn = createEl("button", {
    className: "btn btn-secondary",
    i18n: "notes_btn_summary",
    onClick: async () => {
      const activeId = getActiveStudentId();
      const [config, schools, classes, students, allNotes] = await Promise.all([
        getSchoolConfig(), getSchools(), getClasses(), getStudents(), getNotes(),
      ]);
      const scope = resolveTargetScope(activeId, { schools, classes, students });
      let notes = allNotes.filter(scope.filter);
      if (searchKeyword) {
        notes = notes.filter((n) =>
          (n.content && n.content.toLowerCase().includes(searchKeyword)) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(searchKeyword)))
        );
      }
      const summary = generateStructuredSummary({
        notes, activeId, schools, classes, students, keyword: searchKeyword, year: config.activeYear,
      });
      const scopeLabel = scope.entity?.name || (scope.type === "all" ? "Tutti gli Studenti" : "Generale");
      const matchedSchool = scope.type === "school" ? scope.entity : schools[0];
      const schoolName = matchedSchool ? `${matchedSchool.name}${matchedSchool.city ? ` (${matchedSchool.city})` : ""}` : "";
      showSummaryModal({ notes, summaryText: summary, scopeLabel, activeYear: config.activeYear, schoolName });
    },
  });

  return createEl("div", { className: "notes-search-bar" }, [searchInput, summaryBtn]);
}
