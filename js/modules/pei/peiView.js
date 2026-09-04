import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { peiDimensions, getDimensionById } from "./peiData.js";
import { assemblePeiText, savePeiDraft } from "./peiModel.js";
import { createSelectGroup } from "./peiForm.js";
import { showDossierModal } from "./dossierModal.js";

let currentDimId = "dim1";
const dimSelections = {};

export function renderPeiView(container) {
  clearEl(container);
  const header = createEl("div", { className: "section-header" }, [
    createEl("h2", { className: "section-title", i18n: "pei_title" }),
    createEl("p", { className: "section-subtitle", i18n: "pei_subtitle" }),
  ]);

  const dimTabs = createEl("div", { className: "pei-dim-tabs" },
    peiDimensions.map((dim) =>
      createEl("button", {
        className: `pei-dim-btn ${dim.id === currentDimId ? "active" : ""}`,
        i18n: dim.nameKey,
        onClick: (e) => {
          currentDimId = dim.id;
          container.querySelectorAll(".pei-dim-btn").forEach((b) => b.classList.remove("active"));
          e.currentTarget.classList.add("active");
          updateForm();
        },
      })
    )
  );

  const formBox = createEl("div", { className: "card", id: "pei-form-container" });
  const outputBox = createEl("div", { className: "pei-output-box" }, [
    createEl("h3", { className: "card-title", i18n: "pei_preview_title" }),
    createEl("div", { className: "pei-output-text", id: "pei-output-text" }),
    createEl("div", { className: "pei-actions" }, [
      createEl("button", { className: "btn btn-primary btn-block", i18n: "pei_btn_copy", onClick: copyOutput }),
    ]),
  ]);

  const dossierBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: "pei_btn_full",
    onClick: () => showDossierModal(dimSelections),
  });

  container.appendChild(header);
  container.appendChild(dimTabs);
  container.appendChild(formBox);
  container.appendChild(outputBox);
  container.appendChild(createEl("div", { className: "form-group" }, [dossierBtn]));
  updateForm();
}

function updateForm() {
  const container = document.getElementById("pei-form-container");
  if (!container) return;
  clearEl(container);
  const dim = getDimensionById(currentDimId);
  const sel = dimSelections[currentDimId] || { levelId: dim.levels[0].id, goalId: dim.goals[0].id, strategyId: dim.strategies[0].id };
  dimSelections[currentDimId] = sel;

  container.appendChild(createSelectGroup("pei_level_select", dim.levels, sel.levelId, (v) => { sel.levelId = v; refreshOutput(); }));
  container.appendChild(createSelectGroup("pei_goal_select", dim.goals, sel.goalId, (v) => { sel.goalId = v; refreshOutput(); }));
  container.appendChild(createSelectGroup("pei_strategy_select", dim.strategies, sel.strategyId, (v) => { sel.strategyId = v; refreshOutput(); }));
  refreshOutput();
}

function refreshOutput() {
  const out = document.getElementById("pei-output-text");
  if (!out) return;
  const sel = dimSelections[currentDimId];
  const text = assemblePeiText(currentDimId, sel.levelId, sel.goalId, sel.strategyId);
  out.textContent = text;
  savePeiDraft(currentDimId, sel.levelId, sel.goalId, sel.strategyId, text);
}

function copyOutput() {
  const out = document.getElementById("pei-output-text");
  if (!out || !out.textContent) return;
  navigator.clipboard.writeText(out.textContent).then(() => showToast(t("pei_btn_copied"), "success"));
}
