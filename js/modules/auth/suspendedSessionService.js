import { dumpDatabase } from "../../services/backup.js";
import { restoreDatabaseObject } from "../../services/restoreService.js";
import { getPairedDevices, getMeshClusterToken } from "../sync/deviceMesh.js";
import { sha256, encryptPayload, decryptPayload } from "../sync/cryptoUtils.js";
import { getSchoolConfig } from "../../services/schoolConfigService.js";

const KEY_SESSIONS = "tt_suspended_guest_sessions";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 giorni

export function getSuspendedSessions() {
  try {
    const raw = localStorage.getItem(KEY_SESSIONS);
    if (!raw) return [];
    const now = Date.now();
    const list = JSON.parse(raw);
    const valid = list.filter((s) => (now - new Date(s.date).getTime()) <= MAX_AGE_MS);
    if (valid.length !== list.length) saveSessionsList(valid);
    return valid;
  } catch (_) { return []; }
}

function saveSessionsList(list) {
  try { localStorage.setItem(KEY_SESSIONS, JSON.stringify(list)); } catch (_) {}
}

export async function saveSuspendedLockSession() {
  const paired = await getPairedDevices();
  if (!paired || paired.length === 0) return null;

  const dump = await dumpDatabase();
  const token = getMeshClusterToken();
  if (!token) return null;

  const tokenHash = await sha256(token);
  const encrypted = await encryptPayload(dump, token);
  const cfg = await getSchoolConfig().catch(() => ({}));

  const session = {
    id: `lock_sess_${Date.now()}`,
    date: new Date().toISOString(),
    teacherName: cfg?.teacherName || "",
    tokenHash,
    itemCounts: {
      students: dump.students?.length || 0,
      notes: dump.notes?.length || 0,
      quizzes: dump.quizzes?.length || 0,
    },
    encryptedPacket: encrypted,
  };

  const current = getSuspendedSessions().filter((s) => s.tokenHash !== tokenHash);
  current.unshift(session);
  if (current.length > 5) current.length = 5;
  saveSessionsList(current);
  return session;
}

export async function matchSuspendedSession(tokens) {
  const sessions = getSuspendedSessions();
  if (!sessions.length || !tokens?.length) return null;
  for (const t of tokens) {
    if (!t) continue;
    const h = await sha256(t);
    const match = sessions.find((s) => s.tokenHash === h);
    if (match) return { session: match, matchingToken: t };
  }
  return null;
}

export async function restoreSuspendedSession(sessionId, token) {
  const sessions = getSuspendedSessions();
  const found = sessions.find((s) => s.id === sessionId);
  if (!found) return false;
  const hash = await sha256(token);
  if (hash !== found.tokenHash) return false;

  const decrypted = await decryptPayload(found.encryptedPacket, token);
  await restoreDatabaseObject(decrypted);
  deleteSuspendedSession(sessionId);
  return true;
}

export function deleteSuspendedSession(sessionId) {
  const next = getSuspendedSessions().filter((s) => s.id !== sessionId);
  saveSessionsList(next);
}
