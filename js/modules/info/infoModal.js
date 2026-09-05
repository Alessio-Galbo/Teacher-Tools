import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { CURRENT_APP_VERSION } from "./changelogData.js";

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
  const versionRow = createEl("div", { className: "info-version-row" });
  const versionLabel = `${t("info_version_prefix")} ${CURRENT_APP_VERSION} (${t("info_version_stage")})`;
  versionRow.appendChild(createEl("span", { className: "badge badge-primary" }, versionLabel));
  const changelogBtn = createEl("button", {
    className: "btn btn-secondary btn-sm info-changelog-pill-btn",
    title: t("info_changelog_btn"),
    onClick: () => import("./changelogModal.js").then((m) => m.showChangelogModal(null, showInfoModal)),
  }, [
    createEl("span", {}, "📜 "),
    createEl("span", { i18n: "info_changelog_btn_short" }, t("info_changelog_btn_short")),
  ]);
  versionRow.appendChild(changelogBtn);
  appMeta.appendChild(versionRow);
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

  const feedbackCard = createEl("div", { className: "card info-section-card" });
  feedbackCard.appendChild(createEl("h4", { className: "card-title", i18n: "info_feedback_title" }, t("info_feedback_title")));
  feedbackCard.appendChild(createEl("p", { className: "card-desc text-muted", i18n: "info_feedback_desc" }, t("info_feedback_desc")));
  const issueBtn = createEl("a", {
    href: "https://github.com/Alessio-Galbo/Teacher-Tools/issues",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn btn-secondary btn-block",
    i18n: "info_feedback_btn"
  }, t("info_feedback_btn"));
  feedbackCard.appendChild(issueBtn);
  body.appendChild(feedbackCard);

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
