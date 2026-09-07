import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { updateSchoolConfig, getSchoolConfig } from "../../services/schoolConfigService.js";

export function showTeacherSetupModal(onComplete = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-md teacher-setup-modal" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `🏫 ${t("guest_setup_title")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  body.appendChild(createEl("p", { className: "text-muted mb-3 text-sm" }, t("guest_setup_desc")));

  const form = createEl("div", { className: "teacher-setup-form" });
  const nameInp = createEl("input", {
    type: "text", className: "input-text",
    placeholder: t("settings_teacher_name_placeholder")
  });
  const subjInp = createEl("input", {
    type: "text", className: "input-text",
    placeholder: t("settings_teacher_subject_placeholder")
  });
  const startBtn = createEl("button", { className: "btn btn-primary btn-block" }, `🚀 ${t("guest_setup_btn_start")}`);

  form.appendChild(nameInp);
  form.appendChild(subjInp);
  form.appendChild(startBtn);
  body.appendChild(form);
  modal.appendChild(body);

  const dismiss = () => { overlay.classList.remove("active"); clearEl(overlay); if (onComplete) onComplete(); };
  closeBtn.addEventListener("click", dismiss);

  startBtn.addEventListener("click", async () => {
    const teacherName = nameInp.value.trim();
    const teacherSubject = subjInp.value.trim();
    if (teacherName || teacherSubject) {
      await updateSchoolConfig({ teacherName, teacherSubject });
    }
    dismiss();
  });

  getSchoolConfig().then((cfg) => {
    if (cfg?.teacherName) nameInp.value = cfg.teacherName;
    if (cfg?.teacherSubject) subjInp.value = cfg.teacherSubject;
  });

  overlay.appendChild(modal);
  overlay.classList.add("active");
  nameInp.focus();
}
