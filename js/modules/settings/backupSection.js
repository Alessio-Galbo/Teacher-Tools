import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { shareToICloud, exportAllDataJSON, importDataJSON } from "../../services/backup.js";

export function createBackupSection() {
  const fileInput = createEl("input", {
    type: "file",
    accept: ".json",
    className: "hidden-input",
    onChange: async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await importDataJSON(file);
        showToast(t("toast_import_ok"), "success");
      } catch (err) {
        showToast(t("toast_import_err"), "error");
      }
    },
  });

  const shareBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: "settings_backup_share",
    onClick: async () => {
      await shareToICloud();
      showToast(t("toast_backup_ok"), "success");
    },
  });

  const exportBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: "settings_backup_export",
    onClick: async () => {
      await exportAllDataJSON();
      showToast(t("toast_backup_ok"), "success");
    },
  });

  const importBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: "settings_backup_import",
    onClick: () => fileInput.click(),
  });

  const hintEl = createEl("p", { className: "card-hint", i18n: "settings_backup_icloud_hint" });

  return createEl("div", { className: "card" }, [
    createEl("h3", { className: "card-title", i18n: "settings_backup_title" }),
    createEl("div", { className: "settings-backup-grid" }, [shareBtn, exportBtn, importBtn, fileInput]),
    hintEl,
  ]);
}

