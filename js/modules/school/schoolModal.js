import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { addSchool, updateSchool, associateSchoolToYear, getSchoolConfig, getHistoricSchools } from "../../services/schoolService.js";

const TYPE_MAX = { secondaria_2: 5, secondaria_1: 3, primaria: 5, infanzia: 3 };

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

  const curType = school?.schoolType || "secondaria_2";
  const curMax = school?.maxGrade || TYPE_MAX[curType] || 5;

  const maxGradeInput = createEl("input", { className: "input-text", type: "number", min: "1", max: "15", value: curMax, disabled: curType !== "custom" });
  const typeSelect = createEl("select", {
    className: "select-input",
    onChange: () => {
      const v = typeSelect.value;
      if (TYPE_MAX[v]) { maxGradeInput.value = TYPE_MAX[v]; maxGradeInput.disabled = true; }
      else { maxGradeInput.disabled = false; }
    },
  }, [
    createEl("option", { value: "secondaria_2", selected: curType === "secondaria_2", i18n: "school_type_sec2" }),
    createEl("option", { value: "secondaria_1", selected: curType === "secondaria_1", i18n: "school_type_sec1" }),
    createEl("option", { value: "primaria", selected: curType === "primaria", i18n: "school_type_prim" }),
    createEl("option", { value: "infanzia", selected: curType === "infanzia", i18n: "school_type_inf" }),
    createEl("option", { value: "custom", selected: curType === "custom", i18n: "school_type_custom" }),
  ]);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const formElements = [];

  if (!isEdit && historicSchools.length > 0) {
    let histId = historicSchools[0].id;
    const histSelect = createEl("select", { className: "select-input", onChange: (e) => { histId = e.target.value; } },
      historicSchools.map((s) => createEl("option", { value: s.id }, `🏫 ${s.name}${s.city ? ` (${s.city})` : ""}`)));
    const assocBtn = createEl("button", { className: "btn btn-secondary", i18n: "school_btn_associate", onClick: async () => {
      await associateSchoolToYear(histId, config.activeYear);
      showToast(t("school_associated"), "success");
      closeModal();
      if (onSaved) onSaved();
    }});
    formElements.push(createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_historic_section" }), createEl("div", { className: "school-select-row" }, [createEl("div", { className: "school-select-flex" }, [histSelect]), assocBtn])]));
    formElements.push(createEl("div", { className: "modal-divider" }, [createEl("span", { className: "form-label", i18n: "school_new_institute_section" })]));
  }

  formElements.push(
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_label_name" }), nameInput]),
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_label_city" }), cityInput]),
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_type_label" }), typeSelect]),
    createEl("div", { className: "form-group" }, [createEl("label", { className: "form-label", i18n: "school_max_grade_label" }), maxGradeInput])
  );

  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save", onClick: async () => {
    const name = nameInput.value.trim();
    if (!name) return;
    const schoolType = typeSelect.value;
    const maxGrade = parseInt(maxGradeInput.value, 10) || 5;
    if (isEdit) await updateSchool({ ...school, name, city: cityInput.value.trim(), schoolType, maxGrade });
    else await addSchool(name, cityInput.value.trim(), config.activeYear, { schoolType, maxGrade });
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
