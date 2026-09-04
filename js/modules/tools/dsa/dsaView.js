import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { simplifyTextToSentences, highlightConnectives } from "./dsaFormatter.js";
import { createDsaControls } from "./dsaControls.js";
import { showDsaPrintModal } from "./dsaPrintModal.js";

export function renderDsaView(container) {
  clearEl(container);
  let isSimplified = true;
  let currentSettings = { font: "sans-serif", size: "size-normal", spacing: "spacing-normal", contrast: "contrast-default" };

  const inputCard = createEl("div", { className: "card dsa-editor-card" });
  inputCard.appendChild(createEl("h3", { className: "card-title" }, "1. Testo da Adattare"));
  const inputArea = createEl("textarea", {
    className: "textarea-input textarea-large dsa-input-textarea",
    placeholder: t("dsa_input_placeholder")
  });
  inputCard.appendChild(inputArea);

  const controls = createDsaControls((newSettings) => {
    currentSettings = { ...currentSettings, ...newSettings };
    renderContent();
  });
  inputCard.appendChild(controls);

  const actionRow = createEl("div", { className: "dsa-action-row" });
  const toggleBtn = createEl("button", { className: "btn btn-secondary", i18n: "dsa_btn_simplify" }, t("dsa_btn_simplify"));
  toggleBtn.addEventListener("click", () => {
    isSimplified = !isSimplified;
    toggleBtn.textContent = isSimplified ? t("dsa_btn_original") : t("dsa_btn_simplify");
    renderContent();
  });
  const copyBtn = createEl("button", { className: "btn btn-secondary", i18n: "dsa_copy_btn" }, t("dsa_copy_btn"));
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(previewBox.innerText || "").then(() => showToast("dsa_copied"));
  });
  const printBtn = createEl("button", { className: "btn btn-primary", i18n: "dsa_print_btn" }, t("dsa_print_btn"));
  printBtn.addEventListener("click", () => {
    const sentences = simplifyTextToSentences(inputArea.value);
    showDsaPrintModal({ sentences: sentences.length ? sentences : [inputArea.value], isSimplified, settings: currentSettings });
  });

  actionRow.appendChild(toggleBtn); actionRow.appendChild(copyBtn); actionRow.appendChild(printBtn);
  inputCard.appendChild(actionRow);
  container.appendChild(inputCard);

  const previewCard = createEl("div", { className: "card dsa-preview-card" });
  const previewHead = createEl("div", { className: "card-header" });
  previewHead.appendChild(createEl("h3", { className: "card-title" }, "2. Anteprima Scheda di Lettura"));
  previewHead.appendChild(createEl("span", { className: "badge badge-primary" }, "Accessibile"));
  previewCard.appendChild(previewHead);

  const previewBox = createEl("div", { className: "dsa-preview-box" });
  previewCard.appendChild(previewBox);
  container.appendChild(previewCard);

  const renderContent = () => {
    clearEl(previewBox);
    previewBox.className = `dsa-preview-box font-${currentSettings.font} ${currentSettings.size} ${currentSettings.spacing} ${currentSettings.contrast}`;
    const sentences = simplifyTextToSentences(inputArea.value);
    if (sentences.length === 0) {
      previewBox.appendChild(createEl("p", { className: "text-muted" }, t("dsa_input_placeholder")));
      return;
    }
    sentences.forEach((s) => {
      const el = createEl("div", { className: isSimplified ? "dsa-chunk" : "dsa-sentence" });
      el.innerHTML = isSimplified ? `<span class="dsa-bullet">▸</span> ${highlightConnectives(s)}` : highlightConnectives(s);
      previewBox.appendChild(el);
    });
  };

  inputArea.addEventListener("input", renderContent);
  renderContent();
}
