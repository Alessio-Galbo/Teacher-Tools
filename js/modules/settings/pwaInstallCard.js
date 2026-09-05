import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isStandalone, isInstallPromptReady, promptPwaInstall } from "../../services/pwaInstallService.js";

export function createPwaInstallCard(onRefresh) {
  const card = createEl("div", { className: "card pwa-install-card" });
  const head = createEl("div", { className: "card-header settings-card-header" });
  head.appendChild(createEl("h3", { className: "card-title", i18n: "pwa_title" }, t("pwa_title")));

  const standalone = isStandalone();
  const ready = isInstallPromptReady();
  const badgeClass = standalone ? "badge badge-success" : (ready ? "badge badge-primary" : "badge badge-secondary");
  const badgeKey = standalone ? "pwa_status_installed" : "pwa_status_ready";
  head.appendChild(createEl("span", { className: `${badgeClass} settings-status-badge`, i18n: badgeKey }, t(badgeKey)));
  card.appendChild(head);

  const body = createEl("div", { className: "card-body" });
  body.appendChild(createEl("p", { className: "card-desc", i18n: "pwa_desc" }, t("pwa_desc")));

  const actions = createEl("div", { className: "settings-actions pwa-install-actions" });
  const btnKey = standalone ? "pwa_already_installed" : "pwa_btn_install";
  const btn = createEl("button", {
    className: standalone ? "btn btn-secondary btn-block" : "btn btn-primary btn-block",
    i18n: btnKey,
    disabled: standalone
  }, t(btnKey));

  if (!standalone) {
    btn.addEventListener("click", () => promptPwaInstall());
  }
  actions.appendChild(btn);
  body.appendChild(actions);

  card.appendChild(body);
  return card;
}
