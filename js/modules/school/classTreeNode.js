import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { removeClass } from "../../services/schoolService.js";
import { createTreeNode } from "./treeNode.js";
import { createStudentTreeNode } from "./studentTreeNode.js";
import { showStudentModal } from "./studentModal.js";
import { showRolloverModal } from "./rolloverModal.js";

export function createClassTreeNode(cls, students, onRefresh, allClasses = []) {
  const classStudents = students.filter((s) => s.classId === cls.id || s.className === cls.name);
  const studentNodes = classStudents.map((st) => createStudentTreeNode(st, onRefresh));
  const nextClass = allClasses.find((c) => c.originClassId === cls.id || c.id === cls.promotedToClassId);

  const promoteBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    title: nextClass ? `${t("school_rollover_already_promoted")}: ${nextClass.name} (${nextClass.schoolYear})` : t("school_btn_promote"),
    onClick: (e) => {
      e.stopPropagation();
      showRolloverModal(cls, onRefresh, nextClass);
    },
  }, [
    createEl("span", { className: "btn-icon" }, "↗️"),
    createEl("span", { className: "btn-label", i18n: "school_btn_promote_short" }),
  ]);

  const addStBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    title: t("student_modal_new"),
    onClick: (e) => {
      e.stopPropagation();
      showStudentModal({ defaultClass: cls, onSaved: onRefresh });
    },
  }, [
    createEl("span", { className: "btn-icon" }, "+"),
    createEl("span", { className: "btn-label", i18n: "school_btn_add_student_short" }),
  ]);

  const delClsBtn = createEl("button", {
    className: "note-delete-btn btn-sm btn-icon-only",
    title: t("school_class_delete_confirm"),
    onClick: async (e) => {
      e.stopPropagation();
      if (confirm(t("school_class_delete_confirm"))) {
        await removeClass(cls.id);
        if (onRefresh) onRefresh();
      }
    },
  }, "🗑");

  const badges = [createEl("span", { className: "badge" }, `${classStudents.length} alunni`)];
  if (nextClass) {
    badges.push(createEl("span", {
      className: "badge badge-success",
      title: `${t("school_rollover_promoted_badge")}: ${nextClass.name} (${nextClass.schoolYear})`,
    }, `↗ ${nextClass.name} (${nextClass.schoolYear}) ✓`));
  }

  return createTreeNode({
    icon: "🏢",
    title: `Classe ${cls.name}`,
    badges,
    actions: [promoteBtn, addStBtn, delClsBtn],
    children: studentNodes,
  });
}
