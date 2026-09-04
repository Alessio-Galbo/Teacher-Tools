import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { createBackupSection } from "./backupSection.js";
import { createCloudCard } from "./cloudSection.js";
import { createThemeCard, createLanguageCard } from "./settingsView.js";
import { createTeacherProfileCard } from "./teacherProfileCard.js";

export function showSettingsModal() {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-lg settings-modal" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "settings_title" }, t("settings_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  const refreshModal = () => {
    clearEl(body);
    body.appendChild(createTeacherProfileCard(refreshModal));
    body.appendChild(createCloudCard(refreshModal));
    body.appendChild(createBackupSection());
    body.appendChild(createThemeCard(refreshModal));
    body.appendChild(createLanguageCard(refreshModal));
  };
  refreshModal();
  modal.appendChild(body);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
