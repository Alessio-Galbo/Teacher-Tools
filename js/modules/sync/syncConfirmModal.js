import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function promptSyncAuthorization(senderName) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("modal-container") || document.body;
    const isModalContainer = overlay.id === "modal-container";

    const modal = createEl("div", { className: "modal-dialog sync-confirm-modal" });
    const head = createEl("div", { className: "modal-header" });
    head.appendChild(createEl("h3", { className: "modal-title text-warning" }, `⚠️ ${t("sync_auth_title")}`));

    const close = (result) => {
      if (isModalContainer) {
        overlay.classList.remove("active");
        clearEl(overlay);
      } else if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      resolve(result);
    };

    const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
    closeBtn.addEventListener("click", () => close(false));
    head.appendChild(closeBtn);
    modal.appendChild(head);

    const body = createEl("div", { className: "modal-body" });
    const displayName = senderName || t("settings_profile_guest");
    const descText = t("sync_auth_desc", { name: displayName });
    body.appendChild(createEl("p", { className: "sync-confirm-text font-semibold mb-2" }, descText));
    modal.appendChild(body);

    const footer = createEl("div", { className: "sync-confirm-footer" });
    const denyBtn = createEl("button", { className: "btn btn-secondary" }, `✕ ${t("sync_auth_btn_deny")}`);
    denyBtn.addEventListener("click", () => close(false));

    const allowBtn = createEl("button", { className: "btn btn-primary" }, `✓ ${t("sync_auth_btn_allow")}`);
    allowBtn.addEventListener("click", () => close(true));

    footer.appendChild(denyBtn);
    footer.appendChild(allowBtn);
    modal.appendChild(footer);

    if (isModalContainer) {
      clearEl(overlay);
      overlay.appendChild(modal);
      overlay.classList.add("active");
    } else {
      overlay.appendChild(modal);
    }
  });
}
