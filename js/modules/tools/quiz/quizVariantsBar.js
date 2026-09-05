import { createEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { createVariant } from "./quizRandomizer.js";
import { createMinimalVariantBar } from "./quizVariantMinimalBar.js";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function createVariantsBar(state, onVariantChange, onRandomize) {
  if (state.variants.length <= 1) {
    return createMinimalVariantBar(state, onVariantChange, onRandomize);
  }

  const container = createEl("div", { className: "card quiz-variant-bar" });
  const tabs = createEl("div", { className: "quiz-variant-tabs" });

  state.variants.forEach((v, idx) => {
    const isAct = idx === state.activeVariantIndex;
    const letter = LETTERS[idx] || `V${idx + 1}`;
    const btn = createEl("button", {
      className: `btn btn-sm quiz-variant-pill ${isAct ? "btn-primary" : "btn-secondary"}`
    }, letter);
    btn.addEventListener("click", () => {
      state.activeVariantIndex = idx;
      onVariantChange();
    });
    tabs.appendChild(btn);
  });

  const addBtn = createEl("button", {
    className: "btn btn-secondary btn-sm quiz-variant-action-btn",
    title: t("quiz_variant_add")
  }, "+");
  addBtn.addEventListener("click", () => {
    const nextLetter = LETTERS[state.variants.length] || `V${state.variants.length + 1}`;
    const baseQuestions = state.variants[0]?.questions || [];
    const newVariant = createVariant(baseQuestions, nextLetter);
    state.variants.push(newVariant);
    state.activeVariantIndex = state.variants.length - 1;
    onVariantChange();
  });
  tabs.appendChild(addBtn);

  const shuffleBtn = createEl("button", {
    className: "btn btn-secondary btn-sm quiz-variant-action-btn",
    title: t("quiz_btn_shuffle")
  }, "🔀");
  shuffleBtn.addEventListener("click", onRandomize);
  tabs.appendChild(shuffleBtn);

  const delBtn = createEl("button", {
    className: "btn btn-danger btn-sm quiz-variant-action-btn",
    title: t("quiz_variant_delete")
  }, "🗑️");
  delBtn.addEventListener("click", () => {
    if (!window.confirm(t("quiz_variant_delete_confirm"))) return;
    state.variants.splice(state.activeVariantIndex, 1);
    state.variants.forEach((v, i) => {
      const lettr = LETTERS[i] || `V${i + 1}`;
      v.letter = lettr;
      v.name = `${t("quiz_variant_single")} ${lettr}`;
    });
    state.activeVariantIndex = Math.max(0, state.activeVariantIndex - 1);
    showToast("quiz_variant_deleted");
    onVariantChange();
  });
  tabs.appendChild(delBtn);

  container.appendChild(tabs);
  return container;
}
