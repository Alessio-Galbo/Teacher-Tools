// Indicatore discreto «Aggiornamento pronto» nell'intestazione: la nuova versione si applica solo al tocco dell'utente.
import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { showToast } from "../utils/toast.js";

const SVG_NS = "http://www.w3.org/2000/svg";
let button = null;
let accepted = false;

function buildIcon() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "update-ready-icon");
  svg.setAttribute("aria-hidden", "true");
  [["path", "d", "M21 12a9 9 0 1 1-2.64-6.36"], ["polyline", "points", "21 3 21 9 15 9"]].forEach(([tag, attr, val]) => {
    const el = document.createElementNS(SVG_NS, tag);
    el.setAttribute(attr, val);
    svg.appendChild(el);
  });
  return svg;
}

function showIndicator(onTap) {
  const actions = document.querySelector(".header-right-actions");
  if (!actions) return;
  if (!button) {
    button = createEl("button", {
      id: "header-update-btn", className: "header-settings-btn update-ready-btn", type: "button",
      title: t("update_ready_hint"), "aria-label": t("update_ready"),
    }, [buildIcon(), createEl("span", { className: "update-ready-dot" })]);
    actions.insertBefore(button, actions.firstChild);
  }
  button.onclick = onTap;
}

function applyUpdate(worker) {
  accepted = true;
  showToast("update_applying");
  worker.postMessage({ type: "SKIP_WAITING" });
}

function watchInstalling(reg) {
  const worker = reg.installing;
  if (!worker) return;
  worker.addEventListener("statechange", () => {
    if (worker.state === "installed" && navigator.serviceWorker.controller) showIndicator(() => applyUpdate(worker));
  });
}

export function initSwUpdateIndicator(reg) {
  if (reg.waiting && navigator.serviceWorker.controller) showIndicator(() => applyUpdate(reg.waiting));
  reg.addEventListener("updatefound", () => watchInstalling(reg));
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) { hadController = true; return; }
    if (accepted) { window.location.reload(); return; }
    // Aggiornata da un'altra finestra: non ricaricare una pagina in uso, aspetta il tocco.
    showIndicator(() => window.location.reload());
  });
}
