import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";
import { buildDropdownItems } from "./studentDropdownItems.js";
import { showStudentModal } from "../modules/school/studentModal.js";
import { formatSchoolFullName } from "../modules/school/schoolLocationHelper.js";

export function createStudentSearchDropdown(data, activeId, onSelect) {
  const { schools, students } = data;
  let isOpen = false;

  const getCleanLabel = () => {
    if (activeId === "__ALL__" || !activeId) return `📅 ${t("student_all")}`;
    if (activeId.startsWith("school_")) {
      const s = schools.find((x) => `school_${x.id}` === activeId);
      return s ? `🏫 ${formatSchoolFullName(s)}` : `🏫 Scuola`;
    }
    if (activeId.startsWith("class_")) return `🏢 Classe ${activeId.replace("class_", "")}`;
    const st = students.find((x) => x.id === activeId);
    return st ? `${st.isPinned ? "📌" : "🎓"} ${st.name}` : `📅 ${t("student_all")}`;
  };

  const triggerText = createEl("span", { className: "student-dropdown-text" }, getCleanLabel());
  const chevron = createEl("span", { className: "student-dropdown-chevron" }, "▾");
  const trigger = createEl("button", {
    className: "student-dropdown-trigger",
    type: "button",
    onClick: (e) => { e.stopPropagation(); toggleDropdown(!isOpen); },
  }, [triggerText, chevron]);

  const searchInput = createEl("input", {
    className: "student-dropdown-search-input",
    type: "text",
    i18nPlaceholder: "student_search_placeholder",
    onClick: (e) => e.stopPropagation(),
    onInput: (e) => filterList(e.target.value.trim().toLowerCase()),
  });

  const addStudentBtn = createEl("button", {
    className: "student-dropdown-add-btn",
    type: "button",
    i18n: "student_dropdown_add_btn",
    onClick: (e) => {
      e.stopPropagation();
      toggleDropdown(false);
      showStudentModal({ onSaved: () => window.dispatchEvent(new CustomEvent("studentListChanged")) });
    },
  });

  const emptyMsg = createEl("div", { className: "student-dropdown-empty hidden", i18n: "student_search_empty" });
  const listEl = createEl("div", { className: "student-dropdown-list" });

  buildDropdownItems(listEl, data, activeId, onSelect, () => {
    toggleDropdown(false);
    triggerText.textContent = getCleanLabel();
  });

  function filterList(q) {
    let visibleCount = 0;
    const items = listEl.querySelectorAll(".student-dropdown-item");
    items.forEach((it) => {
      const match = !q || (it.dataset.search && it.dataset.search.includes(q));
      it.classList.toggle("hidden", !match);
      if (match) visibleCount++;
    });
    emptyMsg.classList.toggle("hidden", visibleCount > 0);
  }

  const menu = createEl("div", { className: "student-dropdown-menu" }, [
    createEl("div", { className: "student-dropdown-search-wrap" }, [searchInput, addStudentBtn]),
    emptyMsg,
    listEl,
  ]);

  function toggleDropdown(open) {
    isOpen = open;
    menu.classList.toggle("open", isOpen);
    if (isOpen) {
      searchInput.value = "";
      filterList("");
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  document.addEventListener("click", () => { if (isOpen) toggleDropdown(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen) toggleDropdown(false); });

  return createEl("div", { className: "student-dropdown-container" }, [trigger, menu]);
}
