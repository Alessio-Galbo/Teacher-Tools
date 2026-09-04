import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

function makeField(labelKey, input) {
  const grp = createEl("div", { className: "form-group" });
  grp.appendChild(createEl("label", { className: "form-label", i18n: labelKey }, t(labelKey)));
  grp.appendChild(input);
  return grp;
}

export function createGradeModalFields(assessment, classes) {
  const grid = createEl("div", { className: "grades-modal-grid" });

  const titleInp = createEl("input", { type: "text", className: "input-text", placeholder: t("grades_field_title"), value: assessment?.title || "" });
  const subjInp = createEl("input", { type: "text", className: "input-text", placeholder: t("grades_field_subject"), value: assessment?.subject || "" });
  const dateInp = createEl("input", { type: "date", className: "input-text", value: assessment?.date || new Date().toISOString().split("T")[0] });
  const weightInp = createEl("input", { type: "number", step: "0.1", min: "0.1", max: "3.0", className: "input-text", value: assessment?.weight || 1.0 });

  const classSel = createEl("select", { className: "select-input" });
  classes.forEach((c) => {
    const opt = createEl("option", { value: c.id }, c.name);
    if (assessment?.classId === c.id) opt.selected = true;
    classSel.appendChild(opt);
  });

  const typeSel = createEl("select", { className: "select-input" });
  ["written", "oral", "practical", "simplified"].forEach((k) => {
    const opt = createEl("option", { value: k, i18n: `grades_type_${k}` }, t(`grades_type_${k}`));
    if (assessment?.type === k) opt.selected = true;
    typeSel.appendChild(opt);
  });

  grid.appendChild(makeField("grades_field_title", titleInp));
  grid.appendChild(makeField("grades_field_subject", subjInp));
  grid.appendChild(makeField("grades_field_date", dateInp));
  grid.appendChild(makeField("grades_field_weight", weightInp));
  grid.appendChild(makeField("grades_field_class", classSel));
  grid.appendChild(makeField("grades_field_type", typeSel));

  return { grid, titleInp, subjInp, dateInp, weightInp, classSel, typeSel };
}
