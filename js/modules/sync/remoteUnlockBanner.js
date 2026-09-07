import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { sendRemoteUnlockSignal } from "./localSyncPeer.js";
import { showToast } from "../../utils/toast.js";

let bannerEl = null;

export function initRemoteUnlockBanner() {
  window.addEventListener("peerScreenLocked", (e) => {
    const justUnlocked = sessionStorage.getItem("tt_just_unlocked_qr");
    if (justUnlocked && Date.now() - parseInt(justUnlocked, 10) < 20000) return;
    const peerName = e.detail?.name || t("lock_device_paired");
    showBanner(peerName);
  });
  window.addEventListener("peerScreenUnlocked", hideBanner);
}

export function showBanner(peerName) {
  const header = document.querySelector(".app-header");
  if (!header) return;
  hideBanner();

  bannerEl = createEl("div", { id: "remote-unlock-bar", className: "remote-unlock-bar" });
  const text = createEl("span", { className: "remote-unlock-text" }, `🔒 ${peerName} ${t("remote_unlock_is_locked")}`);
  const actions = createEl("div", { className: "remote-unlock-actions" });

  const unlockBtn = createEl("button", { className: "btn btn-primary btn-sm remote-unlock-btn" }, `🔓 ${t("lock_btn_unlock")}`);
  unlockBtn.addEventListener("click", async () => {
    unlockBtn.disabled = true;
    await sendRemoteUnlockSignal();
    showToast(t("lock_remote_unlock_sent"), "success");
    hideBanner();
  });

  const closeBtn = createEl("button", { className: "remote-unlock-dismiss", title: t("btn_close") }, "✕");
  closeBtn.addEventListener("click", hideBanner);

  actions.appendChild(unlockBtn);
  actions.appendChild(closeBtn);
  bannerEl.appendChild(text);
  bannerEl.appendChild(actions);
  header.parentNode.insertBefore(bannerEl, header.nextSibling);
}

export function hideBanner() {
  if (bannerEl && bannerEl.parentNode) {
    bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }
}
