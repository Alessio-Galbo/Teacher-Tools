import { getMeshClusterToken, getPairedDevices } from "./deviceMesh.js";
import { encryptPayload, decryptPayload } from "./cryptoUtils.js";
import { startWebRtcMesh } from "./webrtcPeer.js";
import { sendSignaling, addSignalingListener } from "./webrtcSignaling.js";
import { sendChunked } from "./webrtcChunker.js";
import { handleIncomingMessage, parseRawPacket } from "./localSyncHandlers.js";
import { executeBilateralSync } from "./localSyncSender.js";
import { broadcastHello, initMeshHeartbeat } from "./localSyncCommands.js";

let currentStatus = { state: "disconnected", peerName: null, lastTime: null };
let activeDc = null; let bc = null; let lastPeerSeen = 0;
const peerSeenMap = new Map();

export function notifyStatus(state, peerName = null, extra = {}) {
  currentStatus = { state, peerName: peerName || currentStatus.peerName, lastTime: Date.now(), ...extra };
  window.dispatchEvent(new CustomEvent("syncStatusChanged", { detail: currentStatus }));
}
export const getSyncStatus = () => currentStatus;
export const setActiveDcNull = () => { activeDc = null; };
export const isDirectP2PReady = () => activeDc?.readyState === "open";
export function markPeerAlive(name) {
  lastPeerSeen = Date.now();
  if (name) peerSeenMap.set(name, Date.now());
  if (currentStatus.state !== "connected") notifyStatus("connected", name);
}

export function isPeerConnected(name, total = 1) {
  if (!name) return false;
  const isAlive = ["connected", "syncing", "waiting_auth", "synced"].includes(currentStatus.state);
  const seenRecently = Date.now() - (peerSeenMap.get(name) || 0) < 120000;
  if (seenRecently) return true;
  if (isAlive && (currentStatus.peerName === name || total === 1)) return true;
  return false;
}

function checkLiveness() {
  if (!activeDc && Date.now() - lastPeerSeen > 120000 && currentStatus.state !== "disconnected") notifyStatus("disconnected");
}

function getBc() {
  if (!bc) {
    const token = getMeshClusterToken();
    bc = new BroadcastChannel(`tt_mesh_${token.slice(0, 16)}`);
    bc.onmessage = async (e) => {
      try { handleIncomingMessage(await decryptPayload(e.data, token), notifyStatus, sendRaw, onDcOpen, onRawPacket); } catch (_) {}
    };
  }
  return bc;
}

const onDcOpen = (dc) => {
  activeDc = dc;
  if (dc) {
    dc.onclose = () => { if (activeDc === dc) { activeDc = null; checkLiveness(); } };
    notifyStatus("connected");
  } else checkLiveness();
};
const onRawPacket = (raw) => parseRawPacket(raw, (msg) => handleIncomingMessage(msg, notifyStatus, sendRaw, onDcOpen, onRawPacket));

export async function sendRaw(obj) {
  const token = getMeshClusterToken();
  const packet = await encryptPayload(obj, token);
  getBc().postMessage(packet);
  if (activeDc?.readyState === "open") {
    sendChunked(activeDc, JSON.stringify(packet));
  } else {
    sendSignaling(token, { type: "SIGNAL_CTRL", packet }).catch(() => {});
  }
}

async function bindSignaling(token) {
  getBc();
  addSignalingListener(token, (m) => (m.type === "SIGNAL_CTRL" && m.packet) && onRawPacket(m.packet));
  broadcastHello();
}

initMeshHeartbeat(checkLiveness, () => activeDc?.readyState === "open");

export async function initHostSync() {
  const token = getMeshClusterToken();
  await startWebRtcMesh(token, onDcOpen, onRawPacket);
  bindSignaling(token);
}
export const initClientSync = initHostSync;
export async function initAutoSync() { if ((await getPairedDevices()).length > 0) initHostSync(); }
export const executeBilateralSyncPayload = () => executeBilateralSync(sendRaw, notifyStatus, isDirectP2PReady);
export const sendLocalSyncPayload = executeBilateralSyncPayload, requestLocalSyncPayload = executeBilateralSyncPayload;
export { unpairDevice, sendTerminateGuestSession, sendRemoteUnlockSignal, broadcastLockStatus, broadcastHello } from "./localSyncCommands.js";
