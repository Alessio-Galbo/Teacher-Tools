import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";

export function showSummaryModal(summaryText) {
  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) return;
  clearEl(modalContainer);

  const closeBtn = createEl("button", {
    className: "modal-close-btn",
    onClick: () => modalContainer.classList.remove("active"),
  }, "✕");

  const copyBtn = createEl("button", {
    className: "btn btn-primary btn-block",
    i18n: "pei_btn_copy",
    onClick: () => {
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast(t("pei_btn_copied"), "success");
      });
    },
  });

  const dialog = createEl("div", { className: "modal-dialog" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "card-title", i18n: "notes_summary_title" }),
      closeBtn,
    ]),
    createEl("div", { className: "pei-output-text" }, summaryText),
    createEl("div", { className: "form-group" }, [copyBtn]),
  ]);

  modalContainer.appendChild(dialog);
  modalContainer.classList.add("active");
}
