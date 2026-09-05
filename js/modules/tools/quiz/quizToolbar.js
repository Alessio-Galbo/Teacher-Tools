import { createEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { createQuestion, formatQuizAsText } from "./quizBuilder.js";
import { showQuizPrintModal } from "./quizPrintModal.js";

export function createQuizToolbar(state, onAddQuestion) {
  const card = createEl("div", { className: "card quiz-toolbar-card" });
  const toolbar = createEl("div", { className: "quiz-toolbar" });

  const qGroup = createEl("div", { className: "quiz-toolbar-group" });
  [
    { type: "multiple_choice", label: "quiz_add_mc" }, { type: "true_false", label: "quiz_add_tf" },
    { type: "cloze", label: "quiz_add_cloze" }, { type: "open", label: "quiz_add_open" }
  ].forEach((b) => {
    const btn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: b.label }, t(b.label));
    btn.addEventListener("click", () => onAddQuestion(createQuestion(b.type, state.defaultPoints)));
    qGroup.appendChild(btn);
  });
  toolbar.appendChild(qGroup);

  const actGroup = createEl("div", { className: "quiz-toolbar-group quiz-toolbar-actions" });
  const copyBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_copy_btn" }, t("quiz_copy_btn"));
  copyBtn.addEventListener("click", () => {
    const cur = state.variants[state.activeVariantIndex];
    navigator.clipboard.writeText(formatQuizAsText(state, cur.questions)).then(() => showToast("quiz_copied"));
  });

  const cur = state.variants[state.activeVariantIndex] || state.variants[0];
  const hasMultiple = state.variants.length > 1;

  const printLabel = hasMultiple
    ? `📄 ${t("quiz_print_btn")} (${cur?.name || "A"})`
    : `📄 ${t("quiz_print_btn")}`;
  const printBtn = createEl("button", {
    className: `btn ${hasMultiple ? "btn-secondary" : "btn-primary"} btn-sm`
  }, printLabel);
  printBtn.addEventListener("click", () => {
    showQuizPrintModal(state, cur?.name, cur?.questions, "current");
  });

  actGroup.appendChild(copyBtn);
  actGroup.appendChild(printBtn);

  if (hasMultiple) {
    const printAllBtn = createEl("button", {
      className: "btn btn-primary btn-sm"
    }, `🖨️ ${t("quiz_print_all_btn")} (${state.variants.length})`);
    printAllBtn.addEventListener("click", () => {
      showQuizPrintModal(state, cur?.name, cur?.questions, "all");
    });
    actGroup.appendChild(printAllBtn);
  }
  toolbar.appendChild(actGroup);

  card.appendChild(toolbar);
  return card;
}
