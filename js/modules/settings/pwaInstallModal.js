import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function showPwaInstallModal() {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog pwa-install-dialog" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "pwa_modal_title" }, t("pwa_modal_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });

  const iosBox = createEl("div", { className: "pwa-guide-box ios-guide" });
  iosBox.appendChild(createEl("h4", { className: "pwa-guide-title", i18n: "pwa_ios_title" }, t("pwa_ios_title")));
  iosBox.appendChild(createEl("p", { i18n: "pwa_ios_step1" }, t("pwa_ios_step1")));
  iosBox.appendChild(createEl("p", { i18n: "pwa_ios_step2" }, t("pwa_ios_step2")));
  iosBox.appendChild(createEl("p", { i18n: "pwa_ios_step3" }, t("pwa_ios_step3")));
  body.appendChild(iosBox);

  const androidBox = createEl("div", { className: "pwa-guide-box android-guide" });
  androidBox.appendChild(createEl("h4", { className: "pwa-guide-title", i18n: "pwa_android_title" }, t("pwa_android_title")));
  androidBox.appendChild(createEl("p", { i18n: "pwa_android_step1" }, t("pwa_android_step1")));
  androidBox.appendChild(createEl("p", { i18n: "pwa_android_step2" }, t("pwa_android_step2")));
  body.appendChild(androidBox);

  modal.appendChild(body);
  closeBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
