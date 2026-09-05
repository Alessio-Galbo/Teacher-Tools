import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSchools, getActiveSchool, setActiveSchool, removeSchoolFromYear, getSchoolConfig } from "../../services/schoolService.js";
import { showSchoolModal } from "./schoolModal.js";
import { formatSchoolFullName } from "./schoolLocationHelper.js";

export function createSchoolConfigCard(onSchoolChanged) {
  const card = createEl("div", { className: "card" });
  let renderSeq = 0;

  async function render() {
    const curSeq = ++renderSeq;
    const config = await getSchoolConfig();
    const schools = await getSchools(config.activeYear);
    const activeSchool = await getActiveSchool(config.activeYear);
    if (curSeq !== renderSeq) return;

    const addBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      i18n: "school_btn_add_school",
      onClick: () => showSchoolModal({ onSaved: () => { render(); if (onSchoolChanged) onSchoolChanged(); } }),
    });

    const header = createEl("div", { className: "card-header" }, [
      createEl("h3", { className: "card-title", i18n: "school_card_title" }),
      createEl("span", { className: "badge badge-primary" }, `A.S. ${config.activeYear}`),
    ]);

    if (schools.length === 0) {
      const emptyRow = createEl("div", { className: "school-select-row" }, [
        createEl("p", { className: "text-muted school-select-flex", i18n: "school_no_schools_in_year" }),
        addBtn,
      ]);
      card.replaceChildren(header, emptyRow);
      return;
    }

    const schoolSelect = createEl("select", {
      className: "select-input",
      onChange: (e) => {
        setActiveSchool(e.target.value);
        render();
        if (onSchoolChanged) onSchoolChanged();
      },
    }, schools.map((s) =>
      createEl("option", { value: s.id, selected: activeSchool && s.id === activeSchool.id }, `🏫 ${formatSchoolFullName(s)}`)
    ));

    const editBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      title: "Modifica Scuola",
      onClick: () => showSchoolModal({ school: activeSchool, onSaved: () => { render(); if (onSchoolChanged) onSchoolChanged(); } }),
    }, "✏️");

    const deleteBtn = createEl("button", {
      className: "note-delete-btn",
      title: "Rimuovi Scuola dall'anno",
      onClick: async () => {
        if (confirm(t("school_remove_from_year_confirm"))) {
          await removeSchoolFromYear(activeSchool.id, config.activeYear);
          render();
          if (onSchoolChanged) onSchoolChanged();
        }
      },
    }, "🗑");

    const selectRow = createEl("div", { className: "school-select-row" }, [
      createEl("div", { className: "school-select-flex" }, [schoolSelect]),
      editBtn,
      deleteBtn,
      addBtn,
    ]);

    card.replaceChildren(header, selectRow);
  }

  window.addEventListener("schoolsListChanged", render);
  window.addEventListener("globalYearChanged", render);
  render();
  return card;
}
