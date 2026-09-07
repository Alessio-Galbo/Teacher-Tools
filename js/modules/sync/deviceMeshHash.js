import { setMeshClusterToken, getPairedDevices } from "./deviceMesh.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";

export async function checkIncomingPairHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#unlock=")) {
    sessionStorage.setItem("tt_just_unlocked_qr", Date.now().toString());
    import("./remoteUnlockBanner.js").then((m) => m.hideBanner()).catch(() => {});
    const uToken = hash.replace("#unlock=", "").trim();
    if (uToken) {
      const paired = await getPairedDevices();
      const curToken = localStorage.getItem("tt_cluster_mesh_token");
      const isAuth = curToken === uToken || paired.some((d) => d.token === uToken);
      if (!isAuth) {
        showToast(t("lock_unlock_unauthorized"), "error");
      } else {
        setMeshClusterToken(uToken);
        const { sendRemoteUnlockSignal } = await import("./localSyncPeer.js");
        await sendRemoteUnlockSignal();
        showToast(t("lock_remote_unlock_sent"), "success");
      }
    }
    window.history.replaceState(null, "", window.location.pathname);
    return;
  }
  if (!hash.startsWith("#pair=")) return;
  const pToken = hash.replace("#pair=", "").trim();
  if (!pToken) return;
  setMeshClusterToken(pToken);
  const { initClientSync, broadcastHello } = await import("./localSyncPeer.js");
  await initClientSync();
  setTimeout(() => broadcastHello(), 500);
  setTimeout(() => broadcastHello(), 1500);
  window.addEventListener("localPeerConnected", (e) => {
    showToast(`${t("pairing_success")}: ${e.detail?.name || ""}`, "success");
  }, { once: true });
  window.history.replaceState(null, "", window.location.pathname);
}

if (typeof window !== "undefined") window.addEventListener("hashchange", checkIncomingPairHash);

