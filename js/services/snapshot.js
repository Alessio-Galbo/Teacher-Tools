import { getAll, putItem, clearStore } from "./db.js";

const STORES = ["students", "notes", "pei_drafts", "classes", "school_settings", "schools"];

export async function createSnapshot(label = "Auto-save") {
  const [students, notes, drafts, classes, settings, schools] = await Promise.all(STORES.map((s) => getAll(s)));
  const snapshot = {
    id: "snap_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    label,
    data: { students, notes, pei_drafts: drafts, classes, school_settings: settings, schools },
  };
  await putItem("snapshots", snapshot);
  return snapshot;
}

export async function getSnapshots() {
  const list = await getAll("snapshots");
  return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function restoreSnapshot(snapshotId) {
  const snapshots = await getAll("snapshots");
  const target = snapshots.find((s) => s.id === snapshotId);
  if (!target) throw new Error("Snapshot non trovato");

  await createSnapshot("Pre-Rollback Backup");
  await Promise.all(STORES.map((s) => clearStore(s)));

  const promises = [];
  STORES.forEach((store) => {
    if (Array.isArray(target.data[store])) {
      target.data[store].forEach((item) => promises.push(putItem(store, item)));
    }
  });

  await Promise.all(promises);
  window.dispatchEvent(new CustomEvent("dataRestored"));
  return target;
}
