import { getDefaultDeviceName, removePairedDevice, getPairedDevices } from "./deviceMesh.js";
import { closeSignaling, MY_PEER_ID } from "./webrtcSignaling.js";
import { detectDeviceDetails } from "./deviceInfo.js";
import { isGuestMode } from "../auth/guestMode.js";
import { sendRaw, setActiveDcNull, notifyStatus } from "./localSyncPeer.js";

export async function unpairDevice(devId) {
  await sendRaw({ type: "UNPAIR", deviceId: devId, senderName: getDefaultDeviceName() });
  await removePairedDevice(devId);
  if ((await getPairedDevices()).length === 0) { closeSignaling(); setActiveDcNull(); notifyStatus("disconnected"); }
}

export async function sendTerminateGuestSession() {
  await sendRaw({ type: "TERMINATE_GUEST_SESSION" });
  closeSignaling();
  setActiveDcNull();
  notifyStatus("disconnected");
}

export async function sendRemoteUnlockSignal() {
  await sendRaw({ type: "UNLOCK_SCREEN" });
}

export async function broadcastLockStatus(isLocked) {
  await sendRaw({ type: isLocked ? "SCREEN_LOCKED" : "SCREEN_UNLOCKED", name: getDefaultDeviceName() });
}

import { getPairingTokensHistory } from "./pairingHistory.js";

export function broadcastHello() {
  const det = detectDeviceDetails();
  const isLocked = !!document.getElementById("lock-screen-overlay");
  const curToken = localStorage.getItem("tt_cluster_mesh_token");
  const tokens = curToken ? [curToken] : [];
  getPairingTokensHistory().forEach((h) => { if (h?.token && !tokens.includes(h.token)) tokens.push(h.token); });

  sendRaw({
    type: "HELLO",
    peerId: MY_PEER_ID,
    name: getDefaultDeviceName(),
    icon: det.icon,
    model: det.model,
    isGuest: isGuestMode(),
    isLocked,
    reply: true,
    tokens: tokens.slice(0, 10),
  });
}

export function initMeshHeartbeat(checkLivenessFn, isDcActiveFn) {
  if (typeof window === "undefined") return;
  window.addEventListener("focus", () => broadcastHello());
  window.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") broadcastHello(); });
  let tick = 0;
  setInterval(async () => {
    if ((await getPairedDevices()).length > 0) {
      checkLivenessFn();
      tick++;
      if (isDcActiveFn() || tick % 3 === 0) broadcastHello();
    }
  }, 15000);
}
