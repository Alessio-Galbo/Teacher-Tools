import { createEl } from "../../../utils/dom.js";
import { renderPrintHeader } from "./quizPrintHeaderRenderer.js";

function renderQuestionItem(q, idx, showPts) {
  const qItem = createEl("div", { className: `quiz-print-item quiz-item-${q.type}` });
  const promptLine = createEl("div", { className: "quiz-print-prompt" });
  promptLine.appendChild(createEl("strong", { className: "quiz-print-num" }, `${idx + 1}. `));
  if (showPts) {
    promptLine.appendChild(createEl("span", { className: "quiz-print-pts-tag" }, `[ ${q.points || 1} pt ] `));
  }

  if (q.type === "cloze") {
    let p = q.prompt || "";
    if (p.includes("[")) {
      promptLine.innerHTML += p.replace(/\[.*?\]/g, `<span class="quiz-cloze-blank">........................</span>`);
    } else {
      promptLine.appendChild(document.createTextNode(p));
      promptLine.innerHTML += ` <span class="quiz-cloze-blank">........................</span>`;
    }
  } else {
    promptLine.appendChild(document.createTextNode(q.prompt || ""));
  }
  qItem.appendChild(promptLine);

  if (q.type === "multiple_choice") {
    const letters = ["A", "B", "C", "D"];
    const grid = createEl("div", { className: "quiz-print-grid" });
    (q.options || []).forEach((opt, oIdx) => {
      grid.appendChild(createEl("div", { className: "quiz-print-choice" }, `[  ] ${letters[oIdx]}) ${opt || "..."}`));
    });
    qItem.appendChild(grid);
  } else if (q.type === "true_false") {
    qItem.appendChild(createEl("div", { className: "quiz-print-tf" }, `[   ] VERO           [   ] FALSO`));
  } else if (q.type === "open") {
    const openBox = createEl("div", { className: "quiz-print-open-ruled" });
    for (let i = 0; i < (q.lines || 3); i++) {
      openBox.appendChild(createEl("div", { className: "quiz-print-rule-line" }));
    }
    qItem.appendChild(openBox);
  }
  return qItem;
}

export function renderPrintSheet(meta, variantName, questions, pref = {}, hasPageBreak = false) {
  const paper = createEl("div", {
    className: `quiz-print-sheet ${hasPageBreak ? "quiz-page-break" : ""}`.trim()
  });
  const totalPts = questions.reduce((sum, q) => sum + (parseFloat(q.points) || 1), 0);

  paper.appendChild(renderPrintHeader(meta, variantName, pref, totalPts));

  const layout = pref.questionsLayout || "1col";
  const qList = createEl("div", { className: `quiz-print-questions layout-${layout}` });
  questions.forEach((q, idx) => {
    qList.appendChild(renderQuestionItem(q, idx, pref.fields?.pointsTag !== false));
  });
  paper.appendChild(qList);
  return paper;
}
