import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

const LETTERS = ["A", "B", "C", "D"];

export function renderMultipleChoiceOptions(q, onChange) {
  const optContainer = createEl("div", { className: "quiz-options-grid" });
  (q.options || []).forEach((opt, oIdx) => {
    const row = createEl("div", { className: "quiz-option-row" });
    row.appendChild(createEl("span", { className: "badge quiz-opt-letter" }, LETTERS[oIdx]));
    const optInp = createEl("input", {
      type: "text",
      className: "input-text quiz-opt-input",
      placeholder: `${t("quiz_option")} ${LETTERS[oIdx]}`,
      value: opt
    });
    optInp.addEventListener("input", (e) => {
      q.options[oIdx] = e.target.value;
    });
    row.appendChild(optInp);
    optContainer.appendChild(row);
  });
  return optContainer;
}
