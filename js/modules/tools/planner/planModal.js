import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { savePlan } from "./planModel.js";
import { createPlanFields } from "./planModalFields.js";

export async function showPlanModal(options = {}) {
  const { plan = null, onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const cfg = await getSchoolConfig();
  const year = plan?.academicYear || cfg.activeYear;
  const classes = await getClasses(year);

  const modal = createEl("div", { className: "modal-dialog modal-lg" });
  const head = createEl("div", { className: "modal-header" });
  const titleKey = plan ? "planner_modal_plan_edit" : "planner_modal_plan_new";
  head.appendChild(createEl("h3", { className: "modal-title", i18n: titleKey }, t(titleKey)));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  const fields = createPlanFields(plan, classes);
  body.appendChild(fields.container);
  modal.appendChild(body);

  const foot = createEl("div", { className: "modal-footer" });
  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel" }, t("btn_cancel"));
  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save" }, t("btn_save"));
  foot.appendChild(cancelBtn); foot.appendChild(saveBtn);
  modal.appendChild(foot);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  saveBtn.addEventListener("click", async () => {
    await savePlan({
      id: plan?.id,
      title: fields.titleInp.value.trim() || t("planner_field_title"),
      subject: fields.subjInp.value.trim(),
      academicYear: year,
      period: fields.periodInp.value.trim(),
      classIds: fields.getSelectedClasses(),
      goals: fields.goalsInp.value.trim(),
      activities: fields.actInp.value.trim(),
      methods: fields.methInp.value.trim(),
      assessment: fields.assessInp.value.trim()
    });
    showToast("planner_plan_saved");
    closeModal();
    if (onSaved) onSaved();
  });

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
