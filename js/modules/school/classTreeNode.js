import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { removeClass } from "../../services/schoolService.js";
import { createTreeNode } from "./treeNode.js";
import { createStudentTreeNode } from "./studentTreeNode.js";
import { showStudentModal } from "./studentModal.js";
import { showRolloverModal } from "./rolloverModal.js";
import { getPromotionStatus } from "./rolloverHelper.js";
import { showClassOverviewModal } from "./classOverviewModal.js";

export function createClassTreeNode(cls, students, onRefresh, allClasses = [], nextYearStudents = [], school = null) {
  const classStudents = students.filter((s) => s.classId === cls.id || s.className === cls.name);
  const nextClass = allClasses.find((c) => c.originClassId === cls.id || c.id === cls.promotedToClassId);
  const studentNodes = classStudents.map((st) => createStudentTreeNode(st, onRefresh, nextYearStudents, nextClass, cls));

  const promo = getPromotionStatus(cls, classStudents, nextYearStudents, nextClass, allClasses);
  const isExistingValid = nextClass && allClasses.some((c) => c.id === nextClass.id);

  const promoteBtn = createEl("button", {
    className: "btn btn-secondary btn-sm",
    title: isExistingValid ? `${t("school_rollover_already_promoted")}: ${nextClass.name} (${nextClass.schoolYear})` : t("school_btn_promote"),
    onClick: (e) => {
      e.stopPropagation();
      showRolloverModal(cls, onRefresh, isExistingValid ? nextClass : null, school);
    },
  }, [
    createEl("span", { className: "btn-icon" }, "↗️"),
    createEl("span", { className: "btn-label", i18n: "school_btn_promote_short" }),
  ]);

  const addStBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only",
    title: t("student_modal_new"),
    onClick: (e) => {
      e.stopPropagation();
      showStudentModal({ defaultClass: cls, onSaved: onRefresh });
    },
  }, "+👤");


  const editClsBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only",
    title: t("school_modal_edit_class"),
    onClick: (e) => {
      e.stopPropagation();
      import("./classEditModal.js").then((m) => m.showClassEditModal({ cls, onSaved: onRefresh }));
    },
  }, "✏️");

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
  if (promo.isPromoted && promo.label) {
    const tip = promo.status === "partial" ? t("school_rollover_status_partial") : t("school_rollover_status_complete");
    badges.push(createEl("span", { className: `badge ${promo.badgeClass}`, title: tip }, promo.label));
  }

  return createTreeNode({
    icon: "🏢",
    title: `Classe ${cls.name}`,
    badges,
    actions: [promoteBtn, addStBtn, editClsBtn, delClsBtn],
    children: studentNodes,
    level: 1,
    onTitleClick: () => showClassOverviewModal(cls.id),
  });

}
