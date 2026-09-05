import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { createSummaryButton } from "./notesSearchBar.js";

export function createNotesHeader({ onToggleViewMode, currentViewMode, getSearchKeyword }) {
  const summaryBtn = createSummaryButton(getSearchKeyword);

  const viewBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only view-mode-toggle-btn",
    title: t("notes_view_toggle"),
    onClick: () => {
      const nextMode = currentViewMode() === "tiles" ? "list" : "tiles";
      onToggleViewMode(nextMode);
      updateViewBtnIcon(viewBtn, nextMode);
    },
  });
  updateViewBtnIcon(viewBtn, currentViewMode());

  const actions = createEl("div", { className: "section-header-actions" }, [viewBtn, summaryBtn]);
  const info = createEl("div", { className: "section-header-info" }, [
    createEl("h2", { className: "section-title", i18n: "notes_title" }),
  ]);

  return createEl("div", { className: "section-header-row" }, [info, actions]);
}

function updateViewBtnIcon(btn, mode) {
  btn.textContent = mode === "tiles" ? "☰" : "⊞";
}
