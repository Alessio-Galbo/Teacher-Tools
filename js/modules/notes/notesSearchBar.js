import { createEl } from "../../utils/dom.js";
import { generateStudentSummary } from "./notesModel.js";
import { showSummaryModal } from "./summaryModal.js";
import { getActiveStudent } from "../../services/studentService.js";

export function createSearchBar(onSearchChange) {
  let searchKeyword = "";
  const searchInput = createEl("input", {
    className: "input-text",
    i18nPlaceholder: "notes_search_placeholder",
    onInput: (e) => {
      searchKeyword = e.target.value;
      onSearchChange(searchKeyword);
    },
  });

  const summaryBtn = createEl("button", {
    className: "btn btn-secondary",
    i18n: "notes_btn_summary",
    onClick: async () => {
      const activeSt = await getActiveStudent();
      const targetName = searchKeyword || (activeSt ? activeSt.name : "");
      const summary = await generateStudentSummary(targetName);
      showSummaryModal(summary);
    },
  });

  return createEl("div", { className: "notes-search-bar" }, [searchInput, summaryBtn]);
}
