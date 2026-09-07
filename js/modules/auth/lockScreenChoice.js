import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showPairingModal } from "../sync/pairingModal.js";
import { renderPinForm } from "./lockScreenPin.js";

export function showLockSetupChoiceModal(onLock) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);
  const modal = createEl("div", { className: "modal-dialog modal-md" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `🔒 ${t("lock_modal_title")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  closeBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  body.appendChild(createEl("p", { className: "text-muted mb-3" }, t("lock_modal_desc")));

  const grid = createEl("div", { className: "lock-choice-grid" });

  const pairCard = createEl("div", { className: "lock-choice-card" });
  pairCard.appendChild(createEl("span", { className: "lock-choice-icon" }, "📱"));
  const pairInfo = createEl("div", { className: "lock-choice-info" });
  pairInfo.appendChild(createEl("strong", {}, t("lock_choice_pair_title")));
  pairInfo.appendChild(createEl("small", {}, t("lock_choice_pair_desc")));
  pairCard.appendChild(pairInfo);
  pairCard.addEventListener("click", () => {
    overlay.classList.remove("active"); clearEl(overlay);
    showPairingModal(() => { if (onLock) onLock(); });
  });

  const pinCard = createEl("div", { className: "lock-choice-card" });
  pinCard.appendChild(createEl("span", { className: "lock-choice-icon" }, "🔢"));
  const pinInfo = createEl("div", { className: "lock-choice-info" });
  pinInfo.appendChild(createEl("strong", {}, t("lock_choice_pin_title")));
  pinInfo.appendChild(createEl("small", {}, t("lock_choice_pin_desc")));
  pinCard.appendChild(pinInfo);
  pinCard.addEventListener("click", () => {
    renderPinForm(body, overlay, () => { if (onLock) onLock(); });
  });

  grid.appendChild(pairCard);
  grid.appendChild(pinCard);
  body.appendChild(grid);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
