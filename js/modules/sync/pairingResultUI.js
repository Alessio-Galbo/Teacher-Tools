import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSyncItemPills } from "./syncSummaryFormatter.js";

export function renderSyncResults(container, res, onFinish) {
  const box = createEl("div", { className: "pairing-result-box text-center" });
  box.appendChild(createEl("div", { className: "sync-result-icon mb-1" }, "✅"));
  box.appendChild(createEl("h3", { className: "text-success mb-2 font-bold" }, t("sync_success_toast")));

  const pills = getSyncItemPills(res?.counts || {});
  if (pills.length > 0) {
    const card = createEl("div", { className: "sync-summary-card mb-3" });
    card.appendChild(createEl("div", { className: "sync-summary-card-title mb-2 text-muted" }, t("sync_summary_card_title")));
    const grid = createEl("div", { className: "sync-summary-pills-grid" });
    for (const p of pills) {
      const pill = createEl("div", { className: "sync-summary-pill" });
      pill.appendChild(createEl("span", { className: "sync-pill-icon" }, p.icon));
      pill.appendChild(createEl("span", { className: "sync-pill-label" }, p.label));
      grid.appendChild(pill);
    }
    card.appendChild(grid);
    box.appendChild(card);
  } else {
    const alignedBox = createEl("div", { className: "sync-aligned-box mb-3" });
    alignedBox.appendChild(createEl("span", { className: "sync-aligned-icon" }, "✨"));
    alignedBox.appendChild(createEl("span", { className: "sync-aligned-text font-semibold" }, t("sync_summary_no_changes")));
    box.appendChild(alignedBox);
  }

  const startBtn = createEl("button", { className: "btn btn-primary w-100" }, t("guest_btn_start_using"));
  startBtn.addEventListener("click", onFinish);
  box.appendChild(startBtn);

  container.appendChild(box);
}
