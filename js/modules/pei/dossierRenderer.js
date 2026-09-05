import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { peiDimensions, getDimensionById } from "./peiData.js";

const TYPE_MAP = {
  secondaria_2: "pei_school_type_sec2",
  secondaria_1: "pei_school_type_sec1",
  primaria: "pei_school_type_prim",
  infanzia: "pei_school_type_inf",
  custom: "pei_school_type_custom",
};

export function renderDossierDOM(data = {}, legacyStudent = "", legacyDims = {}) {
  const isObj = data && typeof data === "object" && !Array.isArray(data) && ("selections" in data || "schoolType" in data);
  const selections = isObj ? (data.selections || {}) : data;
  const studentName = isObj ? (data.studentName || "") : legacyStudent;
  const effectiveDims = isObj ? (data.effectiveDims || {}) : legacyDims;
  const schoolName = isObj ? (data.schoolName || "") : "";
  const schoolType = isObj ? (data.schoolType || "secondaria_2") : "secondaria_2";
  const activeYear = isObj ? (data.activeYear || "") : "";

  const container = createEl("div", { className: "dossier-paper" });
  const schoolTypeLabel = t(TYPE_MAP[schoolType] || "pei_school_type_sec2");

  const metaGrid = createEl("div", { className: "dossier-meta-grid" }, [
    createMetaItem("pei_dossier_lbl_school", schoolName || "—"),
    createMetaItem("pei_dossier_lbl_year", activeYear || "—"),
    createMetaItem("pei_dossier_lbl_student", studentName || "—"),
    createMetaItem("pei_dossier_lbl_date", new Date().toLocaleDateString()),
  ]);

  const headerBox = createEl("div", { className: "dossier-header-box" }, [
    createEl("div", { className: "dossier-republic-heading", i18n: "pei_dossier_republic" }),
    createEl("div", { className: "dossier-official-title", i18n: "pei_dossier_title" }),
    createEl("div", { className: "dossier-official-sub" }, `${schoolTypeLabel} • ${t("pei_dossier_guidelines")}`),
    metaGrid,
  ]);
  container.appendChild(headerBox);

  peiDimensions.forEach((dim) => {
    const sel = selections[dim.id] || {};
    const fullDim = effectiveDims[dim.id] || getDimensionById(dim.id);
    const level = fullDim.levels.find((l) => l.id === sel.levelId) || fullDim.levels[0];
    const goal = fullDim.goals.find((g) => g.id === sel.goalId) || fullDim.goals[0];
    const strategy = fullDim.strategies.find((s) => s.id === sel.strategyId) || fullDim.strategies[0];

    const card = createEl("div", { className: "dossier-dim-card" }, [
      createEl("div", { className: "dossier-dim-title" }, t(dim.nameKey)),
      createField("pei_dim_quadro", level.text),
      createField("pei_dim_obiettivi", goal.text),
      createField("pei_dim_strategie", strategy.text),
    ]);
    container.appendChild(card);
  });

  return container;
}

function createMetaItem(labelKey, valText) {
  return createEl("div", { className: "dossier-meta-item" }, [
    createEl("span", { className: "dossier-meta-lbl", i18n: labelKey }),
    createEl("span", { className: "dossier-meta-val" }, valText),
  ]);
}

function createField(labelKey, text) {
  return createEl("div", { className: "dossier-field" }, [
    createEl("div", { className: "dossier-label", i18n: labelKey }),
    createEl("div", { className: "dossier-content" }, text),
  ]);
}
