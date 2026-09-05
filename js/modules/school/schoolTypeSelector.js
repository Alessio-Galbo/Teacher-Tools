import { createEl } from "../../utils/dom.js";

export const TYPE_MAX = { secondaria_2: 5, secondaria_1: 3, primaria: 5, infanzia: 3 };

export function createSchoolTypeControls(curType = "secondaria_2", curMax = 5) {
  const maxGradeInput = createEl("input", {
    className: "input-text", type: "number", min: "1", max: "15",
    value: curMax, disabled: curType !== "custom",
  });

  const typeSelect = createEl("select", {
    className: "select-input",
    onChange: () => {
      const v = typeSelect.value;
      if (TYPE_MAX[v]) { maxGradeInput.value = TYPE_MAX[v]; maxGradeInput.disabled = true; }
      else { maxGradeInput.disabled = false; }
    },
  }, [
    createEl("option", { value: "secondaria_2", selected: curType === "secondaria_2", i18n: "school_type_sec2" }),
    createEl("option", { value: "secondaria_1", selected: curType === "secondaria_1", i18n: "school_type_sec1" }),
    createEl("option", { value: "primaria", selected: curType === "primaria", i18n: "school_type_prim" }),
    createEl("option", { value: "infanzia", selected: curType === "infanzia", i18n: "school_type_inf" }),
    createEl("option", { value: "custom", selected: curType === "custom", i18n: "school_type_custom" }),
  ]);

  return { typeSelect, maxGradeInput };
}
