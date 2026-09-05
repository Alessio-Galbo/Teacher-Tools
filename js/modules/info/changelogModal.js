import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { CHANGELOG_HISTORY } from "./changelogData.js";

export function showChangelogModal(highlightVersion = null, onBack = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog info-modal-dialog" });
  const head = createEl("div", { className: "modal-header" });
  const titleText = highlightVersion ? `${t("changelog_whats_new_title")} v${highlightVersion}` : t("changelog_modal_title");
  const titleGroup = createEl("div", { className: "modal-title-group" });
  if (onBack) {
    const backBtn = createEl("button", { className: "modal-close-btn", title: t("btn_back"), onClick: onBack }, "←");
    titleGroup.appendChild(backBtn);
  }
  titleGroup.appendChild(createEl("h3", { className: "modal-title" }, titleText));
  head.appendChild(titleGroup);

  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body info-modal-body" });
  const entries = highlightVersion
    ? CHANGELOG_HISTORY.filter((e) => e.version === highlightVersion)
    : CHANGELOG_HISTORY;

  entries.forEach((entry) => {
    const card = createEl("div", { className: "card info-section-card" });
    const h4 = createEl("h4", { className: "card-title" }, [
      createEl("span", { className: "badge badge-primary mr-1" }, `v${entry.version}`),
      createEl("span", { i18n: entry.titleKey }, ` ${t(entry.titleKey)}`),
    ]);
    card.appendChild(h4);
    const ul = createEl("ul", { className: "changelog-list" });
    entry.items.forEach((key) => {
      ul.appendChild(createEl("li", { i18n: key }, t(key)));
    });
    card.appendChild(ul);
    body.appendChild(card);
  });

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

  modal.appendChild(body);
  if (highlightVersion) {
    const footer = createEl("div", { className: "modal-footer quiz-modal-footer-centered" });
    const okBtn = createEl("button", { className: "btn btn-primary", i18n: "changelog_btn_got_it", onClick: closeModal }, t("changelog_btn_got_it"));
    footer.appendChild(okBtn);
    modal.appendChild(footer);
  }

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
