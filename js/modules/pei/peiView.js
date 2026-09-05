import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { peiDimensions } from "./peiData.js";
import { assemblePeiText, savePeiDraft } from "./peiModel.js";
import { createSelectGroup } from "./peiForm.js";
import { showDossierModal } from "./dossierModal.js";
import { getEffectiveDimension } from "./peiPhraseService.js";
import { createPeiOutputBox } from "./peiOutputBox.js";

let currentDimId = "dim1";
let currentEffectiveDim = null;
const dimSelections = {};

export function renderPeiView(container) {
  clearEl(container);
  const configBtn = createEl("button", {
    className: "btn btn-secondary pei-config-btn",
    i18n: "pei_btn_config",
    onClick: () => {
      import("./peiConfigModal.js").then((m) => m.showPeiConfigModal(() => updateForm()));
    },
  });

  const header = createEl("div", { className: "section-header section-header-row" }, [
    createEl("div", {}, [
      createEl("h2", { className: "section-title", i18n: "pei_title" }),
      createEl("p", { className: "section-subtitle", i18n: "pei_subtitle" }),
    ]),
    configBtn,
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
  const [outputBox, dossierGroup] = createPeiOutputBox({
    onCopy: copyOutput,
    onDossier: () => showDossierModal(dimSelections),
  });

  container.append(header, dimTabs, formBox, outputBox, dossierGroup);
  updateForm();
}

async function updateForm() {
  const container = document.getElementById("pei-form-container");
  if (!container) return;
  const dim = await getEffectiveDimension(currentDimId);
  currentEffectiveDim = dim;
  clearEl(container);
  const sel = dimSelections[currentDimId] || { levelId: dim.levels[0].id, goalId: dim.goals[0].id, strategyId: dim.strategies[0].id };
  dimSelections[currentDimId] = sel;

  container.append(
    createSelectGroup("pei_level_select", dim.levels, sel.levelId, (v) => { sel.levelId = v; refreshOutput(); }),
    createSelectGroup("pei_goal_select", dim.goals, sel.goalId, (v) => { sel.goalId = v; refreshOutput(); }),
    createSelectGroup("pei_strategy_select", dim.strategies, sel.strategyId, (v) => { sel.strategyId = v; refreshOutput(); })
  );
  refreshOutput();
}

function refreshOutput() {
  const out = document.getElementById("pei-output-text");
  if (!out) return;
  const sel = dimSelections[currentDimId];
  const text = assemblePeiText(currentDimId, sel.levelId, sel.goalId, sel.strategyId, currentEffectiveDim);
  out.textContent = text;
  savePeiDraft(currentDimId, sel.levelId, sel.goalId, sel.strategyId, text);
}

function copyOutput() {
  const out = document.getElementById("pei-output-text");
  if (!out || !out.textContent) return;
  navigator.clipboard.writeText(out.textContent).then(() => showToast(t("pei_btn_copied"), "success"));
}
