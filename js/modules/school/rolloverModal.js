import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getSchoolConfig, rolloverClass, getClasses, getActiveSchool, getSchools } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { createRolloverStudentList } from "./rolloverStudentList.js";
import { getNextSchoolYear, getNextClassName, isTerminalClass } from "./rolloverHelper.js";

export async function showRolloverModal(cls, onDone, nextClass = null, passedSchool = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const school = passedSchool || (await getSchools()).find((s) => s.id === cls.schoolId) || (await getActiveSchool());
  const allStudents = await getStudents(config.activeYear);
  const classStudents = allStudents.filter((s) => s.classId === cls.id || s.className === cls.name);
  const allClasses = await getClasses();
  const existingLink = (nextClass && allClasses.some((c) => c.id === nextClass.id))
    ? nextClass
    : allClasses.find((c) => c.originClassId === cls.id || (cls.promotedToClassId && c.id === cls.promotedToClassId));

  const isTermInit = isTerminalClass(cls.name, school);
  const nextYear = existingLink ? existingLink.schoolYear : getNextSchoolYear(config.activeYear);
  const defDestName = isTermInit ? t("school_rollover_graduation_dest") : (existingLink ? existingLink.name : (getNextClassName(cls.name, school) || ""));

  const yearInput = createEl("input", { className: "input-text", value: nextYear });
  const destNameInput = createEl("input", { className: "input-text", value: defDestName, disabled: isTermInit });
  const retNameInput = createEl("input", { className: "input-text", value: cls.name });
  const termCb = createEl("input", { type: "checkbox", checked: isTermInit });
  const autoSetupCb = createEl("input", { type: "checkbox", checked: true });

  const validNextClassIds = new Set(allClasses.filter((c) => c.schoolYear === nextYear).map((c) => c.id));
  const rawNextStudents = await getStudents(nextYear);
  const nextYearStudents = rawNextStudents.filter((ns) => !ns.classId || validNextClassIds.has(ns.classId));
  const studentList = createRolloverStudentList(classStudents, nextYearStudents, () => destNameInput.value.trim(), () => retNameInput.value.trim(), () => termCb.checked);

  termCb.onchange = () => {
    destNameInput.disabled = termCb.checked;
    destNameInput.value = termCb.checked ? t("school_rollover_graduation_dest") : (getNextClassName(cls.name, school) || cls.name);
    studentList.updateBadges();
  };
  destNameInput.addEventListener("input", studentList.updateBadges);
  retNameInput.addEventListener("input", studentList.updateBadges);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const submitBtn = createEl("button", { className: "btn btn-primary", i18n: "school_rollover_confirm", onClick: async () => {
    const targetYear = yearInput.value.trim();
    const destClassName = termCb.checked ? "" : destNameInput.value.trim();
    const retainedClassName = retNameInput.value.trim();
    if (!targetYear || (!termCb.checked && !destClassName)) return;

    await rolloverClass({
      fromClassId: cls.id, targetYear, destClassName, isTerminal: termCb.checked, autoSetup: autoSetupCb.checked,
      promotedStudents: studentList.getPromoted(), retainedClassName, retainedStudents: studentList.getRetained(),
    });
    showToast(t("school_rollover_success"), "success");
    closeModal();
    if (onDone) onDone();
  }});

  const banner = existingLink ? createEl("div", { className: "card card-warning rollover-alert-banner" }, [
    createEl("strong", {}, `ℹ️ ${t("school_rollover_already_promoted_banner")} `),
    createEl("span", {}, `"${existingLink.name}" (${existingLink.schoolYear}).`),
  ]) : null;

  const modalBox = createEl("div", { className: "modal-box rollover-modal-box" }, [
    createEl("div", { className: "modal-header" }, [createEl("h3", { className: "modal-title", i18n: "school_rollover_title" }), createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕")]),
    createEl("div", { className: "modal-body" }, [
      banner,
      createEl("p", { className: "app-subtitle", i18n: "school_rollover_desc" }),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_target_year" }), yearInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "checkbox-label" }, [termCb, createEl("span", { i18n: "school_rollover_terminal_checkbox" })])]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_dest_class" }), destNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_retained_class" }), retNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "checkbox-label" }, [autoSetupCb, createEl("span", { i18n: "school_rollover_auto_setup" })])]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_select_promoted" }), studentList.el]),
    ].filter(Boolean)),
    createEl("div", { className: "modal-toolbar" }, [createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }), submitBtn]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
