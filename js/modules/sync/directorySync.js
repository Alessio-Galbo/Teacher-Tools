import { isGuestMode } from "../auth/guestMode.js";
import { dumpDatabase, importDataJSON } from "../../services/backup.js";

const IDB_NAME = "TT_LocalSyncHandlesDB";
const STORE = "directories";

function openHandleDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE, { keyPath: "name" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function isDirectorySyncSupported() {
  return typeof window.showDirectoryPicker === "function";
}

export async function getConnectedDirectories() {
  if (!isDirectorySyncSupported() || isGuestMode()) return [];
  const db = await openHandleDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

export async function connectSyncDirectory() {
  if (!isDirectorySyncSupported() || isGuestMode()) return null;
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  const db = await openHandleDB();
  const entry = { name: handle.name, handle, linkedAt: new Date().toISOString() };
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).put(entry);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  await autoSaveToDirectories();
  return entry;
}

export async function disconnectSyncDirectory(name) {
  const db = await openHandleDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).delete(name);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function autoSaveToDirectories() {
  if (isGuestMode() || !isDirectorySyncSupported()) return;
  const dirs = await getConnectedDirectories();
  if (!dirs.length) return;
  const dump = await dumpDatabase();
  const jsonStr = JSON.stringify(dump, null, 2);
  for (const item of dirs) {
    try {
      const perm = await item.handle.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") continue;
      const fileHandle = await item.handle.getFileHandle("teachertools_sync.json", { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
    } catch (_) {}
  }
}
