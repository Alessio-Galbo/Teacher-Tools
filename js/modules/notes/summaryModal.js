import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { renderNotesDossierDOM } from "./notesDossierRenderer.js";

export function showSummaryModal(options) {
  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) return;
  clearEl(modalContainer);

  const isObj = typeof options === "object" && options !== null;
  const summaryText = isObj ? (options.summaryText || "") : String(options);
  const notes = isObj && Array.isArray(options.notes) ? options.notes : [];
  const scopeLabel = isObj ? (options.scopeLabel || "Generale") : "Generale";
  const activeYear = isObj ? (options.activeYear || "") : "";
  const schoolName = isObj ? (options.schoolName || "") : "";

  const closeBtn = createEl("button", {
    className: "modal-close-btn",
    onClick: () => modalContainer.classList.remove("active"),
  }, "✕");

  const copyBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "notes_btn_copy_summary",
    onClick: () => {
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast(t("toast_saved"), "success");
      });
    },
  });

  const printBtn = createEl("button", {
    className: "btn btn-secondary",
    i18n: "notes_dossier_print",
    onClick: () => window.print(),
  });

  const dossierDOM = isObj && notes.length >= 0
    ? renderNotesDossierDOM({ notes, scopeLabel, activeYear, schoolName })
    : createEl("div", { className: "pei-output-text" }, summaryText);

  const dialog = createEl("div", { className: "modal-dialog" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "card-title", i18n: "notes_summary_title" }),
      closeBtn,
    ]),
    createEl("div", { className: "modal-toolbar" }, [copyBtn, printBtn]),
    createEl("div", { className: "modal-body" }, [dossierDOM]),
  ]);

  modalContainer.appendChild(dialog);
  modalContainer.classList.add("active");
}
