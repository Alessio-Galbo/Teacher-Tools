import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { addSchool, updateSchool, associateSchoolToYear, getSchoolConfig, getHistoricSchools } from "../../services/schoolService.js";

export async function showSchoolModal(options = {}) {
  const { school = null, onSaved = null } = options;
  const isEdit = !!school;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const historicSchools = !isEdit ? await getHistoricSchools(config.activeYear) : [];
  const nameInput = createEl("input", { className: "input-text", value: isEdit ? school.name : "", placeholder: "es. Liceo Galilei" });
  const cityInput = createEl("input", { className: "input-text", value: isEdit ? (school.city || "") : "", placeholder: "es. Bergamo" });
  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const formElements = [];

  if (!isEdit && historicSchools.length > 0) {
    let selectedHistoricId = historicSchools[0].id;
    const historicSelect = createEl("select", {
      className: "select-input",
      onChange: (e) => { selectedHistoricId = e.target.value; },
    }, historicSchools.map((s) => createEl("option", { value: s.id }, `🏫 ${s.name}${s.city ? ` (${s.city})` : ""}`)));

    const assocBtn = createEl("button", {
      className: "btn btn-secondary",
      i18n: "school_btn_associate",
      onClick: async () => {
        await associateSchoolToYear(selectedHistoricId, config.activeYear);
        showToast(t("school_associated"), "success");
        closeModal();
        if (onSaved) onSaved();
      },
    });

    formElements.push(
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "school_historic_section" }),
        createEl("div", { className: "school-select-row" }, [createEl("div", { className: "school-select-flex" }, [historicSelect]), assocBtn]),
      ]),
      createEl("div", { className: "modal-divider" }, [createEl("span", { className: "form-label", i18n: "school_new_institute_section" })])
    );
  }

  formElements.push(
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_label_name" }), nameInput]),
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_label_city" }), cityInput])
  );

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "btn_save",
    onClick: async () => {
      const name = nameInput.value.trim();
      if (!name) return;
      if (isEdit) await updateSchool({ ...school, name, city: cityInput.value.trim() });
      else await addSchool(name, cityInput.value.trim(), config.activeYear);
      showToast(t(isEdit ? "school_updated" : "school_created"), "success");
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: isEdit ? "school_modal_edit" : "school_modal_new" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, formElements),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
      saveBtn,
    ]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
