import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { setActiveStudent, togglePinStudent, removeStudent } from "../../services/studentService.js";
import { createTreeNode } from "./treeNode.js";
import { showStudentModal } from "./studentModal.js";

export function createStudentTreeNode(st, onRefresh) {
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

  const node = createTreeNode({
    icon: "🎓",
    title: st.name,
    badges: [typeBadge],
    actions: [pinBtn, editBtn, delBtn],
    isCollapsible: false,
  });

  const content = node.querySelector(".tree-row-content");
  if (content) {
    content.onclick = () => {
      setActiveStudent(st.id);
      showToast(`${t("student_selector_label")} ${st.name}`, "info");
    };
  }

  return node;
}
