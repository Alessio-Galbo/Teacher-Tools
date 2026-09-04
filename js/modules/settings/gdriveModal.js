import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getStoredClientId, setStoredClientId, connectGDrive } from "../../services/gdrive.js";

export function showGDriveModal(onSaved) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const inputEl = createEl("input", {
    className: "input-text",
    value: getStoredClientId(),
    i18nPlaceholder: "settings_cloud_client_id_placeholder",
  });

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "btn_save",
    onClick: () => {
      const val = inputEl.value.trim();
      setStoredClientId(val);
      showToast(t("toast_saved"), "success");
      closeModal();
      if (onSaved) onSaved();
      if (val) connectGDrive(onSaved);
    },
  });

  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "settings_cloud_config_title" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("div", { className: "cloud-guide-box" }, [
        createEl("strong", { i18n: "settings_cloud_guide_title" }),
        createEl("ul", { className: "cloud-guide-list" }, [
          createEl("li", { i18n: "settings_cloud_guide_step1" }),
          createEl("li", { i18n: "settings_cloud_guide_step2" }),
          createEl("li", { i18n: "settings_cloud_guide_step3" }),
          createEl("li", { i18n: "settings_cloud_guide_step4" }),
        ]),
      ]),
      createEl("p", { className: "app-subtitle", i18n: "settings_cloud_config_desc" }),
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "settings_cloud_client_id_label" }),
        inputEl,
      ]),
    ]),

    createEl("div", { className: "modal-toolbar" }, [cancelBtn, saveBtn]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
