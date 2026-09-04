import { getAll, putItem } from "../../services/db.js";
import { getDimensionById } from "./peiData.js";

export async function getPhraseConfig() {
  const all = await getAll("pei_phrases");
  const customDoc = all.find((d) => d.id === "custom_phrases") || { id: "custom_phrases", phrases: [] };
  const hiddenDoc = all.find((d) => d.id === "hidden_phrases") || { id: "hidden_phrases", hiddenIds: [] };
  return { customPhrases: customDoc.phrases || [], hiddenIds: hiddenDoc.hiddenIds || [] };
}

export async function addCustomPhrase(dimId, section, text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const { customPhrases } = await getPhraseConfig();
  const newPhrase = {
    id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    dimId,
    section,
    text: trimmed,
  };
  customPhrases.push(newPhrase);
  await putItem("pei_phrases", { id: "custom_phrases", phrases: customPhrases });
  return newPhrase;
}

export async function deleteCustomPhrase(phraseId) {
  const { customPhrases } = await getPhraseConfig();
  const filtered = customPhrases.filter((p) => p.id !== phraseId);
  await putItem("pei_phrases", { id: "custom_phrases", phrases: filtered });
}

export async function toggleHideDefaultPhrase(phraseId, isHidden) {
  const { hiddenIds } = await getPhraseConfig();
  const set = new Set(hiddenIds);
  if (isHidden) set.add(phraseId);
  else set.delete(phraseId);
  await putItem("pei_phrases", { id: "hidden_phrases", hiddenIds: Array.from(set) });
}

export async function getEffectiveDimension(dimId) {
  const dim = getDimensionById(dimId);
  const { customPhrases, hiddenIds } = await getPhraseConfig();
  const hiddenSet = new Set(hiddenIds);

  const merge = (defaults, section) => {
    const visibleDefaults = defaults.filter((item) => !hiddenSet.has(item.id));
    const customs = customPhrases
      .filter((p) => p.dimId === dimId && p.section === section)
      .map((p) => ({ id: p.id, text: p.text, isCustom: true }));
    const combined = [...visibleDefaults, ...customs];
    return combined.length > 0 ? combined : defaults;
  };

  return {
    id: dim.id,
    nameKey: dim.nameKey,
    levels: merge(dim.levels, "levels"),
    goals: merge(dim.goals, "goals"),
    strategies: merge(dim.strategies, "strategies"),
  };
}
