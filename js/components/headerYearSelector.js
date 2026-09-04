import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { showToast } from "../utils/toast.js";
import { getSchoolConfig, updateSchoolConfig, addAcademicYear, removeAcademicYear } from "../services/schoolService.js";
import { createDebouncedRenderer } from "../utils/renderHelper.js";

export function initHeaderYearSelector(container) {
  if (!container) return;

  async function build() {
    const config = await getSchoolConfig();
    const sortedYears = [...config.years].sort((a, b) => b.localeCompare(a));
    const options = sortedYears.map((y) =>
      createEl("option", { value: y, selected: config.activeYear === y }, `📅 ${y}`)
    );

    const selectEl = createEl("select", {
      className: "header-year-select",
      onChange: async (e) => {
        await updateSchoolConfig({ activeYear: e.target.value });
        window.dispatchEvent(new CustomEvent("globalYearChanged"));
        render();
      },
    }, options);

    const addBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      title: t("school_btn_add_year_title"),
      onClick: async () => {
        const newY = prompt(t("school_prompt_year"));
        if (newY && newY.trim()) {
          await addAcademicYear(newY.trim());
          showToast(t("school_year_added"), "success");
          window.dispatchEvent(new CustomEvent("globalYearChanged"));
          render();
        }
      },
    }, "+");

    let delBtn = null;
    if (config.years && config.years.length > 1) {
      delBtn = createEl("button", {
        className: "note-delete-btn btn-sm",
        title: t("school_btn_remove_year_title"),
        onClick: async () => {
          if (confirm(`${t("school_year_remove_confirm")} (${config.activeYear})`)) {
            await removeAcademicYear(config.activeYear);
            showToast(t("school_year_removed"), "info");
            window.dispatchEvent(new CustomEvent("globalYearChanged"));
            render();
          }
        },
      }, "🗑");
    }

    return [selectEl, addBtn, ...(delBtn ? [delBtn] : [])];
  }

  const render = createDebouncedRenderer(container, build);

  window.addEventListener("schoolConfigChanged", render);
  window.addEventListener("languageChanged", render);
  window.addEventListener("dataRestored", render);
  render();
}
