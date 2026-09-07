import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getSchoolConfig, updateSchoolConfig } from "../../services/schoolConfigService.js";

export function createDeviceTeacherSection(onRefresh = null) {
  const sec = createEl("div", { className: "device-teacher-section" });
  sec.appendChild(createEl("div", { className: "device-teacher-title" }, t("device_teacher_title")));

  const grid = createEl("div", { className: "device-teacher-grid" });
  const nameInp = createEl("input", {
    type: "text", className: "input-text input-sm",
    placeholder: t("settings_teacher_name_placeholder")
  });
  const subjInp = createEl("input", {
    type: "text", className: "input-text input-sm",
    placeholder: t("settings_teacher_subject_placeholder")
  });
  const saveBtn = createEl("button", { className: "btn btn-primary btn-sm" }, `💾 ${t("btn_save")}`);

  saveBtn.addEventListener("click", async () => {
    await updateSchoolConfig({ teacherName: nameInp.value.trim(), teacherSubject: subjInp.value.trim() });
    showToast("settings_teacher_saved");
    if (onRefresh) onRefresh();
  });

  grid.appendChild(nameInp);
  grid.appendChild(subjInp);
  grid.appendChild(saveBtn);
  sec.appendChild(grid);

  getSchoolConfig().then((cfg) => {
    nameInp.value = cfg.teacherName || "";
    subjInp.value = cfg.teacherSubject || "";
  });

  return sec;
}
