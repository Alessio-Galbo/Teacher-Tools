import { sha256 } from "./cryptoUtils.js";

const KEY_HISTORY = "tt_pairing_history";
const MAX_HISTORY = 20;

export function getPairingTokensHistory() {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

export function recordPairingToken(token, peerName = "") {
  if (!token || typeof token !== "string") return;
  const history = getPairingTokensHistory().filter((item) => item.token !== token);
  history.unshift({
    token,
    peerName: peerName || "",
    timestamp: new Date().toISOString(),
  });
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  try { localStorage.setItem(KEY_HISTORY, JSON.stringify(history)); } catch (_) {}
}

export async function findMatchingTokenForHash(targetHash) {
  if (!targetHash) return null;
  const curToken = localStorage.getItem("tt_cluster_mesh_token");
  if (curToken && (await sha256(curToken)) === targetHash) return curToken;

  const history = getPairingTokensHistory();
  for (const item of history) {
    if (item?.token && (await sha256(item.token)) === targetHash) {
      return item.token;
    }
  }
  return null;
}
