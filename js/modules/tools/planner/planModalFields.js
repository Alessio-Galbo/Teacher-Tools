import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

function makeField(labelKey, input) {
  const grp = createEl("div", { className: "form-group" });
  grp.appendChild(createEl("label", { className: "form-label", i18n: labelKey }, t(labelKey)));
  grp.appendChild(input);
  return grp;
}

export function createPlanFields(plan, classes) {
  const container = createEl("div", { className: "plan-fields-container" });
  const grid = createEl("div", { className: "quiz-meta-grid" });

  const titleInp = createEl("input", { type: "text", className: "input-text", placeholder: "es. UDA 1: Le Forze e il Moto", value: plan?.title || "" });
  const subjInp = createEl("input", { type: "text", className: "input-text", placeholder: "es. Fisica", value: plan?.subject || "" });
  const periodInp = createEl("input", { type: "text", className: "input-text", placeholder: "es. Ottobre - Novembre", value: plan?.period || "" });

  grid.appendChild(makeField("planner_field_title", titleInp));
  grid.appendChild(makeField("planner_field_subject", subjInp));
  grid.appendChild(makeField("planner_field_period", periodInp));
  container.appendChild(grid);

  const classesGrp = createEl("div", { className: "form-group" });
  classesGrp.appendChild(createEl("label", { className: "form-label", i18n: "planner_field_classes" }, t("planner_field_classes")));
  const classBoxes = createEl("div", { className: "plan-classes-checkboxes" });
  const selectedClassIds = new Set(plan?.classIds || []);
  classes.forEach((c) => {
    const lbl = createEl("label", { className: "plan-class-check-label" });
    const chk = createEl("input", { type: "checkbox", value: c.id });
    if (selectedClassIds.has(c.id)) chk.checked = true;
    lbl.appendChild(chk);
    lbl.appendChild(document.createTextNode(` ${c.name}`));
    classBoxes.appendChild(lbl);
  });
  classesGrp.appendChild(classBoxes);
  container.appendChild(classesGrp);

  const goalsInp = createEl("textarea", { className: "textarea-input", rows: "2", value: plan?.goals || "" });
  const actInp = createEl("textarea", { className: "textarea-input", rows: "2", value: plan?.activities || "" });
  const methInp = createEl("textarea", { className: "textarea-input", rows: "2", value: plan?.methods || "" });
  const assessInp = createEl("textarea", { className: "textarea-input", rows: "2", value: plan?.assessment || "" });

  container.appendChild(makeField("planner_field_goals", goalsInp));
  container.appendChild(makeField("planner_field_activities", actInp));
  container.appendChild(makeField("planner_field_methods", methInp));
  container.appendChild(makeField("planner_field_assessment", assessInp));

  const getSelectedClasses = () => {
    return Array.from(classBoxes.querySelectorAll("input[type=checkbox]:checked")).map((cb) => cb.value);
  };

  return { container, titleInp, subjInp, periodInp, goalsInp, actInp, methInp, assessInp, getSelectedClasses };
}
