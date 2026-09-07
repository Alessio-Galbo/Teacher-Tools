import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isGuestMode } from "../auth/guestMode.js";
import {
  isDirectorySyncSupported,
  getConnectedDirectories,
  connectSyncDirectory,
  disconnectSyncDirectory,
  autoSaveToDirectories,
} from "../sync/directorySync.js";

export function createDirectorySyncCard(onRefresh) {
  const card = createEl("div", { className: "card settings-card" });
  const head = createEl("div", { className: "card-header" });
  head.appendChild(createEl("h3", { className: "card-title" }, `📁 ${t("dir_sync_title")}`));
  card.appendChild(head);

  const body = createEl("div", { className: "card-body" });
  if (isGuestMode()) {
    body.appendChild(createEl("p", { className: "text-muted" }, t("dir_sync_guest_disabled")));
    card.appendChild(body);
    return card;
  }
  if (!isDirectorySyncSupported()) {
    body.appendChild(createEl("p", { className: "text-muted" }, t("dir_sync_unsupported")));
    card.appendChild(body);
    return card;
  }

  body.appendChild(createEl("p", { className: "text-muted" }, t("dir_sync_desc")));
  const listWrap = createEl("div", { className: "dir-sync-list" });

  getConnectedDirectories().then((dirs) => {
    if (!dirs.length) {
      listWrap.appendChild(createEl("p", { className: "text-muted font-italic" }, t("dir_sync_none")));
    } else {
      dirs.forEach((d) => {
        const row = createEl("div", { className: "dir-sync-item form-row" });
        row.appendChild(createEl("span", {}, `📁 ${d.name}`));
        const delBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, "✕");
        delBtn.addEventListener("click", async () => {
          await disconnectSyncDirectory(d.name);
          if (onRefresh) onRefresh();
        });
        row.appendChild(delBtn);
        listWrap.appendChild(row);
      });
    }
  });
  body.appendChild(listWrap);

  const btnRow = createEl("div", { className: "form-actions" });
  const addBtn = createEl("button", { className: "btn btn-primary btn-sm" }, `+ ${t("dir_sync_btn_add")}`);
  addBtn.addEventListener("click", async () => {
    try {
      await connectSyncDirectory();
      if (onRefresh) onRefresh();
    } catch (_) {}
  });

  const syncBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, `🔄 ${t("dir_sync_btn_now")}`);
  syncBtn.addEventListener("click", async () => {
    await autoSaveToDirectories();
    alert(t("dir_sync_saved"));
  });

  btnRow.appendChild(addBtn);
  btnRow.appendChild(syncBtn);
  body.appendChild(btnRow);
  card.appendChild(body);
  return card;
}
