import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { createVariant } from "./quizRandomizer.js";

export function createMinimalVariantBar(state, onVariantChange, onRandomize) {
  const minWrap = createEl("div", { className: "quiz-variant-minimal" });
  const addBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    i18n: "quiz_variant_create_parallel"
  }, t("quiz_variant_create_parallel"));

  addBtn.addEventListener("click", () => {
    const baseQuestions = state.variants[0]?.questions || [];
    const newVariant = createVariant(baseQuestions, "B");
    state.variants.push(newVariant);
    state.activeVariantIndex = 1;
    onVariantChange();
  });

  const shuffleBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    i18n: "quiz_btn_shuffle"
  }, t("quiz_btn_shuffle"));
  shuffleBtn.addEventListener("click", onRandomize);

  minWrap.appendChild(addBtn);
  minWrap.appendChild(shuffleBtn);
  return minWrap;
}
