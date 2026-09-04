import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { addStudent } from "../../services/studentService.js";
import { getSchoolConfig } from "../../services/schoolService.js";

export async function showStudentBatchModal(options = {}) {
  const { defaultClass = null, onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
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

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "student_batch_save",
    onClick: async () => {
      const names = parseNames(textarea.value);
      if (names.length === 0) return;
      saveBtn.disabled = true;

      for (const name of names) {
        await addStudent({
          name,
          classId: defaultClass ? defaultClass.id : "",
          className: defaultClass ? defaultClass.name : "",
          schoolYear: config.activeYear,
          supportType: supportSelect.value,
          notes: "",
        });
      }

      showToast(`${names.length} ${t("student_batch_success")}`, "success");
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal });
  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title" }, `${t("student_batch_title")} ${defaultClass ? `(${defaultClass.name})` : ""}`),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("p", { className: "app-subtitle", i18n: "student_batch_desc" }),
      createEl("div", { className: "form-group" }, [textarea]),
      createEl("div", { className: "tags-bar" }, [countBadge]),
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "student_field_type" }),
        supportSelect,
      ]),
    ]),
    createEl("div", { className: "modal-toolbar" }, [cancelBtn, saveBtn]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
