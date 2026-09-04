import { createEl, clearEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { renderQuestionEditor } from "./quizCardRenderer.js";

export function renderQuestionsList(container, state, onUpdateList, onPointsChange) {
  clearEl(container);
  const questions = state.variants[state.activeVariantIndex]?.questions || [];
  if (questions.length === 0) {
    const empty = createEl("div", { className: "tools-empty-state" });
    empty.appendChild(createEl("span", { className: "tools-empty-icon" }, "📝"));
    empty.appendChild(createEl("p", { className: "text-muted", i18n: "quiz_no_questions" }, t("quiz_no_questions")));
    container.appendChild(empty);
    return;
  }
  questions.forEach((q, idx) => {
    container.appendChild(renderQuestionEditor(q, idx, questions.length, onPointsChange,
      (qId) => {
        state.variants[state.activeVariantIndex].questions = questions.filter((x) => x.id !== qId);
        onUpdateList();
      },
      (i) => { [questions[i], questions[i - 1]] = [questions[i - 1], questions[i]]; onUpdateList(); },
      (i) => { [questions[i], questions[i + 1]] = [questions[i + 1], questions[i]]; onUpdateList(); }
    ));
  });
}
