import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getNotes } from "./notesModel.js";
import { showSummaryModal } from "./summaryModal.js";
import { getActiveStudentId, getStudents } from "../../services/studentService.js";
import { getSchools, getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { resolveTargetScope } from "./notesHierarchy.js";
import { generateStructuredSummary } from "./notesSummaryGenerator.js";
import { formatSchoolFullName } from "../school/schoolLocationHelper.js";

export function createSearchInput(onSearchChange) {
  return createEl("input", {
    className: "input-text",
    i18nPlaceholder: "notes_search_placeholder",
    onInput: (e) => onSearchChange(e.target.value.trim().toLowerCase()),
  });
}

export function createSummaryButton(getSearchKeyword) {
  return createEl("button", {
    className: "btn btn-secondary btn-sm",
    title: t("notes_btn_summary"),
    onClick: async () => {
      const kw = typeof getSearchKeyword === "function" ? getSearchKeyword() : "";
      const activeId = getActiveStudentId();
      const [config, schools, classes, students, allNotes] = await Promise.all([
        getSchoolConfig(), getSchools(), getClasses(), getStudents(), getNotes(),
      ]);
      const scope = resolveTargetScope(activeId, { schools, classes, students });
      let notes = allNotes.filter(scope.filter);
      if (kw) {
        notes = notes.filter((n) =>
          (n.content && n.content.toLowerCase().includes(kw)) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(kw)))
        );
      }
      const summary = generateStructuredSummary({
        notes, activeId, schools, classes, students, keyword: kw, year: config.activeYear,
      });
      const scopeLabel = scope.entity?.name || (scope.type === "all" ? "Tutti gli Studenti" : "Generale");
      const matchedSchool = scope.type === "school" ? scope.entity : schools[0];
      const schoolName = matchedSchool ? formatSchoolFullName(matchedSchool) : "";
      showSummaryModal({ notes, summaryText: summary, scopeLabel, activeYear: config.activeYear, schoolName });
    },
  }, [
    createEl("span", { className: "btn-icon" }, "📊"),
    createEl("span", { className: "btn-label", i18n: "notes_btn_summary" }),
  ]);
}
