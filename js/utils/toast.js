import { createEl } from "./dom.js";

let container = null;

export function showToast(message, type = "info", duration = 2500) {
  if (!container) {
    container = document.getElementById("toast-container");
    if (!container) return;
  }

  const toast = createEl("div", {
    className: `toast toast-${type}`,
  }, message);

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, duration);
}
