import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSyncStatus } from "../sync/localSyncPeer.js";

export function createDeviceMeshSyncBanner(onRefresh) {
  const banner = createEl("div", { className: "mesh-sync-banner" });
  const statusBadge = createEl("span", { className: "badge badge-secondary" });
  const btnLabel = `⚡ ${t("sync_btn_sync_now")}`;
  const syncBtn = createEl("button", { className: "btn btn-primary btn-sm" }, btnLabel);

  const updateStatus = () => {
    const s = getSyncStatus();
    syncBtn.disabled = s.state === "disconnected" || s.state === "syncing" || s.state === "waiting_auth";
    const map = {
      connected: ["badge-success", `${t("sync_status_connected")} ${s.peerName || ""}`],
      waiting_auth: ["badge-warning", t("sync_status_waiting_auth")],
      syncing: ["badge-warning", t("sync_status_syncing")],
      synced: ["badge-primary", t("sync_status_synced")],
    };
    const [cls, txt] = map[s.state] || ["badge-secondary", t("mesh_status_waiting")];
    statusBadge.className = `badge ${cls}`;
    statusBadge.textContent = txt;
  };
  updateStatus();
  window.addEventListener("syncStatusChanged", updateStatus);
  banner.appendChild(statusBadge);

  syncBtn.addEventListener("click", async () => {
    syncBtn.disabled = true;
    syncBtn.textContent = t("sync_status_syncing");
    const { executeBilateralSyncPayload } = await import("../sync/localSyncPeer.js");
    const res = await executeBilateralSyncPayload();
    syncBtn.disabled = false;
    syncBtn.textContent = btnLabel;
    if (res?.success) {
      const msg = res.summary ? `✅ ${t("sync_success_toast")}\n\n${res.summary}` : t("sync_success_count", { count: res.count });
      alert(msg);
      if (onRefresh) onRefresh();
    } else if (res?.error === "rejected") {
      alert(t("sync_error_rejected"));
    } else {
      alert(t("sync_status_error"));
    }
  });
  banner.appendChild(syncBtn);
  return banner;
}
