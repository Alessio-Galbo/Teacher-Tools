import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getPairedDevices } from "../sync/deviceMesh.js";
import { encodeQRMatrix } from "../sync/qrMatrix.js";
import { renderQrSvg } from "../sync/qrSvg.js";
import { getStoredPin, createPinUnlockSection } from "./lockScreenPin.js";
import { getSchoolConfig } from "../../services/schoolConfigService.js";

let savedMainNodes = [];
let savedBarNodes = [];

export async function showLockScreen() {
  if (document.getElementById("lock-screen-overlay")) return;
  const paired = await getPairedDevices();
  if (paired.length > 0 || getStoredPin()) { activateLockScreen(); return; }
  const { showLockSetupChoiceModal } = await import("./lockScreenChoice.js");
  showLockSetupChoiceModal(() => activateLockScreen());
}

function renderMethodsCard(hasPhone, hasPin) {
  const box = createEl("div", { className: "lock-methods-card" });
  box.appendChild(createEl("div", { className: "lock-methods-title" }, t("lock_unlock_methods_title")));
  const list = createEl("ul", { className: "lock-methods-list" });
  let idx = 1;
  if (hasPhone) {
    list.appendChild(createEl("li", {}, `${idx++}. ${t("lock_unlock_method_qr")}`));
    list.appendChild(createEl("li", {}, `${idx++}. ${t("lock_unlock_method_notify")}`));
  }
  if (hasPin) list.appendChild(createEl("li", {}, `${idx++}. ${t("lock_unlock_method_pin")}`));
  box.appendChild(list);
  return box;
}

async function handleTerminateSession() {
  if (!window.confirm(t("lock_terminate_confirm"))) return;
  try {
    const { saveSuspendedLockSession } = await import("./suspendedSessionService.js");
    await saveSuspendedLockSession();
  } catch (_) {}
  const { terminateGuestSession } = await import("./guestMode.js");
  await terminateGuestSession();
}

export async function activateLockScreen() {
  if (document.getElementById("lock-screen-overlay")) return;
  const mainEl = document.getElementById("app-main");
  const barEl = document.getElementById("student-bar-container");
  if (mainEl?.childNodes.length) { savedMainNodes = Array.from(mainEl.childNodes); savedMainNodes.forEach((n) => mainEl.removeChild(n)); }
  if (barEl?.childNodes.length) { savedBarNodes = Array.from(barEl.childNodes); savedBarNodes.forEach((n) => barEl.removeChild(n)); }

  const overlay = createEl("div", { id: "lock-screen-overlay", className: "lock-screen-overlay" });
  const card = createEl("div", { className: "lock-screen-card" });
  card.appendChild(createEl("div", { className: "lock-icon" }, "🔒"));
  card.appendChild(createEl("h2", { className: "lock-title" }, t("lock_standby_title")));

  const cfg = await getSchoolConfig().catch(() => ({}));
  const teacherText = cfg?.teacherName ? `👤 ${t("lock_teacher_label")}: ${cfg.teacherName}` : `🔒 ${t("lock_session_generic")}`;
  card.appendChild(createEl("div", { className: "lock-teacher-badge" }, teacherText));
  import("../sync/localSyncPeer.js").then((m) => m.broadcastLockStatus(true)).catch(() => {});

  const unlock = () => {
    if (mainEl && savedMainNodes.length) { savedMainNodes.forEach((n) => mainEl.appendChild(n)); savedMainNodes = []; }
    if (barEl && savedBarNodes.length) { savedBarNodes.forEach((n) => barEl.appendChild(n)); savedBarNodes = []; }
    import("../sync/localSyncPeer.js").then((m) => m.broadcastLockStatus(false)).catch(() => {});
    overlay.classList.add("fade-out");
    setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 250);
  };
  window.addEventListener("remoteUnlockReceived", unlock, { once: true });

  const paired = await getPairedDevices();
  const hasPin = Boolean(getStoredPin());
  if (paired.length > 0) {
    const token = localStorage.getItem("tt_cluster_mesh_token") || "mesh_guest";
    const unlockUrl = `${window.location.origin}${window.location.pathname}#unlock=${token}`;
    card.appendChild(renderQrSvg(encodeQRMatrix(unlockUrl), 150));
  }
  card.appendChild(renderMethodsCard(paired.length > 0, hasPin));
  if (hasPin || !paired.length) card.appendChild(createPinUnlockSection(unlock));

  const exitBtn = createEl("button", { className: "btn btn-danger btn-sm lock-exit-btn", id: "lock-screen-exit-btn" }, `🚪 ${t("lock_btn_terminate_session")}`);
  exitBtn.addEventListener("click", handleTerminateSession);
  card.appendChild(exitBtn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}
