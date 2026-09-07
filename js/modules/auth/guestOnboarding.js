import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isGuestMode } from "./guestMode.js";
import { showPairingModal } from "../sync/pairingModal.js";
import { showTeacherSetupModal } from "./teacherSetupModal.js";
import { getSuspendedSessions } from "./suspendedSessionService.js";

const KEY_ONBOARDED = "teacher_tools_guest_onboarded";

function createOptCard(icon, title, desc, onClick) {
  const card = createEl("div", { className: "splash-opt-card" });
  card.appendChild(createEl("span", { className: "splash-opt-icon" }, icon));
  const info = createEl("div", { className: "splash-opt-info" });
  info.appendChild(createEl("strong", {}, title));
  if (desc) info.appendChild(createEl("small", {}, desc));
  card.appendChild(info);
  card.addEventListener("click", onClick);
  return card;
}

export async function checkGuestOnboarding() {
  if (!isGuestMode() || sessionStorage.getItem(KEY_ONBOARDED)) return;
  if (document.getElementById("lock-screen-overlay")) return;
  if (document.getElementById("guest-onboarding-modal")) return;

  const { getPairedDevices } = await import("../sync/deviceMesh.js");
  const paired = await getPairedDevices();
  if (paired.length > 0) return;

  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { id: "guest-onboarding-modal", className: "modal-dialog modal-md" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `🏫 ${t("guest_onboard_title")}`));
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body text-center" });
  body.appendChild(createEl("p", { className: "text-muted" }, t("guest_onboard_prompt")));

  const options = createEl("div", { className: "splash-options" });
  const onDone = () => {
    sessionStorage.setItem(KEY_ONBOARDED, "true");
    overlay.classList.remove("active");
    clearEl(overlay);
  };

  options.appendChild(createOptCard("📄", t("guest_onboard_blank"), null, () => {
    onDone();
    showTeacherSetupModal();
  }));

  options.appendChild(createOptCard("📲", t("guest_onboard_sync"), null, () => {
    onDone();
    showPairingModal();
  }));

  const suspended = getSuspendedSessions();
  const count = suspended.length;
  const resTitle = count > 0 ? `${t("guest_onboard_restore")} (${count})` : t("guest_onboard_restore");
  const resDesc = count > 0 ? t("guest_onboard_restore_desc") : t("guest_onboard_no_suspended");

  options.appendChild(createOptCard("📦", resTitle, resDesc, () => {
    if (count === 0) {
      alert(t("guest_onboard_empty_alert"));
      return;
    }
    onDone();
    showPairingModal();
  }));

  body.appendChild(options);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}

export async function checkAppOnboarding() {
  if (isGuestMode()) return checkGuestOnboarding();
  const { checkFirstRunWizard } = await import("./firstRunWizard.js");
  return checkFirstRunWizard();
}

