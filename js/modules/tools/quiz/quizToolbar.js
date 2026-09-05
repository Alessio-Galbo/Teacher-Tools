import { createEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { createQuestion, formatQuizAsText } from "./quizBuilder.js";
import { showQuizPrintModal } from "./quizPrintModal.js";

export function createQuizToolbar(state, onAddQuestion) {
  const card = createEl("div", { className: "card quiz-toolbar-card" });

  const qTitle = createEl("h4", { className: "quiz-section-title", i18n: "quiz_questions_section_title" }, t("quiz_questions_section_title"));
  card.appendChild(qTitle);

  const qGrid = createEl("div", { className: "quiz-add-grid" });
  [
    { type: "multiple_choice", label: "quiz_add_mc" },
    { type: "true_false", label: "quiz_add_tf" },
    { type: "cloze", label: "quiz_add_cloze" },
    { type: "open", label: "quiz_add_open" }
  ].forEach((b) => {
    const btn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: b.label }, t(b.label));
    btn.addEventListener("click", () => onAddQuestion(createQuestion(b.type, state.defaultPoints)));
    qGrid.appendChild(btn);
  });
  card.appendChild(qGrid);

  const actSection = createEl("div", { className: "quiz-export-section" });
  const actTitle = createEl("h4", { className: "quiz-section-title", i18n: "quiz_actions_section_title" }, t("quiz_actions_section_title"));
  actSection.appendChild(actTitle);

  const actRow = createEl("div", { className: "quiz-export-row" });
  const copyBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_copy_btn" }, t("quiz_copy_btn"));
  copyBtn.addEventListener("click", () => {
    const cur = state.variants[state.activeVariantIndex];
    navigator.clipboard.writeText(formatQuizAsText(state, cur.questions)).then(() => showToast("quiz_copied"));
  });
  actRow.appendChild(copyBtn);

  const cur = state.variants[state.activeVariantIndex] || state.variants[0];
  const hasMultiple = state.variants.length > 1;

  const printLabel = hasMultiple
    ? `📄 ${t("quiz_print_btn")} (${cur?.letter || cur?.name || "A"})`
    : `📄 ${t("quiz_print_btn")}`;
  const printBtn = createEl("button", {
    className: `btn ${hasMultiple ? "btn-secondary" : "btn-primary"} btn-sm`
  }, printLabel);
  printBtn.addEventListener("click", () => {
    showQuizPrintModal(state, cur?.name, cur?.questions, "current");
  });
  actRow.appendChild(printBtn);

  if (hasMultiple) {
    const printAllBtn = createEl("button", {
      className: "btn btn-primary btn-sm"
    }, `🖨️ ${t("quiz_print_all_btn")} (${state.variants.length})`);
    printAllBtn.addEventListener("click", () => {
      showQuizPrintModal(state, cur?.name, cur?.questions, "all");
    });
    actRow.appendChild(printAllBtn);
  }

  actSection.appendChild(actRow);
  card.appendChild(actSection);

  return card;
}
