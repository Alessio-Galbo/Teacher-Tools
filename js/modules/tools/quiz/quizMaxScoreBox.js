import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { showQuizPointsModal } from "./quizPointsModal.js";

export function createMaxScoreBox(state, onPointsChange) {
  const box = createEl("div", { className: "quiz-score-row" });
  const maxScoreInp = createEl("input", {
    type: "number", className: "input-text quiz-max-score-input",
    min: "1", max: "100", value: state.maxScore || 10
  });
  maxScoreInp.disabled = Boolean(state.autoCalcPoints);
  maxScoreInp.addEventListener("input", (e) => { state.maxScore = parseFloat(e.target.value) || 10; });
  box.appendChild(maxScoreInp);

  const dualGroup = createEl("div", { className: "quiz-dual-btn-group" });

  const toggleBtn = createEl("button", {
    type: "button",
    className: `btn btn-sm quiz-dual-toggle-btn ${state.autoCalcPoints ? "btn-primary" : "btn-secondary"}`
  });

  const updateToggleUI = () => {
    const isAuto = Boolean(state.autoCalcPoints);
    toggleBtn.className = `btn btn-sm quiz-dual-toggle-btn ${isAuto ? "btn-primary" : "btn-secondary"}`;
    toggleBtn.textContent = isAuto ? `⚡ ${t("quiz_calc_auto_active")}` : `⚡ ${t("quiz_calc_points_auto")}`;
    maxScoreInp.disabled = isAuto;
  };

  const recalcAutoScore = () => {
    if (state.autoCalcPoints) {
      const curQ = state.variants[state.activeVariantIndex]?.questions || [];
      const sum = curQ.reduce((acc, q) => acc + (parseFloat(q.points) || 1), 0);
      state.maxScore = sum;
      maxScoreInp.value = sum;
    }
  };

  toggleBtn.addEventListener("click", () => {
    state.autoCalcPoints = !state.autoCalcPoints;
    updateToggleUI();
    recalcAutoScore();
  });
  dualGroup.appendChild(toggleBtn);

  const cfgBtn = createEl("button", {
    type: "button", className: "btn btn-secondary btn-sm quiz-dual-cfg-btn",
    title: t("quiz_btn_weights")
  }, "⚖️");
  cfgBtn.addEventListener("click", () => showQuizPointsModal(state, () => {
    recalcAutoScore();
    if (onPointsChange) onPointsChange();
  }));
  dualGroup.appendChild(cfgBtn);

  box.appendChild(dualGroup);

  const syncAutoState = () => {
    updateToggleUI();
    recalcAutoScore();
  };

  updateToggleUI();

  return { box, maxScoreInp, syncAutoState, recalcAutoScore };
}
