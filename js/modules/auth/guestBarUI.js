import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isGuestMode, terminateGuestSession } from "./guestMode.js";

export function initGuestModeUI() {
  const existingBar = document.getElementById("guest-session-bar");
  const legacyHeader = document.getElementById("header-guest-controls");
  if (legacyHeader) legacyHeader.remove();

  if (!isGuestMode()) {
    if (existingBar) existingBar.remove();
    return;
  }
  if (existingBar) return;

  const header = document.querySelector(".app-header");
  if (!header) return;

  const bar = createEl("div", { id: "guest-session-bar", className: "guest-session-bar" });
  const badge = createEl("div", { className: "guest-bar-badge" });
  badge.appendChild(createEl("span", { className: "guest-bar-title" }, t("guest_bar_badge")));

  const actions = createEl("div", { className: "guest-bar-actions" });
  const lockBtn = createEl("button", {
    className: "btn btn-secondary btn-sm guest-bar-btn",
    id: "guest-lock-btn",
    title: t("guest_btn_lock"),
  });
  lockBtn.appendChild(createEl("span", {}, "🔒 "));
  lockBtn.appendChild(createEl("span", { className: "guest-btn-label" }, t("guest_btn_lock")));
  lockBtn.addEventListener("click", async () => {
    const { showLockScreen } = await import("./lockScreen.js");
    showLockScreen();
  });

  const exitBtn = createEl("button", {
    className: "btn btn-danger btn-sm guest-bar-btn",
    id: "guest-exit-btn",
    title: t("guest_btn_exit"),
  });
  exitBtn.appendChild(createEl("span", {}, "🚪 "));
  exitBtn.appendChild(createEl("span", { className: "guest-btn-label" }, t("guest_btn_exit")));
  exitBtn.addEventListener("click", () => {
    if (window.confirm(t("guest_exit_confirm"))) {
      terminateGuestSession();
    }
  });

  actions.appendChild(lockBtn);
  actions.appendChild(exitBtn);
  bar.appendChild(badge);
  bar.appendChild(actions);

  header.parentNode.insertBefore(bar, header.nextSibling);
}
