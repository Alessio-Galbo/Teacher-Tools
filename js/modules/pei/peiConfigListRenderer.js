import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { peiDimensions } from "./peiData.js";

export function renderConfigControls({ activeDimId, activeSection, onDimChange, onSectionChange }) {
  const dimTabs = createEl("div", { className: "overview-year-nav" },
    peiDimensions.map((d) => createEl("button", {
      className: `overview-year-btn ${d.id === activeDimId ? "active" : ""}`,
      i18n: d.nameKey,
      onClick: () => onDimChange(d.id),
    }))
  );

  const sectionSelect = createEl("select", {
    className: "select-input",
    onChange: (e) => onSectionChange(e.target.value),
  }, [
    createEl("option", { value: "levels", selected: activeSection === "levels" }, t("pei_level_select")),
    createEl("option", { value: "goals", selected: activeSection === "goals" }, t("pei_goal_select")),
    createEl("option", { value: "strategies", selected: activeSection === "strategies" }, t("pei_strategy_select")),
  ]);

  return [dimTabs, createEl("div", { className: "form-group" }, [sectionSelect])];
}

export function renderChecklistItems({ defaultItems, customItems, hiddenSet, onToggle, onDelete }) {
  const defaultList = defaultItems.map((item) => {
    const isVisible = !hiddenSet.has(item.id);
    const cb = createEl("input", {
      type: "checkbox",
      checked: isVisible,
      onChange: () => onToggle(item.id, isVisible),
    });
    return createEl("label", { className: "student-check-item" }, [cb, createEl("span", {}, item.text)]);
  });

  const customList = customItems.map((item) => {
    const delBtn = createEl("button", {
      className: "note-delete-btn btn-sm",
      onClick: () => onDelete(item.id),
    }, "🗑");
    return createEl("div", { className: "student-check-item" }, [delBtn, createEl("span", {}, item.text)]);
  });

  return { defaultList, customList };
}
