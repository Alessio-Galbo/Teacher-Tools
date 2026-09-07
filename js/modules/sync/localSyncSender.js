import { computeChecksum } from "./cryptoUtils.js";
import { dumpDatabase } from "../../services/backup.js";
import { isGuestMode } from "../auth/guestMode.js";
import { getDefaultDeviceName } from "./deviceMesh.js";

async function waitP2PReady(isP2PReady) {
  if (!isP2PReady || isP2PReady()) return true;
  const { broadcastHello } = await import("./localSyncCommands.js");
  broadcastHello();
  const start = Date.now();
  while (Date.now() - start < 300) {
    await new Promise((r) => setTimeout(r, 50));
    if (isP2PReady()) return true;
  }
  return false;
}

export function executeBilateralSync(sendRaw, notifyStatus, isP2PReady = null) {
  const isGuest = isGuestMode();
  return new Promise(async (resolve) => {
    let timer = null;

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("syncAcknowledged", onSynced);
      window.removeEventListener("syncRejected", onRejected);
    };

    const onSynced = (e) => {
      cleanup();
      const count = e.detail?.count || 0;
      const summary = e.detail?.summary || "";
      const counts = e.detail?.counts || {};
      notifyStatus("synced", null, { count, summary, counts });
      setTimeout(() => notifyStatus("connected"), 3000);
      resolve({ success: true, count, summary, counts });
    };

    const onRejected = (e) => {
      cleanup();
      notifyStatus("error", null, { error: e.detail?.error || "rejected" });
      resolve({ success: false, error: "rejected" });
    };

    await waitP2PReady(isP2PReady);

    notifyStatus(isGuest ? "waiting_auth" : "syncing");
    timer = setTimeout(() => {
      cleanup();
      notifyStatus("connected");
      resolve({ success: false, error: "timeout" });
    }, 45000);

    window.addEventListener("syncAcknowledged", onSynced);
    window.addEventListener("syncRejected", onRejected);

    try {
      const dump = await dumpDatabase();
      const checksum = await computeChecksum(dump);
      await sendRaw({
        type: "SYNC_START",
        checksum,
        data: dump,
        fromGuest: isGuest,
        senderName: getDefaultDeviceName(),
      });
    } catch (err) {
      cleanup();
      notifyStatus("error", null, { error: err.message });
      resolve({ success: false, error: err.message });
    }
  });
}
