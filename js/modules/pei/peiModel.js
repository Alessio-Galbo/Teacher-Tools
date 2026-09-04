import { putItem, getAll } from "../../services/db.js";
import { getDimensionById } from "./peiData.js";

export function assemblePeiText(dimId, levelId, goalId, strategyId, customDim = null) {
  const dim = customDim || getDimensionById(dimId);
  const level = dim.levels.find((l) => l.id === levelId) || dim.levels[0];
  const goal = dim.goals.find((g) => g.id === goalId) || dim.goals[0];
  const strategy = dim.strategies.find((s) => s.id === strategyId) || dim.strategies[0];

  return [
    "--- QUADRO OSSERVATIVO E BARRIERE RISCONTRATE ---",
    level.text,
    "",
    "--- OBIETTIVI EDUCATIVO-DIDATTICI FORMULATI ---",
    goal.text,
    "",
    "--- STRATEGIE, STRUMENTI COMPENSATIVI E CRITERI DI VERIFICA ---",
    strategy.text,
  ].join("\n");
}

export async function savePeiDraft(dimId, levelId, goalId, strategyId, text) {
  const draft = {
    id: "draft_" + dimId,
    dimId,
    levelId,
    goalId,
    strategyId,
    text,
    updatedAt: new Date().toISOString(),
  };
  await putItem("pei_drafts", draft);
  return draft;
}

export async function loadPeiDrafts() {
  return await getAll("pei_drafts");
}
