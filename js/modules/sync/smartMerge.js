import { getAll, putItem } from "../../services/db.js";
import { createSnapshot } from "../../services/snapshot.js";
import { t } from "../../i18n.js";
import { formatSyncSummary } from "./syncSummaryFormatter.js";
export { formatSyncSummary };

export const STORES_TO_MERGE = [
  "students", "notes", "pei_drafts", "classes",
  "schools", "school_settings", "pei_phrases", "assessments", "quizzes",
  "didactic_plans", "calendar_events",
];

export function isProfileEmpty(dump) {
  if (!dump || typeof dump !== "object") return true;
  const coreStores = ["students", "schools", "classes", "notes", "didactic_plans"];
  const count = coreStores.reduce((acc, s) => acc + (Array.isArray(dump[s]) ? dump[s].length : 0), 0);
  return count === 0;
}


export async function smartMergeData(remoteDump) {
  if (!remoteDump || typeof remoteDump !== "object") throw new Error("Payload di sincronizzazione non valido");
  const localDump = {};
  for (const s of STORES_TO_MERGE) localDump[s] = await getAll(s);
  if (isProfileEmpty(remoteDump) && !isProfileEmpty(localDump)) return { addedCount: 0, updatedCount: 0, counts: {}, summary: t("sync_summary_no_changes") };

  await createSnapshot("Pre-Sync Safety Backup");
  let addedCount = 0; let updatedCount = 0; const counts = {};

  for (const storeName of STORES_TO_MERGE) {
    const remoteList = Array.isArray(remoteDump[storeName]) ? remoteDump[storeName] : [];
    if (!remoteList.length) continue;
    const localMap = new Map((localDump[storeName] || []).map((i) => [String(i.id), i]));

    for (const rItem of remoteList) {
      const lItem = localMap.get(String(rItem.id));
      if (!lItem) {
        await putItem(storeName, rItem); addedCount++;
        counts[storeName] = (counts[storeName] || 0) + 1;
      } else {
        const rTime = new Date(rItem.updatedAt || rItem.timestamp || rItem.date || rItem.createdAt || 0).getTime();
        const lTime = new Date(lItem.updatedAt || lItem.timestamp || lItem.date || lItem.createdAt || 0).getTime();
        if (rTime > lTime) {
          await putItem(storeName, rItem); updatedCount++;
          counts[storeName] = (counts[storeName] || 0) + 1;
        }
      }
    }
  }

  localStorage.setItem("teacher_tools_last_sync_timestamp", new Date().toISOString());
  window.dispatchEvent(new CustomEvent("dataRestored"));
  window.dispatchEvent(new CustomEvent("schoolsListChanged"));
  return { addedCount, updatedCount, counts, summary: formatSyncSummary(counts) };
}
