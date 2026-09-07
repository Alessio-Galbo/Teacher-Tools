import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getDeviceProfile, setDeviceProfile, DEVICE_PROFILES } from "../auth/deviceProfile.js";
import { getMyDeviceDisplay, setMyDeviceNickname, detectDeviceDetails } from "../sync/deviceInfo.js";
import { broadcastHello } from "../sync/localSyncPeer.js";
import { createDeviceTeacherSection } from "./deviceTeacherSection.js";
import { createDevicePinSection } from "./devicePinSection.js";

export function createCurrentDeviceBox(onRefresh, hasPeers = false) {
  const isGuest = getDeviceProfile() === DEVICE_PROFILES.GUEST;
  const devDet = detectDeviceDetails();
  const box = createEl("div", { className: "device-profile-box" });

  const topRow = createEl("div", { className: "device-profile-header" });
  const mainMeta = createEl("div", { className: "device-profile-main" });
  mainMeta.appendChild(createEl("span", { className: "device-profile-icon" }, isGuest ? "💻" : devDet.icon));
  const nameSpan = createEl("span", { className: "device-profile-name" }, getMyDeviceDisplay());
  mainMeta.appendChild(nameSpan);
  topRow.appendChild(mainMeta);

  const actions = createEl("div", { className: "device-profile-actions" });
  const renameBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, `✏️ ${t("mesh_btn_rename")}`);
  renameBtn.addEventListener("click", () => {
    const next = window.prompt(t("mesh_prompt_rename"), getMyDeviceDisplay());
    if (next?.trim()) {
      setMyDeviceNickname(next.trim());
      nameSpan.textContent = getMyDeviceDisplay();
      broadcastHello();
    }
  });
  actions.appendChild(renameBtn);

  if (hasPeers) {
    const disconnectBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, `🔌 ${t("mesh_btn_disconnect")}`);
    disconnectBtn.addEventListener("click", async () => {
      if (!window.confirm(t("mesh_disconnect_confirm"))) return;
      const { leaveMeshCluster } = await import("../sync/deviceMesh.js");
      await leaveMeshCluster();
      if (onRefresh) onRefresh();
    });
    actions.appendChild(disconnectBtn);
  }
  topRow.appendChild(actions);
  box.appendChild(topRow);

  const modeRow = createEl("div", { className: "device-mode-row" });
  const modeInfo = createEl("div", { className: "device-mode-info" });
  modeInfo.appendChild(createEl("span", { className: "text-muted" }, t("settings_profile_access_label")));
  const modeBadge = createEl("span", {
    className: `badge ${isGuest ? "badge-warning" : "badge-primary"}`,
  });
  const devIcon = isGuest ? "🏫" : "💻";
  modeBadge.appendChild(createEl("span", { className: "mode-text-desktop" }, `${devIcon} ${isGuest ? t("settings_profile_guest_short") : t("settings_profile_personal_short")}`));
  modeBadge.appendChild(createEl("span", { className: "mode-text-mobile" }, `${devIcon} ${isGuest ? t("settings_profile_guest_pill") : t("settings_profile_personal_pill")}`));
  modeInfo.appendChild(modeBadge);
  modeRow.appendChild(modeInfo);

  const switchBtn = createEl("button", { className: "btn btn-secondary btn-sm", title: t("settings_profile_switch_mode") });
  switchBtn.appendChild(createEl("span", { className: "btn-icon" }, "🔄"));
  switchBtn.appendChild(createEl("span", { className: "btn-text-mode" }, ` ${t("settings_profile_switch_mode")}`));
  switchBtn.addEventListener("click", () => {
    const targetGuest = !isGuest;
    const confirmMsg = targetGuest ? t("settings_profile_to_guest_confirm") : t("settings_profile_to_personal_confirm");
    if (!window.confirm(confirmMsg)) return;
    sessionStorage.setItem("teacher_tools_guest_onboarded", "true");
    setDeviceProfile(targetGuest ? DEVICE_PROFILES.GUEST : DEVICE_PROFILES.PERSONAL, true);
    if (onRefresh) onRefresh();
  });
  modeRow.appendChild(switchBtn);
  box.appendChild(modeRow);
  box.appendChild(createDeviceTeacherSection(onRefresh));
  box.appendChild(createDevicePinSection(onRefresh));

  return box;
}

export const createDeviceProfileCard = createCurrentDeviceBox;
