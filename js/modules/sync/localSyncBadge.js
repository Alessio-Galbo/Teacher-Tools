import { t } from "../../i18n.js";

export function initLocalSyncBadge() {
  const legacy = document.getElementById("header-sync-badge");
  if (legacy) legacy.remove();

  window.addEventListener("syncStatusChanged", (e) => {
    const detail = e.detail || {};
    if (detail.state === "synced") {
      const msg = `${t("sync_status_synced")} ${detail.count ? `(${detail.count})` : ""}`;
      console.log(`[LocalSync] ${msg}`);
    } else if (detail.state === "error") {
      console.warn(`[LocalSync Error] ${detail.error || ""}`);
    }
  });
}
