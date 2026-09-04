import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getSchoolConfig, rolloverClass, getClasses } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { createRolloverStudentList } from "./rolloverStudentList.js";

export async function showRolloverModal(cls, onDone, nextClass = null) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const allStudents = await getStudents(config.activeYear);
  const classStudents = allStudents.filter((s) => s.classId === cls.id || s.className === cls.name);
  const allClasses = await getClasses();
  const existingLink = nextClass || allClasses.find((c) => c.originClassId === cls.id || c.id === cls.promotedToClassId);

  const nextYear = existingLink ? existingLink.schoolYear : getNextSchoolYear(config.activeYear);
  const suggestedName = existingLink ? existingLink.name : getNextClassName(cls.name);

  const yearInput = createEl("input", { className: "input-text", value: nextYear });
  const destNameInput = createEl("input", { className: "input-text", value: suggestedName });
  const retNameInput = createEl("input", { className: "input-text", value: cls.name });

  const nextYearStudents = await getStudents(nextYear);
  const studentList = createRolloverStudentList(classStudents, nextYearStudents, () => destNameInput.value.trim(), () => retNameInput.value.trim());

  destNameInput.addEventListener("input", studentList.updateBadges);
  retNameInput.addEventListener("input", studentList.updateBadges);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const submitBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "school_rollover_confirm",
    onClick: async () => {
      const targetYear = yearInput.value.trim();
      const destClassName = destNameInput.value.trim();
      const retainedClassName = retNameInput.value.trim();
      if (!targetYear || !destClassName) return;

      const promoted = studentList.getPromoted();
      const retained = studentList.getRetained();

      await rolloverClass({ fromClassId: cls.id, targetYear, destClassName, promotedStudents: promoted, retainedClassName, retainedStudents: retained });
      showToast(t("school_rollover_success"), "success");
      closeModal();
      if (onDone) onDone();
    },
  });

  const banner = existingLink ? createEl("div", { className: "card card-warning rollover-alert-banner" }, [
    createEl("strong", {}, `ℹ️ ${t("school_rollover_already_promoted_banner")} `),
    createEl("span", {}, `"${existingLink.name}" (${existingLink.schoolYear}).`),
  ]) : null;

  const modalBox = createEl("div", { className: "modal-box rollover-modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "school_rollover_title" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      banner,
      createEl("p", { className: "app-subtitle", i18n: "school_rollover_desc" }),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_target_year" }), yearInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_dest_class" }), destNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_retained_class" }), retNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_select_promoted" }), studentList.el]),
    ].filter(Boolean)),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
      submitBtn,
    ]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}

function getNextSchoolYear(cur) {
  const p = (cur || "2024/2025").split("/");
  return p.length === 2 && !isNaN(p[0]) ? `${+p[0] + 1}/${+p[1] + 1}` : "2025/2026";
}

function getNextClassName(n) {
  const m = (n || "").match(/^(\d+)(.*)$/);
  return m ? `${+m[1] + 1}${m[2]}` : (n ? `${n} (Succ.)` : "Classe");
}
