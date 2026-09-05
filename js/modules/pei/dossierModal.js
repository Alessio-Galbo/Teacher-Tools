import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { renderDossierDOM } from "./dossierRenderer.js";
import { buildFullDossierText } from "./dossierText.js";
import { getActiveStudent } from "../../services/studentService.js";
import { getActiveSchool, getSchoolConfig } from "../../services/schoolService.js";
import { formatSchoolFullName } from "../school/schoolLocationHelper.js";

export async function showDossierModal(savedSelections) {
  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) return;
  clearEl(modalContainer);

  const [activeSt, activeSchool, schoolConfig] = await Promise.all([
    getActiveStudent(),
    getActiveSchool(),
    getSchoolConfig(),
  ]);
  const studentName = activeSt ? `${activeSt.name}${activeSt.className ? " (" + activeSt.className + ")" : ""}` : "";
  const schoolName = activeSchool ? formatSchoolFullName(activeSchool) : "";
  const schoolType = activeSchool?.schoolType || "secondaria_2";
  const activeYear = schoolConfig?.activeYear || "";

  const { getEffectiveDimension } = await import("./peiPhraseService.js");
  const [d1, d2, d3, d4] = await Promise.all([
    getEffectiveDimension("dim1"),
    getEffectiveDimension("dim2"),
    getEffectiveDimension("dim3"),
    getEffectiveDimension("dim4"),
  ]);
  const effectiveDims = { dim1: d1, dim2: d2, dim3: d3, dim4: d4 };
  const dossierData = { selections: savedSelections, studentName, effectiveDims, schoolName, schoolType, activeYear };

  const closeBtn = createEl("button", {
    className: "modal-close-btn",
    onClick: () => modalContainer.classList.remove("active"),
  }, "✕");

  const copyBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "pei_full_copy",
    onClick: () => {
      const text = buildFullDossierText(dossierData);
      navigator.clipboard.writeText(text).then(() => {
        showToast(t("pei_btn_copied"), "success");
      });
    },
  });

  const printBtn = createEl("button", {
    className: "btn btn-secondary",
    i18n: "pei_full_print",
    onClick: () => window.print(),
  });

  const header = createEl("div", { className: "modal-header" }, [
    createEl("h3", { className: "card-title", i18n: "pei_full_title" }),
    closeBtn,
  ]);

  const toolbar = createEl("div", { className: "modal-toolbar" }, [copyBtn, printBtn]);
  const body = createEl("div", { className: "modal-body" }, [renderDossierDOM(dossierData)]);

  const dialog = createEl("div", { className: "modal-dialog" }, [header, toolbar, body]);

  modalContainer.appendChild(dialog);
  modalContainer.classList.add("active");
}
