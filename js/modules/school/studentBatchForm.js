import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { addStudent } from "../../services/studentService.js";

export function createStudentBatchForm(options = {}) {
  const { defaultClass = null, config = {} } = options;

  const textarea = createEl("textarea", {
    className: "textarea-input textarea-large",
    i18nPlaceholder: "student_batch_placeholder",
  });

  const countBadge = createEl("span", { className: "badge badge-primary" }, `0 ${t("student_batch_detected")}`);

  const parseNames = (text) => text.split("\n")
    .map((l) => l.replace(/^[\d]+[\.\)\-\s]+/, "").replace(/^[\*\-\•]\s*/, "").replace(/[,;]+$/, "").trim())
    .filter((l) => l.length > 1);

  textarea.oninput = () => {
    const names = parseNames(textarea.value);
    countBadge.textContent = `${names.length} ${t("student_batch_detected")}`;
  };

  const supportSelect = createEl("select", { className: "select-input" }, [
    createEl("option", { value: "curriculare", selected: true }, t("student_type_curr")),
    createEl("option", { value: "pei" }, t("student_type_pei")),
    createEl("option", { value: "bes" }, t("student_type_bes")),
  ]);

  const element = createEl("div", { className: "student-batch-form" }, [
    createEl("p", { className: "app-subtitle", i18n: "student_batch_desc" }),
    createEl("div", { className: "form-group" }, [textarea]),
    createEl("div", { className: "form-group" }, [
      createEl("div", { className: "tags-bar" }, [
        countBadge,
        defaultClass ? createEl("span", { className: "badge" }, `🏢 ${defaultClass.name}`) : null,
      ].filter(Boolean)),
    ]),
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "student_field_type" }),
      supportSelect,
    ]),
  ]);

  const saveAll = async () => {
    const names = parseNames(textarea.value);
    if (names.length === 0) return 0;
    for (const name of names) {
      await addStudent({
        name,
        classId: defaultClass ? defaultClass.id : "",
        className: defaultClass ? defaultClass.name : "",
        schoolId: defaultClass ? (defaultClass.schoolId || "") : "",
        schoolYear: config.activeYear,
        supportType: supportSelect.value,
        notes: "",
      });
    }
    return names.length;
  };

  return { element, saveAll };
}
