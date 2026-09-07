import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { DEVICE_PROFILES, setDeviceProfile } from "./deviceProfile.js";

export function setSplashProgress(percent, text) {
  const bar = document.getElementById("splash-progress-bar");
  if (bar) bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  const label = document.getElementById("splash-status-text");
  if (label && text) label.textContent = text;
}

export function dismissSplash() {
  const overlay = document.getElementById("app-splash");
  if (!overlay) return;
  overlay.style.pointerEvents = "none";
  overlay.classList.add("fade-out");
  setTimeout(() => overlay.remove(), 400);
}

export function showSplashModal(onComplete) {
  let selected = DEVICE_PROFILES.PERSONAL;
  const loader = document.getElementById("splash-loader-area");
  if (loader) loader.style.display = "none";
  let targetArea = document.getElementById("splash-interactive-area");

  if (!targetArea) {
    const overlay = createEl("div", { className: "splash-overlay direct-mode", id: "app-splash" });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) dismissSplash(); });
    const card = createEl("div", { className: "splash-card" });
    const header = createEl("div", { className: "splash-header" });
    header.appendChild(createEl("img", { src: "assets/icon-192.png", alt: "Teacher Tools", className: "splash-logo-img" }));
    header.appendChild(createEl("h2", { className: "splash-title" }, t("app_title")));
    header.appendChild(createEl("p", { className: "splash-subtitle" }, t("splash_subtitle")));
    card.appendChild(header);
    targetArea = createEl("div", { className: "splash-interactive-area", id: "splash-interactive-area" });
    card.appendChild(targetArea);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  } else {
    clearEl(targetArea);
  }

  targetArea.appendChild(createEl("p", { className: "splash-prompt" }, t("splash_prompt")));
  const options = createEl("div", { className: "splash-options" });

  const buildCard = (icon, titleKey, descKey, isGuest) => {
    const card = createEl("div", { className: `splash-opt-card ${!isGuest ? "active" : ""}` });
    card.appendChild(createEl("span", { className: "splash-opt-icon" }, icon));
    const info = createEl("div", { className: "splash-opt-info" });
    info.appendChild(createEl("strong", {}, t(titleKey)));
    info.appendChild(createEl("small", {}, t(descKey)));
    card.appendChild(info);
    return card;
  };

  const persCard = buildCard("💻", "splash_personal_title", "splash_personal_desc", false);
  const guestCard = buildCard("🏫", "splash_guest_title", "splash_guest_desc", true);
  options.appendChild(persCard);
  options.appendChild(guestCard);
  targetArea.appendChild(options);

  const rememberRow = createEl("label", { className: "splash-remember-row" });
  const rememberCheckbox = createEl("input", { type: "checkbox", checked: true });
  rememberRow.appendChild(rememberCheckbox);
  rememberRow.appendChild(createEl("span", {}, t("splash_remember")));
  targetArea.appendChild(rememberRow);

  const updateSelection = (isGuest) => {
    selected = isGuest ? DEVICE_PROFILES.GUEST : DEVICE_PROFILES.PERSONAL;
    persCard.classList.toggle("active", !isGuest);
    guestCard.classList.toggle("active", isGuest);
  };
  persCard.addEventListener("click", () => updateSelection(false));
  guestCard.addEventListener("click", () => updateSelection(true));

  const btn = createEl("button", { className: "btn btn-primary splash-btn" }, t("splash_btn_confirm"));
  btn.addEventListener("click", () => {
    const remember = rememberCheckbox.checked;
    if (selected === DEVICE_PROFILES.GUEST) sessionStorage.removeItem("teacher_tools_guest_onboarded");
    setDeviceProfile(selected, remember);
    dismissSplash();
    if (onComplete) onComplete(selected);
  });
  targetArea.appendChild(btn);
  void targetArea.offsetHeight;
  targetArea.classList.add("visible");
}
