import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { setActiveStudent, togglePinStudent, removeStudent } from "../../services/studentService.js";
import { createTreeNode } from "./treeNode.js";
import { showStudentModal } from "./studentModal.js";
import { isStudentMatch } from "./rolloverHelper.js";

function getAdvancementBadge(st, nextYearStudents, nextClass, cls) {
  const enrolled = Array.isArray(nextYearStudents) ? nextYearStudents.find((ns) => isStudentMatch(st, ns)) : null;

  if (enrolled && (enrolled.classId === cls?.id || (enrolled.className && cls?.name && enrolled.className.toLowerCase() === cls.name.toLowerCase()))) {
    return createEl("span", { className: "badge badge-warning", title: t("student_badge_retained") }, `↩ ${t("student_badge_retained")}`);
  }

  if (enrolled) {
    const dest = nextClass?.name || enrolled.className || "";
    return createEl("span", { className: "badge badge-success", title: `${t("student_badge_promoted")}: ${dest}` }, `↗ ${t("student_badge_promoted")}`);
  }

  if (cls?.promotedToClassName === "Fine Ciclo") {
    return createEl("span", { className: "badge badge-success", title: t("student_badge_graduated") }, `🎓 ${t("student_badge_graduated")}`);
  }

  return null;
}


export function createStudentTreeNode(st, onRefresh, nextYearStudents = [], nextClass = null, cls = null) {
  const pinBtn = createEl("button", {
    className: `btn-pin btn-icon-only ${st.isPinned ? "pinned" : ""}`,
    title: st.isPinned ? "Rimuovi Pin" : "Fissa in Evidenza",
    onClick: async (e) => {
      e.stopPropagation();
      await togglePinStudent(st.id);
      if (onRefresh) onRefresh();
    },
  }, "📌");

  const editBtn = createEl("button", {
    className: "btn btn-secondary btn-sm btn-icon-only",
    title: t("student_modal_edit"),
    onClick: (e) => {
      e.stopPropagation();
      showStudentModal({ student: st, onSaved: onRefresh });
    },
  }, "✏️");

  const delBtn = createEl("button", {
    className: "note-delete-btn btn-sm btn-icon-only",
    title: t("students_delete_confirm"),
    onClick: async (e) => {
      e.stopPropagation();
      if (confirm(t("students_delete_confirm"))) {
        await removeStudent(st.id);
        if (onRefresh) onRefresh();
      }
    },
  }, "🗑");

  const typeBadge = createEl("span", {
    className: `badge ${st.supportType === "bes" ? "badge-bes" : (st.supportType === "curriculare" ? "badge-curriculare" : "badge-pei")}`,
  }, (st.supportType || "pei").toUpperCase());

  const badges = [typeBadge];
  const advBadge = getAdvancementBadge(st, nextYearStudents, nextClass, cls);
  if (advBadge) badges.push(advBadge);

  return createTreeNode({
    icon: "🎓",
    title: st.name,
    badges,
    actions: [pinBtn, editBtn, delBtn],
    isCollapsible: false,
    level: 2,
    onTitleClick: () => {
      setActiveStudent(st.id);
      showToast(`${t("student_selector_label")} ${st.name}`, "info");
      import("./studentOverviewModal.js").then((m) => m.showStudentOverviewModal());
    },
  });
}

