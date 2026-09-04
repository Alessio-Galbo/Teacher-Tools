import { createEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { createVariant } from "./quizRandomizer.js";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function createVariantsBar(state, onVariantChange, onRandomize) {
  const container = createEl("div", { className: "card quiz-variant-bar" });
  const head = createEl("div", { className: "card-header" });
  head.appendChild(createEl("h4", { className: "card-title" }, t("quiz_variant_label")));
  head.appendChild(createEl("span", { className: "badge badge-primary" }, `${state.variants.length} ${t("quiz_variants_count")}`));
  container.appendChild(head);

  const tabs = createEl("div", { className: "quiz-variant-tabs" });
  state.variants.forEach((v, idx) => {
    const isAct = idx === state.activeVariantIndex;
    const btn = createEl("button", {
      className: `btn btn-sm ${isAct ? "btn-primary" : "btn-secondary"}`
    }, `${v.name}${isAct ? " (In Modifica)" : ""}`);
    btn.addEventListener("click", () => {
      state.activeVariantIndex = idx;
      onVariantChange();
    });
    tabs.appendChild(btn);
  });

  const addBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_variant_add" }, t("quiz_variant_add"));
  addBtn.addEventListener("click", () => {
    const nextLetter = LETTERS[state.variants.length] || `V${state.variants.length + 1}`;
    const baseQuestions = state.variants[0]?.questions || [];
    const newVariant = createVariant(baseQuestions, nextLetter);
    state.variants.push(newVariant);
    state.activeVariantIndex = state.variants.length - 1;
    onVariantChange();
  });
  tabs.appendChild(addBtn);

  const shuffleBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_btn_shuffle" }, t("quiz_btn_shuffle"));
  shuffleBtn.addEventListener("click", onRandomize);
  tabs.appendChild(shuffleBtn);

  if (state.variants.length > 1) {
    const delBtn = createEl("button", {
      className: "btn btn-danger btn-sm",
      i18n: "quiz_variant_delete"
    }, `🗑️ ${t("quiz_variant_delete")}`);
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
  }

  container.appendChild(tabs);
  return container;
}
