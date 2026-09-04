import { createEl, clearEl } from "../../../utils/dom.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { randomizeQuestions } from "./quizRandomizer.js";
import { createVariantsBar } from "./quizVariantsBar.js";
import { createQuizHeaderCard } from "./quizHeaderCard.js";
import { createQuizToolbar } from "./quizToolbar.js";
import { renderQuestionsList } from "./quizQuestionsList.js";

export async function renderQuizView(container) {
  clearEl(container);
  const cfg = await getSchoolConfig();
  const state = {
    id: null, title: "", topic: "", subject: "", maxScore: 10, autoCalcPoints: false,
    defaultPoints: { multiple_choice: 1, true_false: 0.5, cloze: 1, open: 2 },
    variants: [{ id: "var_a", name: "Variante A", questions: [] }],
    activeVariantIndex: 0
  };

  const headerCard = createQuizHeaderCard(
    state, cfg.activeYear,
    (q) => loadQuiz(q),
    () => resetQuiz(),
    () => renderList()
  );
  container.appendChild(headerCard.metaCard);

  const variantsMount = createEl("div");
  container.appendChild(variantsMount);

  const toolbarCard = createQuizToolbar(state, (q) => {
    state.variants[state.activeVariantIndex].questions.push(q);
    renderList();
    headerCard.recalcAutoScore();
  });
  container.appendChild(toolbarCard);

  const listContainer = createEl("div", { className: "quiz-list-container" });
  container.appendChild(listContainer);

  const renderVariants = () => {
    clearEl(variantsMount);
    variantsMount.appendChild(createVariantsBar(state, () => {
      renderVariants(); renderList(); headerCard.recalcAutoScore();
    }, () => {
      const cur = state.variants[state.activeVariantIndex];
      cur.questions = randomizeQuestions(cur.questions, true);
      renderList();
    }));
  };

  const renderList = () => renderQuestionsList(listContainer, state, () => {
    renderList(); headerCard.recalcAutoScore();
  }, () => headerCard.recalcAutoScore());

  const syncHeaderInputs = () => {
    if (headerCard.titleInp) headerCard.titleInp.value = state.title;
    if (headerCard.topicInp) headerCard.topicInp.value = state.topic;
    if (headerCard.subjInp) headerCard.subjInp.value = state.subject;
    if (headerCard.maxScoreInp) {
      headerCard.maxScoreInp.value = state.maxScore;
      headerCard.maxScoreInp.disabled = state.autoCalcPoints;
    }
    if (headerCard.autoCheck) headerCard.autoCheck.checked = state.autoCalcPoints;
    headerCard.renderStatus();
  };

  const loadQuiz = (q) => {
    state.id = q.id; state.title = q.title || ""; state.topic = q.topic || "";
    state.subject = q.subject || ""; state.maxScore = q.maxScore || 10;
    state.autoCalcPoints = q.autoCalcPoints ?? false;
    state.defaultPoints = q.defaultPoints || { multiple_choice: 1, true_false: 0.5, cloze: 1, open: 2 };
    state.variants = q.variants?.length ? q.variants : [{ id: "var_a", name: "Variante A", questions: [] }];
    state.activeVariantIndex = 0;
    syncHeaderInputs(); headerCard.recalcAutoScore(); renderVariants(); renderList();
  };

  const resetQuiz = () => {
    state.id = null; state.title = ""; state.topic = ""; state.subject = ""; state.maxScore = 10;
    state.autoCalcPoints = false;
    state.variants = [{ id: "var_a", name: "Variante A", questions: [] }];
    state.activeVariantIndex = 0;
    syncHeaderInputs(); renderVariants(); renderList();
  };

  renderVariants(); renderList();
}
