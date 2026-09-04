import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getSchoolConfig, updateSchoolConfig } from "../../services/schoolConfigService.js";

export function createTeacherProfileCard(onRefresh = null) {
  const card = createEl("div", { className: "card settings-teacher-card" });
  card.appendChild(createEl("h3", { className: "card-title", i18n: "settings_teacher_title" }, t("settings_teacher_title")));

  const form = createEl("div", { className: "settings-teacher-form" });

  const nameGroup = createEl("div", { className: "form-group" });
  nameGroup.appendChild(createEl("label", { className: "form-label", i18n: "settings_teacher_name_label" }, t("settings_teacher_name_label")));
  const nameInp = createEl("input", {
    type: "text", className: "input-text",
    placeholder: t("settings_teacher_name_placeholder")
  });
  nameGroup.appendChild(nameInp);
  form.appendChild(nameGroup);

  const subjGroup = createEl("div", { className: "form-group" });
  subjGroup.appendChild(createEl("label", { className: "form-label", i18n: "settings_teacher_subject_label" }, t("settings_teacher_subject_label")));
  const subjInp = createEl("input", {
    type: "text", className: "input-text",
    placeholder: t("settings_teacher_subject_placeholder")
  });
  subjGroup.appendChild(subjInp);
  form.appendChild(subjGroup);

  const saveBtn = createEl("button", { className: "btn btn-primary btn-block", i18n: "btn_save" }, t("btn_save"));
  saveBtn.addEventListener("click", async () => {
    await updateSchoolConfig({ teacherName: nameInp.value.trim(), teacherSubject: subjInp.value.trim() });
    showToast("settings_teacher_saved");
    if (onRefresh) onRefresh();
  });
  form.appendChild(saveBtn);

  card.appendChild(form);

  getSchoolConfig().then((cfg) => {
    nameInp.value = cfg.teacherName || "";
    subjInp.value = cfg.teacherSubject || "";
  });

  return card;
}
