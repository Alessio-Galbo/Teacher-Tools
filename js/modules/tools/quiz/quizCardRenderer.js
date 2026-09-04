import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { renderMultipleChoiceOptions } from "./quizOptionsRenderer.js";

const TYPE_LABELS = {
  multiple_choice: "quiz_add_mc", true_false: "quiz_add_tf",
  cloze: "quiz_add_cloze", open: "quiz_add_open"
};

export function renderQuestionEditor(q, idx, total, onPointsChange, onDelete, onMoveUp, onMoveDown) {
  const card = createEl("div", { className: "card quiz-question-card" });
  const head = createEl("div", { className: "quiz-card-head" });
  const labelKey = TYPE_LABELS[q.type] || "quiz_question_prompt";
  const titleGroup = createEl("div", { className: "quiz-card-title-group" });
  titleGroup.appendChild(createEl("strong", {}, `#${idx + 1}`));
  titleGroup.appendChild(createEl("span", { className: "badge badge-primary", i18n: labelKey }, t(labelKey)));

  const ptsWrap = createEl("label", { className: "quiz-card-points-wrap" });
  ptsWrap.appendChild(createEl("span", { className: "quiz-points-label", i18n: "quiz_points_label" }, t("quiz_points_label")));
  const ptsInp = createEl("input", {
    type: "number", className: "input-text quiz-pts-input",
    step: "0.25", min: "0.25", value: q.points ?? 1
  });
  ptsInp.addEventListener("input", (e) => {
    q.points = parseFloat(e.target.value) || 1;
    if (onPointsChange) onPointsChange();
  });
  ptsWrap.appendChild(ptsInp);
  titleGroup.appendChild(ptsWrap);
  head.appendChild(titleGroup);

  const actions = createEl("div", { className: "quiz-card-actions" });
  const upBtn = createEl("button", { className: "btn btn-secondary btn-sm", disabled: idx === 0, title: t("quiz_move_up") }, "⬆️");
  upBtn.addEventListener("click", () => onMoveUp(idx));
  const downBtn = createEl("button", { className: "btn btn-secondary btn-sm", disabled: idx === total - 1, title: t("quiz_move_down") }, "⬇️");
  downBtn.addEventListener("click", () => onMoveDown(idx));
  const delBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, "🗑️");
  delBtn.addEventListener("click", () => onDelete(q.id));
  actions.appendChild(upBtn); actions.appendChild(downBtn); actions.appendChild(delBtn);
  head.appendChild(actions);
  card.appendChild(head);

  const promptInp = createEl("textarea", {
    className: "textarea-input quiz-prompt-input", placeholder: t("quiz_question_prompt"),
    rows: "2", value: q.prompt
  });
  promptInp.addEventListener("input", (e) => { q.prompt = e.target.value; });
  card.appendChild(promptInp);

  if (q.type === "cloze") {
    const clozeBar = createEl("div", { className: "quiz-cloze-helper-bar" });
    const insertBtn = createEl("button", {
      type: "button", className: "btn btn-secondary btn-sm", i18n: "quiz_cloze_insert_blank"
    }, t("quiz_cloze_insert_blank"));
    insertBtn.addEventListener("click", () => {
      const pos = promptInp.selectionStart ?? promptInp.value.length;
      promptInp.value = promptInp.value.slice(0, pos) + "[......]" + promptInp.value.slice(pos);
      promptInp.focus();
      promptInp.setSelectionRange(pos + 8, pos + 8);
      q.prompt = promptInp.value;
    });
    clozeBar.appendChild(insertBtn);
    clozeBar.appendChild(createEl("span", { className: "quiz-cloze-hint", i18n: "quiz_cloze_hint" }, t("quiz_cloze_hint")));
    card.appendChild(clozeBar);
  }

  if (q.type === "multiple_choice") {
    card.appendChild(renderMultipleChoiceOptions(q));
  }
  return card;
}
