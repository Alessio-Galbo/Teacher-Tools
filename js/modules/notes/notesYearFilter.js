import { createEl } from "../../utils/dom.js";

export function createYearFilterBar(activeYear, currentMode, onModeChange) {
  const currentBtn = createEl("button", {
    className: `btn btn-sm ${currentMode === "current" ? "btn-primary" : "btn-secondary"}`,
    onClick: () => onModeChange("current"),
  }, [
    createEl("span", {}, `📅 ${activeYear || ""}`),
  ]);

  const allBtn = createEl("button", {
    className: `btn btn-sm ${currentMode === "all" ? "btn-primary" : "btn-secondary"}`,
    i18n: "notes_filter_all_years",
    onClick: () => onModeChange("all"),
  });

  return createEl("div", { className: "notes-year-filter tags-bar" }, [currentBtn, allBtn]);
}
