import { getAll, putItem, clearStore } from "./db.js";
import { createSnapshot } from "./snapshot.js";

const STORES = ["students", "notes", "pei_drafts", "snapshots", "classes", "school_settings", "schools", "pei_phrases", "assessments", "quizzes", "didactic_plans", "calendar_events"];

export async function dumpDatabase() {
  const dump = { version: 6, exportedAt: new Date().toISOString() };
  await Promise.all(STORES.map(async (s) => { dump[s] = await getAll(s); }));
  return dump;
}


export async function exportAllDataJSON() {
  const data = await dumpDatabase();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TeacherTools_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareToICloud() {
  const data = await dumpDatabase();
  const filename = `TeacherTools_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  const jsonStr = JSON.stringify(data, null, 2);

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON Backup", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  const file = new File([jsonStr], filename, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Teacher Tools Backup" });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  await exportAllDataJSON();
}

export async function importDataJSON(jsonFile) {
  const text = await jsonFile.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("File non valido");

  await createSnapshot("Pre-Import Backup");
  await Promise.all(STORES.map((s) => clearStore(s)));

  const p = [];
  STORES.forEach((store) => {
    if (Array.isArray(parsed[store])) {
      parsed[store].forEach((item) => p.push(putItem(store, item)));
    }
  });

  await Promise.all(p);
  window.dispatchEvent(new CustomEvent("dataRestored"));
}
