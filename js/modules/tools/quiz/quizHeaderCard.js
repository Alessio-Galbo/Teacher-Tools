import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { showQuizSavedModal } from "./quizSavedModal.js";
import { saveQuiz } from "./quizModel.js";
import { createMaxScoreBox } from "./quizMaxScoreBox.js";

function makeField(labelKey, input) {
  const grp = createEl("div", { className: "form-group" });
  grp.appendChild(createEl("label", { className: "form-label", i18n: labelKey }, t(labelKey)));
  grp.appendChild(input);
  return grp;
}

export function createQuizHeaderCard(state, academicYear, onLoad, onReset, onPointsChange) {
  const metaCard = createEl("div", { className: "card quiz-meta-card" });
  const head = createEl("div", { className: "card-header" });
  head.appendChild(createEl("h3", { className: "card-title", i18n: "quiz_card_header_title" }, t("quiz_card_header_title")));
  metaCard.appendChild(head);

  const headActions = createEl("div", { className: "quiz-head-actions-row" });
  if (onReset) {
    const newBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_btn_new_short" }, t("quiz_btn_new_short"));
    newBtn.addEventListener("click", onReset);
    headActions.appendChild(newBtn);
  }
  const savedBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_btn_saved_short" }, t("quiz_btn_saved_short"));
  savedBtn.addEventListener("click", () => showQuizSavedModal(academicYear, onLoad));
  headActions.appendChild(savedBtn);

  const saveBtn = createEl("button", { className: "btn btn-primary btn-sm" }, state.id ? t("quiz_btn_update") : t("quiz_btn_save_short"));
  saveBtn.addEventListener("click", async () => {
    const saved = await saveQuiz({
      id: state.id, title: state.title, topic: state.topic, subject: state.subject,
      maxScore: state.maxScore, autoCalcPoints: state.autoCalcPoints, defaultPoints: state.defaultPoints,
      academicYear, variants: state.variants
    });
    state.id = saved.id;
    showToast("quiz_btn_saved");
    renderStatus();
  });
  headActions.appendChild(saveBtn);
  metaCard.appendChild(headActions);

  const statusBox = createEl("div", { className: "quiz-status-banner" });
  metaCard.appendChild(statusBox);

  const renderStatus = () => {
    clearEl(statusBox);
    statusBox.className = `quiz-status-banner ${state.id ? "active-saved" : ""}`;
    statusBox.textContent = state.id ? `✏️ ${t("quiz_status_editing")} "${state.title || state.topic || 'Verifica'}"` : `📝 ${t("quiz_status_new")}`;
    saveBtn.textContent = state.id ? t("quiz_btn_update") : t("quiz_btn_save_short");
  };

  const grid = createEl("div", { className: "quiz-meta-grid" });
  const titleInp = createEl("input", { type: "text", className: "input-text", placeholder: t("quiz_title_placeholder"), value: state.title || "" });
  titleInp.addEventListener("input", (e) => { state.title = e.target.value; renderStatus(); });
  const subjInp = createEl("input", { type: "text", className: "input-text", placeholder: t("quiz_subject_placeholder"), value: state.subject || "" });
  subjInp.addEventListener("input", (e) => { state.subject = e.target.value; });
  const topicInp = createEl("input", { type: "text", className: "input-text", placeholder: t("quiz_topic_placeholder"), value: state.topic || "" });
  topicInp.addEventListener("input", (e) => { state.topic = e.target.value; renderStatus(); });

  const { box: scoreBox, maxScoreInp, syncAutoState, recalcAutoScore } = createMaxScoreBox(state, onPointsChange);

  const subRow = createEl("div", { className: "quiz-meta-subrow" });
  subRow.appendChild(makeField("quiz_subject_label", subjInp));
  subRow.appendChild(makeField("quiz_topic_label", topicInp));

  grid.appendChild(makeField("quiz_title_label", titleInp));
  grid.appendChild(subRow);
  grid.appendChild(makeField("quiz_max_score_label", scoreBox));
  metaCard.appendChild(grid);

  const syncInputs = () => {
    titleInp.value = state.title || "";
    subjInp.value = state.subject || "";
    topicInp.value = state.topic || "";
    if (maxScoreInp) {
      maxScoreInp.value = state.maxScore;
      maxScoreInp.disabled = Boolean(state.autoCalcPoints);
    }
    if (syncAutoState) syncAutoState();
    renderStatus();
  };

  renderStatus();
  return { metaCard, recalcAutoScore, syncInputs };
}
