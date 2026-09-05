import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getSchools } from "../../../services/schoolService.js";
import { formatQuizAsText } from "./quizBuilder.js";
import { renderPrintSheet } from "./quizPrintSheetRenderer.js";
import { createQuizPrintOptionsBar, getQuizPrintPref } from "./quizPrintOptionsBar.js";

export async function showQuizPrintModal(meta, variantName, questions, initialScope = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const cfg = await getSchoolConfig();
  const schools = await getSchools();
  const activeSchool = schools.find((s) => s.id === cfg.activeSchoolId) || schools[0];
  const fullMeta = {
    ...meta,
    schoolName: activeSchool?.name || "",
    academicYear: cfg.activeYear || "",
    teacherName: cfg.teacherName || ""
  };

  const modal = createEl("div", { className: "modal-dialog modal-lg quiz-print-dialog" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "quiz_print_title" }, t("quiz_print_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  let curPref = getQuizPrintPref();
  if (initialScope) curPref.scope = initialScope;

  const toolbar = createEl("div", { className: "modal-toolbar quiz-print-toolbar" });
  const copyBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "quiz_copy_btn" }, t("quiz_copy_btn"));
  copyBtn.addEventListener("click", () => {
    const vars = (curPref.scope === "all" && meta.variants?.length > 1) ? meta.variants : [{ name: variantName, questions }];
    const txt = vars.map((v) => formatQuizAsText(fullMeta, v.questions, v.name)).join("\n\n--------------------------------\n\n");
    navigator.clipboard.writeText(txt).then(() => showToast("quiz_copied"));
  });
  const printBtn = createEl("button", { className: "btn btn-primary btn-sm", i18n: "quiz_print_btn" }, t("quiz_print_btn"));
  printBtn.addEventListener("click", () => window.print());
  toolbar.appendChild(copyBtn);
  toolbar.appendChild(printBtn);
  modal.appendChild(toolbar);

  const optBar = createQuizPrintOptionsBar((newPref) => { curPref = newPref; renderSheets(); });
  modal.appendChild(optBar);

  modal.appendChild(createEl("div", { className: "quiz-print-tip-banner", i18n: "quiz_print_tip" }, t("quiz_print_tip")));
  const body = createEl("div", { className: "modal-body quiz-print-modal-body" });
  modal.appendChild(body);

  const renderSheets = () => {
    clearEl(body);
    const isAll = curPref.scope === "all" && meta.variants?.length > 1;
    printBtn.textContent = isAll
      ? `🖨️ ${t("quiz_print_all_btn")} (${meta.variants.length})`
      : `📄 ${t("quiz_print_btn")}`;
    const vars = isAll ? meta.variants : [{ name: variantName, questions }];
    vars.forEach((v, idx) => {
      body.appendChild(renderPrintSheet(fullMeta, v.name, v.questions, curPref, idx < vars.length - 1));
    });
  };
  renderSheets();

  closeBtn.addEventListener("click", () => { overlay.classList.remove("active"); clearEl(overlay); });
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
