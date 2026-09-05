import { showToast } from "../utils/toast.js";
import { showPwaInstallModal } from "../modules/settings/pwaInstallModal.js";

let deferredPrompt = null;

export function initPwaInstall() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new CustomEvent("pwaInstallStateChanged"));
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent("pwaInstallStateChanged"));
  });
}

export function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export function isInstallPromptReady() {
  return !!deferredPrompt;
}

export async function promptPwaInstall() {
  if (isStandalone()) {
    showToast("pwa_already_installed");
    return;
  }
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      deferredPrompt = null;
      window.dispatchEvent(new CustomEvent("pwaInstallStateChanged"));
    }
    return;
  }
  showPwaInstallModal();
}
