import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getGDriveState, connectGDrive, disconnectGDrive, syncToGDrive } from "../../services/gdrive.js";

export function createCloudCard(onStateChanged) {
  const state = getGDriveState();
  const statusBadge = createEl("span", {
    className: `badge ${state.isConnected ? "badge-primary" : ""}`,
  }, state.isConnected ? `${t("settings_cloud_status_on")} ${state.email}` : t("settings_cloud_status_off"));

  const actionBtn = createEl("button", {
    className: `btn ${state.isConnected ? "btn-secondary" : "btn-primary"} btn-block`,
    i18n: state.isConnected ? "settings_cloud_disconnect" : "settings_cloud_connect",
    onClick: () => {
      if (state.isConnected) {
        disconnectGDrive();
        if (onStateChanged) onStateChanged();
      } else {
        connectGDrive();
      }
    },
  });

  const syncBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
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

  const buttons = state.isConnected ? [actionBtn, syncBtn] : [actionBtn];
  return createEl("div", { className: "card" }, [
    createEl("div", { className: "card-header" }, [
      createEl("h3", { className: "card-title", i18n: "settings_cloud_title" }),
      statusBadge,
    ]),
    createEl("p", { className: "section-subtitle", i18n: "settings_cloud_desc" }),
    createEl("div", { className: "pei-dim-tabs" }, buttons),
  ]);
}
