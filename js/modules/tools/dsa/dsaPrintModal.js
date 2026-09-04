import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getSchools } from "../../../services/schoolService.js";
import { highlightConnectives } from "./dsaFormatter.js";

export async function showDsaPrintModal({ sentences, isSimplified, settings }) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const cfg = await getSchoolConfig();
  const schools = await getSchools();
  const activeSchool = schools.find((s) => s.id === cfg.activeSchoolId) || schools[0];
  const schoolName = activeSchool?.name || "ISTITUTO SCOLASTICO";
  const academicYear = cfg.activeYear || "";

  const modal = createEl("div", { className: "modal-dialog modal-lg dsa-print-dialog" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "dsa_print_title" }, t("dsa_print_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const toolbar = createEl("div", { className: "modal-toolbar quiz-print-toolbar" });
  const copyBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "dsa_copy_btn" }, t("dsa_copy_btn"));
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(sentences.join("\n")).then(() => showToast("dsa_copied"));
  });
  const printBtn = createEl("button", { className: "btn btn-primary btn-sm", i18n: "dsa_print_btn" }, t("dsa_print_btn"));
  printBtn.addEventListener("click", () => window.print());
  toolbar.appendChild(copyBtn);
  toolbar.appendChild(printBtn);
  modal.appendChild(toolbar);

  const tip = createEl("div", { className: "quiz-print-tip-banner", i18n: "quiz_print_tip" }, t("quiz_print_tip"));
  modal.appendChild(tip);

  const body = createEl("div", { className: "modal-body dsa-print-modal-body" });
  const sheet = createEl("div", { className: `dsa-print-sheet font-${settings.font || 'sans-serif'}` });

  const headBox = createEl("div", { className: "quiz-print-header-box" });
  const instRow = createEl("div", { className: "quiz-print-inst-row" });
  instRow.appendChild(createEl("span", { className: "quiz-print-school" }, schoolName.toUpperCase()));
  instRow.appendChild(createEl("span", { className: "quiz-print-year" }, `A.S. ${academicYear}`));
  headBox.appendChild(instRow);

  const mainRow = createEl("div", { className: "quiz-print-main-row" });
  mainRow.appendChild(createEl("h1", { className: "quiz-print-title" }, t("dsa_print_title")));
  headBox.appendChild(mainRow);

  const metaTable = createEl("div", { className: "quiz-print-meta-table" });
  const r1 = createEl("div", { className: "quiz-print-meta-row" });
  r1.appendChild(createEl("div", { className: "quiz-print-meta-cell" }, `${t("quiz_print_student")} ________________________________________`));
  r1.appendChild(createEl("div", { className: "quiz-print-meta-cell" }, `${t("quiz_print_class")} _____________  ${t("quiz_print_date")} _____________`));
  metaTable.appendChild(r1);
  headBox.appendChild(metaTable);
  sheet.appendChild(headBox);

  const contentBox = createEl("div", { className: `dsa-print-content ${settings.spacing || 'spacing-wide'}` });
  sentences.forEach((s) => {
    const el = createEl("div", { className: isSimplified ? "dsa-print-chunk" : "dsa-sentence" });
    el.innerHTML = isSimplified ? `<span class="dsa-print-bullet">▸</span> ${highlightConnectives(s)}` : highlightConnectives(s);
    contentBox.appendChild(el);
  });
  sheet.appendChild(contentBox);
  body.appendChild(sheet);
  modal.appendChild(body);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
