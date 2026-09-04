import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { showQuizPointsModal } from "./quizPointsModal.js";

export function createMaxScoreBox(state, onPointsChange) {
  const box = createEl("div", { className: "quiz-max-score-box" });
  const maxScoreInp = createEl("input", {
    type: "number", className: "input-text quiz-max-score-input",
    min: "1", max: "100", value: state.maxScore || 10
  });
  maxScoreInp.disabled = state.autoCalcPoints ?? false;
  maxScoreInp.addEventListener("input", (e) => { state.maxScore = parseFloat(e.target.value) || 10; });
  box.appendChild(maxScoreInp);

  const autoCheckWrap = createEl("label", { className: "quiz-auto-points-label" });
  const autoCheck = createEl("input", { type: "checkbox", checked: state.autoCalcPoints ?? false });
  const recalcAutoScore = () => {
    if (autoCheck.checked) {
      const curQ = state.variants[state.activeVariantIndex]?.questions || [];
      const sum = curQ.reduce((acc, q) => acc + (parseFloat(q.points) || 1), 0);
      state.maxScore = sum;
      maxScoreInp.value = sum;
    }
  };
  autoCheck.addEventListener("change", () => {
    state.autoCalcPoints = autoCheck.checked;
    maxScoreInp.disabled = autoCheck.checked;
    recalcAutoScore();
  });
  autoCheckWrap.appendChild(autoCheck);
  autoCheckWrap.appendChild(createEl("span", { i18n: "quiz_calc_points_auto" }, t("quiz_calc_points_auto")));
  box.appendChild(autoCheckWrap);

  const cfgWeightsBtn = createEl("button", {
    type: "button", className: "btn btn-secondary btn-sm", i18n: "quiz_btn_weights"
  }, t("quiz_btn_weights"));
  cfgWeightsBtn.addEventListener("click", () => showQuizPointsModal(state, () => {
    recalcAutoScore();
    if (onPointsChange) onPointsChange();
  }));
  box.appendChild(cfgWeightsBtn);

  return { box, maxScoreInp, autoCheck, recalcAutoScore };
}
