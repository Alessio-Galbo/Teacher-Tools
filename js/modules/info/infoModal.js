import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function showInfoModal() {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog info-modal-dialog" });

  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "info_modal_title" }, t("info_modal_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body info-modal-body" });

  const appMeta = createEl("div", { className: "info-meta-header" });
  appMeta.appendChild(createEl("span", { className: "badge badge-primary", i18n: "info_version" }, t("info_version")));
  appMeta.appendChild(createEl("p", { className: "card-desc", i18n: "info_desc" }, t("info_desc")));
  body.appendChild(appMeta);

  const privCard = createEl("div", { className: "card info-section-card" });
  privCard.appendChild(createEl("h4", { className: "card-title", i18n: "info_privacy_title" }, t("info_privacy_title")));
  privCard.appendChild(createEl("p", { className: "card-desc text-muted", i18n: "info_privacy_desc" }, t("info_privacy_desc")));
  body.appendChild(privCard);

  const discCard = createEl("div", { className: "card info-section-card" });
  discCard.appendChild(createEl("h4", { className: "card-title", i18n: "info_disclaimer_title" }, t("info_disclaimer_title")));
  discCard.appendChild(createEl("p", { className: "card-desc text-muted", i18n: "info_disclaimer_desc" }, t("info_disclaimer_desc")));
  body.appendChild(discCard);

  const supportCard = createEl("div", { className: "card info-support-card" });
  supportCard.appendChild(createEl("h4", { className: "card-title", i18n: "info_support_title" }, t("info_support_title")));
  const kofiBtn = createEl("a", {
    href: "https://ko-fi.com/devangel",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn btn-primary btn-block",
    i18n: "info_kofi_btn"
  }, t("info_kofi_btn"));
  supportCard.appendChild(kofiBtn);
  body.appendChild(supportCard);

  body.appendChild(createEl("p", { className: "text-muted text-center", i18n: "info_license" }, t("info_license")));

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
