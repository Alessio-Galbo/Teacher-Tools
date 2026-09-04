import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getSchoolConfig, addAcademicYear } from "../../services/schoolService.js";
import { computeYearOptions, validateCustomYear } from "./yearSelectHelper.js";

export async function showAddYearModal(onAdded) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const existing = new Set(config.years || []);
  const { options, curStart, defaultYear } = computeYearOptions(existing);
  let selectedYear = defaultYear;

  const previewEl = createEl("strong", { className: "year-preview-val" }, selectedYear);
  const customInput = createEl("input", {
    className: "input-text", type: "number", min: "1950", max: "2099",
    value: parseInt(selectedYear.split("/")[0], 10) || curStart,
  });

  const selectEl = createEl("select", {
    className: "select-input",
    onChange: (e) => {
      selectedYear = e.target.value;
      customInput.value = parseInt(selectedYear.split("/")[0], 10);
      previewEl.textContent = selectedYear;
      addBtn.disabled = false;
    },
  }, options.map((y) => createEl("option", { value: y, selected: y === selectedYear }, `📅 ${y}`)));

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const addBtn = createEl("button", {
    className: "btn btn-primary", i18n: "school_btn_add_year_confirm",
    onClick: async () => {
      if (!selectedYear || existing.has(selectedYear)) return;
      await addAcademicYear(selectedYear);
      showToast(t("school_year_added"), "success");
      window.dispatchEvent(new CustomEvent("globalYearChanged"));
      closeModal();
      if (onAdded) onAdded(selectedYear);
    },
  });

  customInput.oninput = () => {
    const res = validateCustomYear(customInput.value.trim(), existing);
    previewEl.textContent = res.message;
    addBtn.disabled = !res.valid;
    selectedYear = res.valid ? res.formatted : null;
    if (res.valid && [...selectEl.options].some((o) => o.value === selectedYear)) selectEl.value = selectedYear;
  };

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "school_modal_add_year_title" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("p", { className: "app-subtitle", i18n: "school_modal_add_year_desc" }),
      createEl("div", { className: "form-group" }, [selectEl]),
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "school_modal_custom_year_label" }), customInput,
      ]),
      createEl("p", { className: "text-muted" }, [
        createEl("span", { i18n: "school_modal_custom_year_preview" }), createEl("span", {}, " "), previewEl,
      ]),
    ]),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }), addBtn,
    ]),
  ]);
  overlay.appendChild(modalBox);
  overlay.classList.add("active");
}
