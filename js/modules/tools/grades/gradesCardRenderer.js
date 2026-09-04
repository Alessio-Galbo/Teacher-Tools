import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { computeAssessmentAverage } from "./gradeCalculator.js";

export function renderAssessmentCard(assessment, classMap, onEdit, onDelete) {
  const card = createEl("div", { className: "card grade-card" });
  const head = createEl("div", { className: "grade-card-header" });
  const titleGroup = createEl("div", { className: "grade-card-titles" });
  titleGroup.appendChild(createEl("h4", { className: "grade-card-title" }, assessment.title));
  const sub = createEl("span", { className: "text-muted grade-card-sub" }, `${assessment.subject || "-"} • ${assessment.date}`);
  titleGroup.appendChild(sub);
  head.appendChild(titleGroup);

  const actions = createEl("div", { className: "grade-card-actions" });
  const editBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "notes_btn_edit" }, t("notes_btn_edit"));
  editBtn.addEventListener("click", () => onEdit(assessment));
  const delBtn = createEl("button", { className: "btn btn-danger btn-sm" }, "🗑️");
  delBtn.addEventListener("click", () => onDelete(assessment));
  actions.appendChild(editBtn);
  actions.appendChild(delBtn);
  head.appendChild(actions);
  card.appendChild(head);

  const meta = createEl("div", { className: "grade-card-meta" });
  const className = classMap[assessment.classId] || assessment.classId || "-";
  meta.appendChild(createEl("span", { className: "badge badge-primary" }, className));
  meta.appendChild(createEl("span", { className: "badge", i18n: `grades_type_${assessment.type}` }, t(`grades_type_${assessment.type}`)));
  meta.appendChild(createEl("span", { className: "badge badge-info" }, `Peso: ${assessment.weight}x`));

  const avg = computeAssessmentAverage(assessment.grades);
  const avgText = avg !== null ? `${avg}` : "-";
  const avgBadge = createEl("span", { className: `badge ${avg !== null && avg >= 6 ? "badge-success" : "badge-warning"}` }, `${t("grades_class_average")} ${avgText}`);
  meta.appendChild(avgBadge);
  card.appendChild(meta);

  return card;
}
