import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { addStudent, updateStudent } from "../../services/studentService.js";

export async function showStudentModal(options = {}) {
  const { student = null, defaultClass = null, onSaved = null } = options;
  const isEdit = !!student;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const classes = await getClasses(config.activeYear);
  const selectedClassId = isEdit ? (student.classId || "") : (defaultClass ? defaultClass.id : "");

  const nameInput = createEl("input", { className: "input-text", value: isEdit ? student.name : "", placeholder: "es. Studente L." });
  const classSelect = createEl("select", { className: "select-input" }, [
    createEl("option", { value: "" }, t("school_unassigned_class")),
    ...classes.map((c) =>
      createEl("option", { value: c.id, selected: selectedClassId === c.id || (isEdit && student.className === c.name) }, c.name)
    ),
  ]);

  const supportSelect = createEl("select", { className: "select-input" }, [
    createEl("option", { value: "pei", selected: !isEdit || student.supportType === "pei" }, t("student_type_pei")),
    createEl("option", { value: "bes", selected: isEdit && student.supportType === "bes" }, t("student_type_bes")),
    createEl("option", { value: "curriculare", selected: isEdit && student.supportType === "curriculare" }, t("student_type_curr")),
  ]);

  const notesInput = createEl("textarea", { className: "textarea-input", value: isEdit ? (student.notes || "") : "", placeholder: t("student_notes_placeholder") });
  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "btn_save",
    onClick: async () => {
      const name = nameInput.value.trim();
      if (!name) return;
      const selCls = classes.find((c) => c.id === classSelect.value);
      const studentData = {
        name,
        classId: selCls ? selCls.id : "",
        className: selCls ? selCls.name : "",
        schoolYear: config.activeYear,
        supportType: supportSelect.value,
        notes: notesInput.value.trim(),
        isPinned: isEdit ? Boolean(student.isPinned) : false,
      };
      if (isEdit) {
        await updateStudent({ ...student, ...studentData });
        showToast(t("student_updated"), "success");
      } else {
        await addStudent(studentData);
        showToast(t("student_created"), "success");
      }
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal });
  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: isEdit ? "student_modal_edit" : "student_modal_new" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "student_field_name" }), nameInput]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "student_field_class" }), classSelect]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "student_field_type" }), supportSelect]),
      createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "student_field_notes" }), notesInput]),
    ]),
    createEl("div", { className: "modal-toolbar" }, [cancelBtn, saveBtn]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
