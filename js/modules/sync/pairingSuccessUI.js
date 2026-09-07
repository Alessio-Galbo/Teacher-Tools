import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isGuestMode } from "../auth/guestMode.js";
import { renderSyncResults } from "./pairingResultUI.js";

export function renderPairingSuccess(container, peerName, onFinish) {
  clearEl(container);
  const box = createEl("div", { className: "pairing-success-box text-center" });
  box.appendChild(createEl("h3", { className: "text-success mb-2" }, `🟢 ${peerName || t("mesh_paired_peer_label")}`));
  box.appendChild(createEl("p", { className: "text-muted mb-3" }, t("sync_prompt_bilateral_desc")));

  const actions = createEl("div", { className: "pairing-success-actions" });
  const syncBtn = createEl("button", { className: "btn btn-primary" }, `⚡ ${t("sync_btn_sync_now")}`);
  const skipBtn = createEl("button", { className: "btn btn-secondary" }, t("sync_btn_skip_sync"));
  const hintEl = createEl("div", { className: "sync-waiting-banner hidden" });

  const onStatusChanged = (e) => {
    if (e.detail?.state === "waiting_auth") {
      syncBtn.textContent = t("sync_waiting_peer_confirm");
      hintEl.textContent = t("sync_waiting_peer_hint");
      hintEl.classList.remove("hidden");
    } else if (e.detail?.state === "syncing") {
      syncBtn.textContent = t("sync_status_syncing");
      hintEl.classList.add("hidden");
    }
  };
  window.addEventListener("syncStatusChanged", onStatusChanged);

  syncBtn.addEventListener("click", async () => {
    syncBtn.disabled = true;
    skipBtn.disabled = true;
    if (isGuestMode()) {
      syncBtn.textContent = t("sync_waiting_peer_confirm");
      hintEl.textContent = t("sync_waiting_peer_hint");
      hintEl.classList.remove("hidden");
    } else {
      syncBtn.textContent = t("sync_status_syncing");
      hintEl.classList.add("hidden");
    }

    const { executeBilateralSyncPayload } = await import("./localSyncPeer.js");
    const res = await executeBilateralSyncPayload();
    window.removeEventListener("syncStatusChanged", onStatusChanged);

    if (res?.success) {
      syncBtn.textContent = t("sync_status_syncing");
      hintEl.classList.add("hidden");
      await new Promise((r) => setTimeout(r, 650));
      clearEl(box);
      renderSyncResults(box, res, onFinish);
    } else {
      syncBtn.disabled = false;
      skipBtn.disabled = false;
      syncBtn.textContent = `⚡ ${t("sync_btn_sync_now")}`;
      hintEl.classList.add("hidden");
      if (res?.error === "rejected") alert(t("sync_error_rejected"));
      else if (res?.error === "p2p_not_ready") alert(`⚠️ ${t("p2p_not_ready")}`);
      else alert(t("sync_status_error"));
    }
  });

  skipBtn.addEventListener("click", () => {
    window.removeEventListener("syncStatusChanged", onStatusChanged);
    onFinish();
  });

  actions.appendChild(syncBtn);
  actions.appendChild(skipBtn);
  actions.appendChild(hintEl);
  box.appendChild(actions);
  container.appendChild(box);
}
