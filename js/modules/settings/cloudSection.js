import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getGDriveState, getStoredClientId, connectGDrive, disconnectGDrive, syncToGDrive } from "../../services/gdrive.js";

export function createCloudCard(onStateChanged) {
  const state = getGDriveState();
  const hasClientId = Boolean(getStoredClientId());
  const statusBadge = createEl("span", {
    className: `badge ${state.isConnected ? "badge-primary" : ""}`,
  }, state.isConnected ? `${t("settings_cloud_status_on")} ${state.email}` : t("settings_cloud_status_off"));

  let buttons = [];
  if (state.isConnected) {
    const disconnectBtn = createEl("button", {
      className: "btn btn-secondary btn-block",
      i18n: "settings_cloud_disconnect",
      onClick: () => { disconnectGDrive(); if (onStateChanged) onStateChanged(); },
    });
    const syncBtn = createEl("button", {
      className: "btn btn-primary btn-block",
      i18n: "settings_cloud_sync_now",
      onClick: async () => {
        try {
          await syncToGDrive();
          showToast(t("toast_backup_ok"), "success");
        } catch (err) {
          showToast(err.message, "error");
        }
      },
    });
    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-block",
      i18n: "settings_cloud_edit_config",
      onClick: () => import("./gdriveModal.js").then((m) => m.showGDriveModal(onStateChanged)),
    });
    buttons = [disconnectBtn, syncBtn, editBtn];
  } else if (hasClientId) {
    const connectBtn = createEl("button", {
      className: "btn btn-primary btn-block",
      i18n: "settings_cloud_connect",
      onClick: () => connectGDrive(onStateChanged),
    });
    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-block",
      i18n: "settings_cloud_edit_config",
      onClick: () => import("./gdriveModal.js").then((m) => m.showGDriveModal(onStateChanged)),
    });
    buttons = [connectBtn, editBtn];
  } else {
    const setupBtn = createEl("button", {
      className: "btn btn-primary btn-block",
      i18n: "settings_cloud_setup",
      onClick: () => import("./gdriveModal.js").then((m) => m.showGDriveModal(onStateChanged)),
    });
    buttons = [setupBtn];
  }

  return createEl("div", { className: "card" }, [
    createEl("div", { className: "card-header" }, [
      createEl("h3", { className: "card-title", i18n: "settings_cloud_title" }),
      statusBadge,
    ]),
    createEl("p", { className: "section-subtitle", i18n: "settings_cloud_desc" }),
    createEl("div", { className: "pei-dim-tabs" }, buttons),
  ]);
}
