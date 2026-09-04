import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function createStudentSingleForm(options = {}) {
  const { student = null, classes = [], defaultClass = null } = options;
  const isEdit = !!student;
  const selectedClassId = isEdit ? (student.classId || "") : (defaultClass ? defaultClass.id : "");

  const nameInput = createEl("input", {
    className: "input-text",
    value: isEdit ? student.name : "",
    placeholder: "es. Studente L.",
  });

  const classSelect = createEl("select", { className: "select-input" }, [
    createEl("option", { value: "" }, t("school_unassigned_class")),
    ...classes.map((c) =>
      createEl("option", { value: c.id, selected: selectedClassId === c.id || (isEdit && student.className === c.name) }, c.name)
    ),
  ]);

  const supportSelect = createEl("select", { className: "select-input" }, [
    createEl("option", { value: "curriculare", selected: isEdit ? student.supportType === "curriculare" : false }, t("student_type_curr")),
    createEl("option", { value: "pei", selected: isEdit ? student.supportType === "pei" : true }, t("student_type_pei")),
    createEl("option", { value: "bes", selected: isEdit && student.supportType === "bes" }, t("student_type_bes")),
  ]);

  const notesInput = createEl("textarea", {
    className: "textarea-input",
    value: isEdit ? (student.notes || "") : "",
    placeholder: t("student_notes_placeholder"),
  });

  const element = createEl("div", { className: "student-single-form" }, [
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "student_field_name" }),
      nameInput,
    ]),
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "student_field_class" }),
      classSelect,
    ]),
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "student_field_type" }),
      supportSelect,
    ]),
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "student_field_notes" }),
      notesInput,
    ]),
  ]);

  const getData = () => {
    const name = nameInput.value.trim();
    if (!name) return null;
    const selCls = classes.find((c) => c.id === classSelect.value);
    return {
      name,
      classId: selCls ? selCls.id : "",
      className: selCls ? selCls.name : "",
      schoolId: selCls?.schoolId || defaultClass?.schoolId || "",
      supportType: supportSelect.value,
      notes: notesInput.value.trim(),
      isPinned: isEdit ? Boolean(student.isPinned) : false,
    };
  };

  return { element, getData };
}
