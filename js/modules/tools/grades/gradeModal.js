import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { getStudents } from "../../../services/studentService.js";
import { saveAssessment } from "./gradesModel.js";
import { renderRoster, extractRosterData } from "./gradeModalRoster.js";
import { createGradeModalFields } from "./gradeModalFields.js";

export async function showGradeModal(options = {}) {
  const { assessment = null, onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const cfg = await getSchoolConfig();
  const year = assessment ? assessment.academicYear : cfg.activeYear;
  const classes = await getClasses(year);
  const students = await getStudents(year);

  const titleText = assessment ? t("grades_modal_title_edit") : t("grades_modal_title_new");
  const modal = createEl("div", { className: "modal-dialog modal-lg grades-modal" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, titleText));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  const fields = createGradeModalFields(assessment, classes);
  body.appendChild(fields.grid);

  const rosterContainer = createEl("div", { className: "grades-roster-container" });
  body.appendChild(rosterContainer);
  modal.appendChild(body);

  const updateRoster = () => {
    const selClassId = fields.classSel.value;
    const filtered = students.filter((s) => s.classId === selClassId);
    renderRoster(rosterContainer, filtered, assessment?.grades || {});
  };
  fields.classSel.addEventListener("change", updateRoster);
  updateRoster();

  const foot = createEl("div", { className: "modal-footer" });
  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel" }, t("btn_cancel"));
  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save" }, t("btn_save"));
  foot.appendChild(cancelBtn); foot.appendChild(saveBtn);
  modal.appendChild(foot);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  saveBtn.addEventListener("click", async () => {
    const grades = extractRosterData(rosterContainer);
    await saveAssessment({
      id: assessment?.id,
      title: fields.titleInp.value.trim() || t("grades_title"),
      subject: fields.subjInp.value.trim(),
      date: fields.dateInp.value,
      classId: fields.classSel.value,
      schoolId: classes.find((c) => c.id === fields.classSel.value)?.schoolId || "",
      academicYear: year,
      type: fields.typeSel.value,
      weight: parseFloat(fields.weightInp.value) || 1.0,
      grades
    });
    showToast("toast_saved");
    closeModal();
    if (onSaved) onSaved();
  });

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
