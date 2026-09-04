import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { peiDimensions, getDimensionById } from "./peiData.js";

export function renderDossierDOM(selections = {}, studentName = "") {
  const container = createEl("div", { className: "dossier-paper" });

  const badges = [createEl("span", { className: "badge" }, `Data: ${new Date().toLocaleDateString()}`)];
  if (studentName) {
    badges.unshift(createEl("span", { className: "badge badge-primary" }, `Studente: ${studentName}`));
  }

  const headerBox = createEl("div", { className: "dossier-header-box" }, [
    createEl("div", { className: "dossier-official-title" }, "PIANO EDUCATIVO INDIVIDUALIZZATO (PEI)"),
    createEl("div", { className: "dossier-official-sub" }, "Scuola Secondaria di II Grado • Linee Guida D.I. 182/2020 e D.I. 153/2023"),
    createEl("div", { className: "tags-bar" }, badges),
  ]);
  container.appendChild(headerBox);

  peiDimensions.forEach((dim) => {
    const sel = selections[dim.id] || {};
    const fullDim = getDimensionById(dim.id);
    const level = fullDim.levels.find((l) => l.id === sel.levelId) || fullDim.levels[0];
    const goal = fullDim.goals.find((g) => g.id === sel.goalId) || fullDim.goals[0];
    const strategy = fullDim.strategies.find((s) => s.id === sel.strategyId) || fullDim.strategies[0];

    const card = createEl("div", { className: "dossier-dim-card" }, [
      createEl("div", { className: "dossier-dim-title" }, t(dim.nameKey)),
      createField("Quadro Osservativo e Barriere", level.text),
      createField("Obiettivi Educativo-Didattici", goal.text),
      createField("Strategie, Mediatori e Criteri di Verifica", strategy.text),
    ]);
    container.appendChild(card);
  });

  return container;
}

function createField(label, text) {
  return createEl("div", { className: "dossier-field" }, [
    createEl("div", { className: "dossier-label" }, label),
    createEl("div", { className: "dossier-content" }, text),
  ]);
}
