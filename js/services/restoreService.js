import { putItem, clearStore } from "./db.js";

const STORES = [
  "students", "notes", "pei_drafts", "snapshots", "classes",
  "school_settings", "schools", "pei_phrases", "assessments",
  "quizzes", "didactic_plans", "calendar_events"
];

export async function restoreDatabaseObject(parsed) {
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid dump data");
  await Promise.all(STORES.map((s) => clearStore(s)));
  const puts = [];
  STORES.forEach((store) => {
    if (Array.isArray(parsed[store])) {
      parsed[store].forEach((item) => puts.push(putItem(store, item)));
    }
  });
  await Promise.all(puts);
  window.dispatchEvent(new CustomEvent("dataRestored"));
  return true;
}
