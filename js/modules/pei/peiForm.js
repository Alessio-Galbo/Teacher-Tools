import { createEl } from "../../utils/dom.js";

export function createSelectGroup(labelKey, items, selectedId, onChange) {
  return createEl("div", { className: "form-group" }, [
    createEl("label", { className: "form-label", i18n: labelKey }),
    createEl("select", {
      className: "select-input",
      onChange: (e) => onChange(e.target.value),
    }, items.map((it, idx) => {
      const opt = createEl("option", { value: it.id }, `${idx + 1}. ${it.text}`);
      if (it.id === selectedId) opt.selected = true;
      return opt;
    })),
  ]);
}
