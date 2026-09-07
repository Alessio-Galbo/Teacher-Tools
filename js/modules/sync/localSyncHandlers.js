import { getMeshClusterToken, getDefaultDeviceName, savePairedDevice, removePairedDevice, getPairedDevices } from "./deviceMesh.js";
import { smartMergeData } from "./smartMerge.js";
import { mergeCounts, formatSyncSummary } from "./syncSummaryFormatter.js";
import { computeChecksum, decryptPayload } from "./cryptoUtils.js";
import { isGuestMode } from "../auth/guestMode.js";
import { MY_PEER_ID } from "./webrtcSignaling.js";
import { createAndSendOffer } from "./webrtcPeer.js";
import { dumpDatabase } from "../../services/backup.js";
import { promptSyncAuthorization } from "./syncConfirmModal.js";
import { markPeerAlive, isDirectP2PReady } from "./localSyncPeer.js";

export async function handleIncomingMessage(msg, notifyStatus, sendRaw, onDcOpen, onRaw) {
  if (!msg || msg.peerId === MY_PEER_ID || (msg.name && msg.name === getDefaultDeviceName())) return;
  markPeerAlive(msg.name || msg.senderName);
  if (msg.type === "HELLO") {
    notifyStatus("connected", msg.name);
    const devId = `dev_${encodeURIComponent(msg.name || "peer").replace(/%/g, "").slice(0, 24)}`;
    await savePairedDevice({
      id: devId, name: msg.name, icon: msg.icon || "📱",
      isGuest: !!msg.isGuest, model: msg.model || "",
      token: getMeshClusterToken(), pairedAt: new Date().toISOString(),
    });
    window.dispatchEvent(new CustomEvent("localPeerConnected", { detail: { name: msg.name } }));
    const isLocked = !!document.getElementById("lock-screen-overlay");
    if (msg.isLocked) window.dispatchEvent(new CustomEvent("peerScreenLocked", { detail: { name: msg.name } }));
    else window.dispatchEvent(new CustomEvent("peerScreenUnlocked", { detail: { name: msg.name } }));
    if (msg.peerId && MY_PEER_ID > msg.peerId && !isDirectP2PReady()) createAndSendOffer(getMeshClusterToken(), msg.peerId, onDcOpen, onRaw);
    if (msg.reply) sendRaw({ type: "HELLO", peerId: MY_PEER_ID, name: getDefaultDeviceName(), isGuest: isGuestMode(), isLocked, reply: false });
    if (isGuestMode() && msg.tokens?.length) {
      import("../auth/suspendedSessionPrompt.js").then((m) => m.checkAndPromptSuspendedSession(msg.tokens)).catch(() => {});
    }
  } else if (msg.type === "SCREEN_LOCKED" || msg.type === "SCREEN_UNLOCKED") {
    window.dispatchEvent(new CustomEvent(msg.type === "SCREEN_LOCKED" ? "peerScreenLocked" : "peerScreenUnlocked", { detail: { name: msg.name } }));
  } else if (msg.type === "UNLOCK_SCREEN") {
    window.dispatchEvent(new CustomEvent("remoteUnlockReceived"));
    sendRaw({ type: "SCREEN_UNLOCKED", name: getDefaultDeviceName() });
  } else if (msg.type === "UNPAIR") {
    const list = await getPairedDevices();
    const found = list.find((d) => d.id === msg.deviceId || d.name === msg.senderName);
    if (found) await removePairedDevice(found.id);
    window.dispatchEvent(new CustomEvent("peerUnpaired"));
  } else if (msg.type === "TERMINATE_GUEST_SESSION") {
    const list = await getPairedDevices();
    for (const d of list) { if (d.isGuest) await removePairedDevice(d.id); }
    window.dispatchEvent(new CustomEvent("peerUnpaired"));
  } else if (msg.type === "SYNC_START") {
    if (await computeChecksum(msg.data) !== msg.checksum) return sendRaw({ type: "SYNC_ERROR", error: "Checksum" });
    if (msg.fromGuest && !isGuestMode()) {
      const ok = await promptSyncAuthorization(msg.senderName);
      if (!ok) return sendRaw({ type: "SYNC_REJECTED", reason: "denied" });
    }
    notifyStatus("syncing");
    const res = await smartMergeData(msg.data);
    const updated = await dumpDatabase();
    const chk = await computeChecksum(updated);
    await sendRaw({ type: "SYNC_COMPLETE", checksum: chk, data: updated, count: res.addedCount + res.updatedCount, counts: res.counts, summary: res.summary });
  } else if (msg.type === "SYNC_COMPLETE") {
    if (await computeChecksum(msg.data) !== msg.checksum) return notifyStatus("error", null, { error: "Checksum" });
    notifyStatus("syncing");
    const res = await smartMergeData(msg.data);
    const totalCount = res.addedCount + res.updatedCount + (msg.count || 0);
    const combinedCounts = mergeCounts(msg.counts, res.counts);
    const summary = formatSyncSummary(combinedCounts);
    await sendRaw({ type: "SYNC_ACK", success: true, count: totalCount, counts: combinedCounts, summary });
    notifyStatus("synced", null, { count: totalCount, counts: combinedCounts, summary });
    setTimeout(() => notifyStatus("connected"), 3000);
    window.dispatchEvent(new CustomEvent("syncAcknowledged", { detail: { count: totalCount, counts: combinedCounts, summary } }));
  } else if (msg.type === "SYNC_ACK") {
    notifyStatus("synced", null, { count: msg.count || 0, counts: msg.counts || {}, summary: msg.summary || "" });
    setTimeout(() => notifyStatus("connected"), 3000);
    window.dispatchEvent(new CustomEvent("syncAcknowledged", { detail: { count: msg.count || 0, counts: msg.counts || {}, summary: msg.summary || "" } }));
  } else if (msg.type === "SYNC_REJECTED" || msg.type === "SYNC_ERROR") {
    notifyStatus("error", null, { error: msg.reason || msg.error || "failed" });
    window.dispatchEvent(new CustomEvent("syncRejected", { detail: { error: msg.reason || msg.error } }));
  }
}

export async function parseRawPacket(raw, onDecrypted) {
  try {
    const token = getMeshClusterToken();
    const pkt = typeof raw === "string" ? JSON.parse(raw) : raw;
    onDecrypted(await decryptPayload(pkt, token));
  } catch (_) {}
}
