import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { matchSuspendedSession, restoreSuspendedSession, deleteSuspendedSession } from "./suspendedSessionService.js";

let promptShown = false;

export async function checkAndPromptSuspendedSession(tokens) {
  if (promptShown) return;
  const match = await matchSuspendedSession(tokens);
  if (!match) return;

  promptShown = true;
  showSuspendedSessionModal(match.session, match.matchingToken);
}

export function showSuspendedSessionModal(session, matchingToken) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-pin" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `📦 ${t("suspended_prompt_title")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  closeBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body text-center" });
  const d = session.date ? new Date(session.date) : new Date();
  const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  body.appendChild(createEl("p", { className: "text-muted mb-2 text-xs" }, t("suspended_prompt_desc", { date: dateStr })));

  const countBox = createEl("div", { className: "badge badge-primary mb-3" });
  countBox.textContent = `${session.itemCounts?.students || 0} Studenti • ${session.itemCounts?.notes || 0} Note`;
  body.appendChild(countBox);

  const actions = createEl("div", { className: "lock-choice-grid" });
  const restoreBtn = createEl("button", { className: "btn btn-primary" }, t("suspended_btn_restore"));
  restoreBtn.addEventListener("click", async () => {
    restoreBtn.disabled = true;
    const ok = await restoreSuspendedSession(session.id, matchingToken);
    if (ok) {
      showToast("suspended_restored_toast");
      overlay.classList.remove("active");
      clearEl(overlay);
      window.location.reload();
    }
  });

  const skipBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, t("suspended_btn_skip"));
  skipBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });

  const deleteBtn = createEl("button", { className: "btn btn-danger btn-sm" }, t("suspended_btn_delete"));
  deleteBtn.addEventListener("click", () => {
    if (window.confirm(t("suspended_delete_confirm"))) {
      deleteSuspendedSession(session.id);
      showToast("suspended_deleted_toast");
      overlay.classList.remove("active");
      clearEl(overlay);
    }
  });

  actions.appendChild(restoreBtn);
  actions.appendChild(skipBtn);
  actions.appendChild(deleteBtn);
  body.appendChild(actions);

  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
