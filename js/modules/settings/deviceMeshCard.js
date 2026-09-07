import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showPairingModal } from "../sync/pairingModal.js";
import { getSyncStatus } from "../sync/localSyncPeer.js";
import { getPairedDevices } from "../sync/deviceMesh.js";
import { createCurrentDeviceBox } from "./deviceProfileCard.js";
import { createDeviceMeshList } from "./deviceMeshCardList.js";

function createMeshFooterActions(onRefresh) {
  const bar = createEl("div", { className: "mesh-footer-actions" });
  const btnLabel = `⚡ ${t("sync_btn_sync_now")}`;
  const syncBtn = createEl("button", { className: "btn btn-primary btn-sm" }, btnLabel);

  const updateStatus = () => {
    const s = getSyncStatus();
    syncBtn.disabled = s.state === "disconnected" || s.state === "syncing" || s.state === "waiting_auth";
  };
  updateStatus();
  window.addEventListener("syncStatusChanged", updateStatus);

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
    } else if (res?.error === "rejected") alert(t("sync_error_rejected"));
    else alert(t("sync_status_error"));
  });
  bar.appendChild(syncBtn);

  const addBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, `+ ${t("mesh_btn_add_device")}`);
  addBtn.addEventListener("click", () => { showPairingModal(() => { if (onRefresh) onRefresh(); }); });
  bar.appendChild(addBtn);
  return bar;
}

export function createDeviceMeshCard(onRefresh) {
  const card = createEl("div", { className: "card settings-card" });
  const body = createEl("div", { className: "card-body" });

  let currentBox = createEl("div");
  body.appendChild(currentBox);
  const updateBox = () => {
    getPairedDevices().then((peers) => {
      const next = createCurrentDeviceBox(onRefresh, (peers || []).length > 0);
      currentBox.replaceWith(next);
      currentBox = next;
    });
  };
  updateBox();
  window.addEventListener("localPeerConnected", updateBox);
  window.addEventListener("peerUnpaired", updateBox);

  body.appendChild(createEl("h4", { className: "text-sm font-semibold mb-1 mt-3" }, t("mesh_peers_title")));
  body.appendChild(createEl("p", { className: "text-muted mb-3 text-xs" }, t("mesh_peers_desc")));
  body.appendChild(createDeviceMeshList(onRefresh));
  body.appendChild(createMeshFooterActions(onRefresh));

  card.appendChild(body);
  return card;
}
