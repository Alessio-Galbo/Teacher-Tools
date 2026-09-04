import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getSchoolConfig, rolloverClass } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";

export async function showRolloverModal(cls, onDone) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const allStudents = await getStudents(config.activeYear);
  const classStudents = allStudents.filter((s) => s.classId === cls.id || s.className === cls.name);

  const nextYear = getNextSchoolYear(config.activeYear);
  const suggestedName = getNextClassName(cls.name);

  const yearInput = createEl("input", { className: "input-text", value: nextYear });
  const destNameInput = createEl("input", { className: "input-text", value: suggestedName });
  const retNameInput = createEl("input", { className: "input-text", value: cls.name });

  const checkboxes = [];
  const listEl = createEl("div", { className: "student-checklist" });
  if (classStudents.length === 0) {
    listEl.appendChild(createEl("p", { className: "app-subtitle", i18n: "school_no_students_in_class" }));
  } else {
    classStudents.forEach((st) => {
      const cb = createEl("input", { type: "checkbox", checked: true });
      checkboxes.push({ student: st, checkbox: cb });
      listEl.appendChild(createEl("label", { className: "student-check-item" }, [cb, createEl("span", {}, `🎓 ${st.name}`)]));
    });
  }

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const submitBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "school_rollover_confirm",
    onClick: async () => {
      const targetYear = yearInput.value.trim();
      const destClassName = destNameInput.value.trim();
      const retainedClassName = retNameInput.value.trim();
      if (!targetYear || !destClassName) return;

      const promoted = checkboxes.filter((i) => i.checkbox.checked).map((i) => i.student);
      const retained = checkboxes.filter((i) => !i.checkbox.checked).map((i) => i.student);

      await rolloverClass({ fromClassId: cls.id, targetYear, destClassName, promotedStudents: promoted, retainedClassName, retainedStudents: retained });
      showToast(t("school_rollover_success"), "success");
      closeModal();
      if (onDone) onDone();
    },
  });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "school_rollover_title" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("p", { className: "app-subtitle", i18n: "school_rollover_desc" }),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_target_year" }), yearInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_dest_class" }), destNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_retained_class" }), retNameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_select_promoted" }), listEl]),
    ]),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
      submitBtn,
    ]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}

function getNextSchoolYear(cur) {
  const parts = (cur || "2024/2025").split("/");
  return parts.length === 2 && !isNaN(parts[0]) ? `${+parts[0] + 1}/${+parts[1] + 1}` : "2025/2026";
}

function getNextClassName(name) {
  const match = (name || "").match(/^(\d+)(.*)$/);
  return match ? `${+match[1] + 1}${match[2]}` : (name ? `${name} (Succ.)` : "Classe");
}
