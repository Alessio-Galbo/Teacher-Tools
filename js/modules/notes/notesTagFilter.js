import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function createTagFilterBar(notes, activeTag, onTagSelect) {
  const container = createEl("div", { className: "notes-quick-tags" });
  if (!Array.isArray(notes) || notes.length === 0) return container;

  const uniqueTags = Array.from(new Set(notes.flatMap((n) => n.tags || []))).filter(Boolean).sort();
  if (uniqueTags.length === 0) return container;

  const allChip = createEl("button", {
    className: `quick-tag-chip ${!activeTag ? "active" : ""}`,
    type: "button",
    i18n: "notes_filter_all_tags",
    onClick: () => onTagSelect(null),
  });
  container.appendChild(allChip);

  uniqueTags.forEach((tag) => {
    const isSelected = activeTag === tag;
    const chip = createEl("button", {
      className: `quick-tag-chip ${isSelected ? "active" : ""}`,
      type: "button",
      onClick: () => onTagSelect(isSelected ? null : tag),
    }, tag);
    container.appendChild(chip);
  });

  return container;
}
