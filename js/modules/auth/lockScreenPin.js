import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";

const PIN_KEY = "teacher_tools_guest_pin";
export function getStoredPin() { return sessionStorage.getItem(PIN_KEY) || localStorage.getItem(PIN_KEY); }
export function setStoredPin(pin) { sessionStorage.setItem(PIN_KEY, pin); localStorage.setItem(PIN_KEY, pin); }
export function clearStoredPin() { sessionStorage.removeItem(PIN_KEY); localStorage.removeItem(PIN_KEY); }

export function renderPinForm(container, overlay, onDone, onRemove = null) {
  clearEl(container);
  const f1 = createEl("div", { className: "form-group" });
  f1.appendChild(createEl("label", { className: "form-label" }, t("lock_pin_set_label")));
  const i1 = createEl("input", { type: "password", inputMode: "numeric", maxLength: 4, className: "input-text lock-pin-input", placeholder: "••••" });
  f1.appendChild(i1);

  const f2 = createEl("div", { className: "form-group" });
  f2.appendChild(createEl("label", { className: "form-label" }, t("lock_pin_confirm_label")));
  const i2 = createEl("input", { type: "password", inputMode: "numeric", maxLength: 4, className: "input-text lock-pin-input", placeholder: "••••" });
  f2.appendChild(i2);

  const err = createEl("p", { className: "lock-error-text" });
  const actions = createEl("div", { className: "device-pin-actions mt-2" });
  const saveBtn = createEl("button", { className: "btn btn-primary" }, `💾 ${t("btn_save")}`);
  saveBtn.addEventListener("click", () => {
    const v1 = i1.value.trim(); const v2 = i2.value.trim();
    if (!/^\d{4}$/.test(v1)) { err.textContent = t("lock_pin_digits_only"); return; }
    if (v1 !== v2) { err.textContent = t("lock_pin_mismatch"); return; }
    setStoredPin(v1);
    showToast("lock_pin_saved_toast");
    if (overlay) { overlay.classList.remove("active"); clearEl(overlay); }
    if (onDone) onDone(v1);
  });
  actions.appendChild(saveBtn);

  if (getStoredPin() && onRemove) {
    const removeBtn = createEl("button", { className: "btn btn-danger btn-sm" }, `🗑️ ${t("lock_btn_remove_pin")}`);
    removeBtn.addEventListener("click", () => {
      if (window.confirm(t("lock_remove_pin_confirm"))) {
        clearStoredPin();
        showToast("lock_pin_removed_toast");
        if (overlay) { overlay.classList.remove("active"); clearEl(overlay); }
        onRemove();
      }
    });
    actions.appendChild(removeBtn);
  }
  container.appendChild(f1); container.appendChild(f2); container.appendChild(err); container.appendChild(actions);
}

export function showPinManageModal({ onSaved = null, onRemoved = null } = {}) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);
  const modal = createEl("div", { className: "modal-dialog modal-pin" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `🔢 ${t("lock_pin_title_short")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  closeBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });
  head.appendChild(closeBtn);
  modal.appendChild(head);
  const body = createEl("div", { className: "modal-body" });
  renderPinForm(body, overlay, onSaved, onRemoved);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}

export function createPinUnlockSection(onUnlock) {
  const wrap = createEl("div", { className: "lock-pin-box" });
  const pin = getStoredPin();
  const err = createEl("p", { className: "lock-error-text" });
  const input = createEl("input", { type: "password", inputMode: "numeric", maxLength: 4, className: "input-text lock-pin-input", placeholder: "••••" });
  const unlockBtn = createEl("button", { className: "btn btn-primary btn-sm" }, `🔓 ${t("lock_btn_unlock")}`);
  const handleVerify = () => { if (input.value.trim() === pin) onUnlock(); else err.textContent = t("lock_pin_wrong"); };
  unlockBtn.addEventListener("click", handleVerify);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") handleVerify(); });
  wrap.appendChild(input); wrap.appendChild(err); wrap.appendChild(unlockBtn);
  return wrap;
}
