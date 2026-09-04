import { createEl } from "../../utils/dom.js";

export function createPeiOutputBox({ onCopy, onDossier }) {
  const outputBox = createEl("div", { className: "pei-output-box" }, [
    createEl("h3", { className: "card-title", i18n: "pei_preview_title" }),
    createEl("div", { className: "pei-output-text", id: "pei-output-text" }),
    createEl("div", { className: "pei-actions" }, [
      createEl("button", { className: "btn btn-primary btn-block", i18n: "pei_btn_copy", onClick: onCopy }),
    ]),
  ]);

  const dossierBtn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: "pei_btn_full",
    onClick: onDossier,
  });

  return [outputBox, createEl("div", { className: "form-group" }, [dossierBtn])];
}
