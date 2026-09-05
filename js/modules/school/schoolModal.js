import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { addSchool, updateSchool, associateSchoolToYear, getSchoolConfig, getHistoricSchools } from "../../services/schoolService.js";
import { formatSchoolFullName } from "./schoolLocationHelper.js";
import { createSchoolTypeControls, TYPE_MAX } from "./schoolTypeSelector.js";

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
  const provInput = createEl("input", { className: "input-text input-uppercase", value: isEdit ? (school.province || "") : "", placeholder: "es. BG", maxLength: "4" });

  const curType = school?.schoolType || "secondaria_2";
  const curMax = school?.maxGrade || TYPE_MAX[curType] || 5;
  const { typeSelect, maxGradeInput } = createSchoolTypeControls(curType, curMax);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const formElements = [];

  if (!isEdit && historicSchools.length > 0) {
    let histId = historicSchools[0].id;
    const histSelect = createEl("select", { className: "select-input", onChange: (e) => { histId = e.target.value; } },
      historicSchools.map((s) => createEl("option", { value: s.id }, `🏫 ${formatSchoolFullName(s)}`)));
    const assocBtn = createEl("button", { className: "btn btn-secondary", i18n: "school_btn_associate", onClick: async () => {
      await associateSchoolToYear(histId, config.activeYear);
      showToast(t("school_associated"), "success");
      closeModal();
      if (onSaved) onSaved();
    }});
    formElements.push(createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_historic_section" }), createEl("div", { className: "school-select-row" }, [createEl("div", { className: "school-select-flex" }, [histSelect]), assocBtn])]));
    formElements.push(createEl("div", { className: "modal-divider" }, [createEl("span", { className: "form-label", i18n: "school_new_institute_section" })]));
  }

  const locRow = createEl("div", { className: "school-location-row" }, [
    createEl("div", { className: "form-group form-flex-3" }, [createEl("label", { className: "form-label", i18n: "school_label_city" }), cityInput]),
    createEl("div", { className: "form-group form-flex-1" }, [createEl("label", { className: "form-label", i18n: "school_label_province" }), provInput]),
  ]);
  formElements.push(
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_label_name" }), nameInput]),
    locRow,
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_type_label" }), typeSelect]),
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_max_grade_label" }), maxGradeInput])
  );

  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save", onClick: async () => {
    const name = nameInput.value.trim();
    if (!name) return;
    const city = cityInput.value.trim();
    const province = provInput.value.trim().toUpperCase();
    const schoolType = typeSelect.value;
    const maxGrade = parseInt(maxGradeInput.value, 10) || 5;
    if (isEdit) await updateSchool({ ...school, name, city, province, schoolType, maxGrade });
    else await addSchool(name, city, config.activeYear, { province, schoolType, maxGrade });
    showToast(t(isEdit ? "school_updated" : "school_created"), "success");
    closeModal();
    if (onSaved) onSaved();
  }});

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [createEl("h3", { className: "modal-title", i18n: isEdit ? "school_modal_edit" : "school_modal_new" }), createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕")]),
    createEl("div", { className: "modal-body" }, formElements),
    createEl("div", { className: "modal-toolbar" }, [createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }), saveBtn]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
