import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getStoredPin, clearStoredPin, showPinManageModal } from "../auth/lockScreenPin.js";

export function createDevicePinSection(onRefresh = null) {
  const sec = createEl("div", { className: "device-pin-section" });
  const render = () => {
    clearEl(sec);
    const pin = getStoredPin();
    const row = createEl("div", { className: "device-pin-row" });

    const left = createEl("div", { className: "device-pin-left" });
    left.appendChild(createEl("span", { className: "device-pin-title" }, t("lock_pin_title_short")));

    const statusBadge = createEl("span", { className: `badge device-pin-status ${pin ? "badge-success" : "badge-secondary"}` });
    const deskTxt = createEl("span", { className: "pin-desktop-text" }, pin ? `${t("lock_pin_status_set")} (••••)` : t("lock_pin_status_none"));
    const mobTxt = createEl("span", { className: "pin-mobile-icon" }, pin ? "✔️" : "❌");
    statusBadge.appendChild(deskTxt);
    statusBadge.appendChild(mobTxt);
    left.appendChild(statusBadge);
    row.appendChild(left);

    const actions = createEl("div", { className: "device-pin-actions" });
    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      title: pin ? t("lock_btn_edit_pin") : t("lock_btn_config_pin")
    });
    editBtn.appendChild(createEl("span", { className: "pin-btn-icon" }, pin ? "✏️" : "🔢"));
    editBtn.appendChild(createEl("span", { className: "pin-btn-text" }, pin ? t("lock_btn_edit_pin") : t("lock_btn_config_pin")));
    editBtn.addEventListener("click", () => {
      showPinManageModal({
        onSaved: () => { render(); if (onRefresh) onRefresh(); },
        onRemoved: () => { render(); if (onRefresh) onRefresh(); }
      });
    });
    actions.appendChild(editBtn);

    if (pin) {
      const rmBtn = createEl("button", {
        className: "btn btn-danger btn-sm",
        title: t("lock_btn_remove_pin")
      });
      rmBtn.appendChild(createEl("span", { className: "pin-btn-icon" }, "🗑️"));
      rmBtn.appendChild(createEl("span", { className: "pin-btn-text" }, t("lock_btn_remove_pin")));
      rmBtn.addEventListener("click", () => {
        if (window.confirm(t("lock_remove_pin_confirm"))) {
          clearStoredPin();
          showToast("lock_pin_removed_toast");
          render();
          if (onRefresh) onRefresh();
        }
      });
      actions.appendChild(rmBtn);
    }
    row.appendChild(actions);
    sec.appendChild(row);
  };
  render();
  return sec;
}
