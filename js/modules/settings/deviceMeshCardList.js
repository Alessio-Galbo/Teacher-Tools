import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getPairedDevices, updatePairedDeviceName, getDefaultDeviceName } from "../sync/deviceMesh.js";
import { unpairDevice, isPeerConnected } from "../sync/localSyncPeer.js";

export function createDeviceMeshList(onRefresh) {
  const list = createEl("div", { className: "mesh-peer-list" });

  const render = () => {
    getPairedDevices().then((devices) => {
      list.innerHTML = "";
      const myName = getDefaultDeviceName();
      const filtered = (devices || []).filter((d) => d?.name && d.name !== myName);
      if (!filtered.length) {
        list.appendChild(createEl("div", { className: "mesh-empty-state" },
          createEl("p", { className: "text-muted font-italic text-center py-2" }, t("mesh_no_devices_short"))
        ));
        return;
      }
      filtered.forEach((dev) => {
        const item = createEl("div", { className: "mesh-peer-item" });
        const info = createEl("div", { className: "mesh-peer-info" });
        const icon = dev.icon || (dev.isGuest ? "💻" : "📱");
        info.appendChild(createEl("span", { className: "mesh-peer-title" }, `${icon} ${dev.name || "Dispositivo"}`));
        if (dev.isGuest) {
          info.appendChild(createEl("span", { className: "badge badge-warning" }, t("mesh_temp_tag")));
        }
        const online = isPeerConnected(dev.name, filtered.length);
        const statusBadge = createEl("span", {
          className: `badge ${online ? "badge-success" : "badge-secondary"}`,
        }, online ? t("sync_status_connected_short") : t("sync_status_disconnected"));
        info.appendChild(statusBadge);
        item.appendChild(info);

        const actions = createEl("div", { className: "mesh-peer-actions" });
        const renameBtn = createEl("button", { className: "btn btn-secondary btn-sm", title: t("mesh_btn_rename") }, "✏️");
        renameBtn.addEventListener("click", async () => {
          const next = window.prompt(t("mesh_prompt_rename_peer"), dev.name);
          if (next?.trim()) {
            await updatePairedDeviceName(dev.id, next.trim());
            render();
          }
        });
        actions.appendChild(renameBtn);

        const delBtn = createEl("button", { className: "btn btn-secondary btn-sm", title: t("mesh_btn_remove") }, "✕");
        delBtn.addEventListener("click", async () => {
          const msg = t("mesh_remove_confirm_device", { name: dev.name || "" });
          if (!window.confirm(msg)) return;
          await unpairDevice(dev.id);
          render();
          if (onRefresh) onRefresh();
        });
        actions.appendChild(delBtn);
        item.appendChild(actions);
        list.appendChild(item);
      });
    });
  };

  render();
  window.addEventListener("syncStatusChanged", render);
  window.addEventListener("peerUnpaired", render);
  window.addEventListener("localPeerConnected", render);
  return list;
}
