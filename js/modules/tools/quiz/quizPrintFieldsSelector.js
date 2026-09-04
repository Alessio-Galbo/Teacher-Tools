import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

const FIELD_DEFS = [
  { key: "school", label: "quiz_field_school" },
  { key: "teacher", label: "quiz_field_teacher" },
  { key: "student", label: "quiz_field_student" },
  { key: "dateClass", label: "quiz_field_date_class" },
  { key: "points", label: "quiz_field_points" },
  { key: "vote", label: "quiz_field_vote" },
  { key: "topic", label: "quiz_field_topic" },
  { key: "instructions", label: "quiz_field_instructions" },
  { key: "pointsTag", label: "quiz_field_points_tag" }
];

export function createQuizPrintFieldsSelector(pref, onPrefChange) {
  const container = createEl("div", { className: "quiz-opt-group quiz-opt-checks" });
  container.appendChild(createEl("label", {
    className: "quiz-opt-label",
    i18n: "quiz_print_fields_label"
  }, t("quiz_print_fields_label")));

  FIELD_DEFS.forEach((f) => {
    const lbl = createEl("label", { className: "quiz-opt-check-label" });
    const isChecked = pref.fields?.[f.key] !== false;
    const chk = createEl("input", { type: "checkbox", checked: isChecked });
    chk.addEventListener("change", (e) => {
      pref.fields[f.key] = e.target.checked;
      onPrefChange();
    });
    lbl.appendChild(chk);
    lbl.appendChild(createEl("span", { i18n: f.label }, t(f.label)));
    container.appendChild(lbl);
  });

  return container;
}
