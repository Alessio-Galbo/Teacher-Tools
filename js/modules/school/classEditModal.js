import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { updateClass } from "../../services/classService.js";

export function showClassEditModal(options = {}) {
  const { cls, onSaved } = options;
  if (!cls) return;

  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const nameInput = createEl("input", {
    className: "input-text",
    type: "text",
    value: cls.name || "",
  });

  const didacticInput = createEl("textarea", {
    className: "textarea-input",
    i18nPlaceholder: "school_class_didactic_placeholder",
  });
  didacticInput.value = cls.didacticNotes || "";

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "btn_save",
    onClick: async () => {
      const newName = nameInput.value.trim().toUpperCase();
      if (!newName) return;
      await updateClass(cls.id, {
        name: newName,
        didacticNotes: didacticInput.value.trim(),
      });
      showToast(t("school_class_saved"), "success");
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "school_modal_edit_class" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "school_class_name_label" }),
        nameInput,
      ]),
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "school_class_didactic_label" }),
        didacticInput,
      ]),
    ]),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
      saveBtn,
    ]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
  setTimeout(() => nameInput.focus(), 50);
}
