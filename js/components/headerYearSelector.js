import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { showToast } from "../utils/toast.js";
import { getSchoolConfig, updateSchoolConfig, addAcademicYear, removeAcademicYear } from "../services/schoolService.js";
import { createDebouncedRenderer } from "../utils/renderHelper.js";

import { showAddYearModal } from "../modules/school/yearSelectModal.js";

export function initHeaderYearSelector(container) {
  if (!container) return;
  let isOpen = false;

  async function build() {
    const config = await getSchoolConfig();
    const sorted = [...config.years].sort((a, b) => b.localeCompare(a));

    const trigger = createEl("button", {
      className: "header-year-trigger",
      type: "button",
      onClick: (e) => { e.stopPropagation(); toggle(!isOpen); },
    }, [
      createEl("span", {}, `📅 ${config.activeYear}`),
      createEl("span", { className: "header-year-chevron" }, "▾"),
    ]);

    const addRow = createEl("div", {
      className: "header-year-add-item",
      i18n: "school_dropdown_add_year",
      onClick: (e) => {
        e.stopPropagation();
        toggle(false);
        showAddYearModal();
      },
    });

    const yearRows = sorted.map((y) => {
      const isAct = y === config.activeYear;
      const labelEl = createEl("span", {
        className: "header-year-name",
        onClick: async (e) => {
          e.stopPropagation();
          toggle(false);
          if (!isAct) {
            await updateSchoolConfig({ activeYear: y });
            window.dispatchEvent(new CustomEvent("globalYearChanged"));
          }
        },
      }, `${isAct ? "✓ " : ""}${y}`);

      const delBtn = config.years.length > 1
        ? createEl("button", {
            className: "note-delete-btn btn-sm",
            title: t("school_btn_remove_year_title"),
            onClick: async (e) => {
              e.stopPropagation();
              if (confirm(`${t("school_year_remove_confirm_short")} (${y})`)) {
                await removeAcademicYear(y);
                showToast(t("school_year_removed"), "info");
                window.dispatchEvent(new CustomEvent("globalYearChanged"));
              }
            },
          }, "🗑")
        : null;

      return createEl("div", { className: `header-year-item ${isAct ? "active" : ""}` }, [labelEl, delBtn].filter(Boolean));
    });

    const menu = createEl("div", { className: "header-year-menu" }, [addRow, ...yearRows]);
    const toggle = (open) => { isOpen = open; menu.classList.toggle("open", isOpen); };

    document.addEventListener("click", () => { if (isOpen) toggle(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen) toggle(false); });

    return createEl("div", { className: "header-year-dropdown" }, [trigger, menu]);
  }

  const render = createDebouncedRenderer(container, build);

  window.addEventListener("schoolConfigChanged", render);
  window.addEventListener("languageChanged", render);
  window.addEventListener("dataRestored", render);
  render();
}
