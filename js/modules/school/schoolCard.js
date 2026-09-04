import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showSchoolModal } from "./schoolModal.js";
import { removeSchoolFromYear, addClass } from "../../services/schoolService.js";
import { createClassTreeNode } from "./classTreeNode.js";

export function createSchoolCard(school, classes, students, config, onRefresh, allClasses = [], nextYearStudents = []) {
  const schClasses = classes.filter((c) => !c.schoolId || c.schoolId === school.id);
  const classNodes = schClasses.map((cls) => createClassTreeNode(cls, students, onRefresh, allClasses, nextYearStudents, school));

  const addClassBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    title: t("school_btn_add_class"),
    onClick: async () => {
      const name = prompt(t("school_prompt_class_name"));
      if (name && name.trim()) {
        await addClass(name, config.activeYear, null, school.id);
        if (onRefresh) onRefresh();
      }
    },
  }, [
    createEl("span", { className: "btn-icon" }, "+"),
    createEl("span", { className: "btn-label", i18n: "school_btn_add_class_short" }),
  ]);

  const editBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only",
    title: t("school_modal_edit"),
    onClick: () => showSchoolModal({ school, onSaved: onRefresh }),
  }, "✏️");

  const deleteBtn = createEl("button", {
    className: "note-delete-btn btn-sm btn-icon-only",
    title: t("school_remove_from_year_confirm"),
    onClick: async () => {
      if (confirm(t("school_remove_from_year_confirm"))) {
        await removeSchoolFromYear(school.id, config.activeYear);
        if (onRefresh) onRefresh();
      }
    },
  }, "🗑");

  const header = createEl("div", { className: "card-header" }, [
    createEl("h3", { className: "card-title" }, `🏫 ${school.name}${school.city ? ` (${school.city})` : ""}`),
    createEl("div", { className: "tree-actions" }, [addClassBtn, editBtn, deleteBtn]),
  ]);

  const bodyContent = classNodes.length > 0
    ? createEl("div", { className: "tree-children" }, classNodes)
    : createEl("p", { className: "text-muted", i18n: "school_classes_empty" });

  return createEl("div", { className: "card school-card" }, [header, bodyContent]);
}
