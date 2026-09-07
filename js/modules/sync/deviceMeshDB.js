import { getMyDeviceDisplay } from "./deviceInfo.js";

const IDB_NAME = "TT_LocalSyncMeshDB";
const STORE = "paired_mesh";

function openMeshDB() {
  return new Promise((resolve, reject) => {
    let done = false;
    const timer = setTimeout(() => { if (!done) { done = true; reject(new Error("timeout")); } }, 1500);
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE, { keyPath: "id" });
      req.onsuccess = () => { if (!done) { done = true; clearTimeout(timer); resolve(req.result); } };
      req.onerror = () => { if (!done) { done = true; clearTimeout(timer); reject(req.error); } };
      req.onblocked = () => { if (!done) { done = true; clearTimeout(timer); reject(new Error("blocked")); } };
    } catch (err) { if (!done) { done = true; clearTimeout(timer); reject(err); } }
  });
}

function withStore(mode, fn) {
  return openMeshDB().then((db) => new Promise((resolve) => {
    const tx = db.transaction(STORE, mode);
    fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  })).catch(() => false);
}

export async function getPairedDevices() {
  try {
    const db = await openMeshDB();
    const myName = getMyDeviceDisplay();
    return new Promise((resolve) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result || []).filter((d) => d?.name && d.name !== myName));
      req.onerror = () => resolve([]);
    });
  } catch (_) { return []; }
}

export async function savePairedDevice(device) {
  if (!device || device.name === getMyDeviceDisplay()) return;
  await withStore("readwrite", (store) => store.put(device));
}

export async function updatePairedDeviceName(id, newName) {
  if (!id || !newName?.trim()) return;
  await withStore("readwrite", (store) => {
    const req = store.get(id);
    req.onsuccess = () => {
      const item = req.result;
      if (item) { item.name = newName.trim(); store.put(item); }
    };
  });
}

export async function removePairedDevice(id) {
  await withStore("readwrite", (store) => store.delete(id));
}

export async function clearPairedDevices() {
  await withStore("readwrite", (store) => store.clear());
}

export async function leaveMeshCluster() {
  await clearPairedDevices();
  localStorage.removeItem("tt_cluster_mesh_token");
}
