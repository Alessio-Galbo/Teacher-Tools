import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getSnapshots, createSnapshot, restoreSnapshot } from "../../services/snapshot.js";

export function renderHistoryView(container) {
  clearEl(container);
  const header = createEl("div", { className: "section-header" }, [
    createEl("h2", { className: "section-title", i18n: "history_title" }),
    createEl("p", { className: "section-subtitle", i18n: "history_subtitle" }),
  ]);

  const createBtn = createEl("button", {
    className: "btn btn-primary btn-block",
    i18n: "history_btn_create",
    onClick: async () => {
      await createSnapshot("Snapshot Manuale");
      showToast(t("toast_saved"), "success");
      loadSnapshotsList();
    },
  });

  const listContainer = createEl("div", { id: "history-list" });

  container.appendChild(header);
  container.appendChild(createEl("div", { className: "form-group" }, [createBtn]));
  container.appendChild(listContainer);
  loadSnapshotsList();
}

async function loadSnapshotsList() {
  const listEl = document.getElementById("history-list");
  if (!listEl) return;
  clearEl(listEl);
  const snapshots = await getSnapshots();
  if (snapshots.length === 0) {
    listEl.appendChild(createEl("p", { className: "app-subtitle", i18n: "history_empty" }));
    return;
  }

  snapshots.forEach((snap) => {
    const notesCount = snap.data?.notes?.length || 0;
    const item = createEl("div", { className: "card note-item" }, [
      createEl("div", { className: "note-meta" }, [
        createEl("span", { className: "card-title" }, snap.label),
        createEl("span", { className: "note-date" }, new Date(snap.timestamp).toLocaleString()),
      ]),
      createEl("div", { className: "note-footer" }, [
        createEl("span", { className: "badge" }, `${notesCount} note`),
        createEl("button", {
          className: "btn btn-secondary btn-sm",
          i18n: "history_restore_btn",
          onClick: async () => {
            if (confirm(t("history_restore_confirm"))) {
              await restoreSnapshot(snap.id);
              showToast(t("history_restored"), "success");
              loadSnapshotsList();
            }
          },
        }),
      ]),
    ]);
    listEl.appendChild(item);
  });
}
