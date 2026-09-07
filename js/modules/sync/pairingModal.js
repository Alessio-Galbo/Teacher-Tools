import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getMeshClusterToken, setMeshClusterToken, savePairedDevice } from "./deviceMesh.js";
import { encodeQRMatrix } from "./qrMatrix.js";
import { renderQrSvg } from "./qrSvg.js";
import { generatePassphrase } from "./cryptoUtils.js";
import { initHostSync } from "./localSyncPeer.js";

export async function showPairingModal(onSuccess) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-md pairing-modal" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `📱 ${t("pairing_modal_title")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  body.appendChild(createEl("p", { className: "pairing-desc" }, t("pairing_qr_desc")));

  const token = getMeshClusterToken();
  const pairUrl = `${window.location.origin}${window.location.pathname}#pair=${token}`;
  const matrix = encodeQRMatrix(pairUrl);
  const qrWrap = createEl("div", { className: "pairing-qr-wrap" });
  qrWrap.appendChild(renderQrSvg(matrix, 200));
  body.appendChild(qrWrap);

  const phraseWrap = createEl("div", { className: "pairing-phrase-box" });
  phraseWrap.appendChild(createEl("small", {}, t("pairing_alt_code")));
  phraseWrap.appendChild(createEl("div", { className: "badge badge-primary font-mono" }, generatePassphrase()));
  body.appendChild(phraseWrap);

  const manualWrap = createEl("div", { className: "pairing-manual-wrap" });
  const input = createEl("input", { className: "form-input", placeholder: t("pairing_input_placeholder") });
  const joinBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, t("pairing_btn_join"));
  joinBtn.addEventListener("click", async () => {
    const code = input.value.trim();
    if (code.length >= 6) {
      setMeshClusterToken(code);
      await savePairedDevice({ id: `dev_${Date.now()}`, name: t("mesh_paired_peer_label"), token: code, pairedAt: new Date().toISOString() });
      initHostSync();
      cleanup(); overlay.classList.remove("active"); clearEl(overlay);
      if (onSuccess) onSuccess();
    }
  });
  manualWrap.appendChild(input); manualWrap.appendChild(joinBtn);
  body.appendChild(manualWrap);
  modal.appendChild(body);

  const cleanup = () => { window.removeEventListener("localPeerConnected", onPeer); };

  const onPeer = (e) => {
    import("./pairingSuccessUI.js").then((m) => {
      m.renderPairingSuccess(body, e.detail?.name, () => {
        cleanup();
        overlay.classList.remove("active");
        clearEl(overlay);
        if (onSuccess) onSuccess();
      });
    });
  };

  window.addEventListener("localPeerConnected", onPeer, { once: true });
  closeBtn.addEventListener("click", () => { cleanup(); overlay.classList.remove("active"); clearEl(overlay); });
  overlay.appendChild(modal); overlay.classList.add("active");
  initHostSync();
}
