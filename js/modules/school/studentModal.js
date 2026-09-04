import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getClasses, getSchoolConfig } from "../../services/schoolService.js";
import { addStudent, updateStudent } from "../../services/studentService.js";
import { createStudentSingleForm } from "./studentSingleForm.js";
import { createStudentBatchForm } from "./studentBatchForm.js";

export async function showStudentModal(options = {}) {
  const { student = null, defaultClass = null, onSaved = null } = options;
  const isEdit = !!student;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const config = await getSchoolConfig();
  const classes = await getClasses(config.activeYear);
  const singleForm = createStudentSingleForm({ student, classes, defaultClass });
  const batchForm = !isEdit ? createStudentBatchForm({ defaultClass, config }) : null;

  let currentTab = "single";
  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save" });
  const container = createEl("div", { className: "modal-body" });

  const renderTab = () => {
    clearEl(container);
    const isSingle = currentTab === "single";
    container.appendChild(isSingle ? singleForm.element : batchForm.element);
    saveBtn.textContent = t(isSingle ? "btn_save" : "student_batch_save");
  };

  saveBtn.onclick = async () => {
    if (currentTab === "single") {
      const data = singleForm.getData();
      if (!data) return;
      if (isEdit) await updateStudent({ ...student, ...data });
      else await addStudent({ ...data, schoolYear: config.activeYear });
      showToast(t(isEdit ? "student_updated" : "student_created"), "success");
    } else if (batchForm) {
      const count = await batchForm.saveAll();
      if (count === 0) return;
      showToast(`${count} ${t("student_batch_success")}`, "success");
    }
    closeModal();
    if (onSaved) onSaved();
  };

  const makeTab = (tab, key) => createEl("button", {
    className: `overview-year-btn ${currentTab === tab ? "active" : ""}`,
    i18n: key,
    onClick: (e) => {
      currentTab = tab;
      e.target.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      renderTab();
    },
  });

  const navTabs = !isEdit ? createEl("div", { className: "modal-toolbar" }, [
    createEl("div", { className: "overview-year-nav" }, [makeTab("single", "student_tab_single"), makeTab("batch", "student_tab_batch")]),
  ]) : null;

  const header = createEl("div", { className: "modal-header" }, [
    createEl("h3", { className: "modal-title", i18n: isEdit ? "student_modal_edit" : "student_modal_new" }),
    createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
  ]);

  const toolbar = createEl("div", { className: "modal-toolbar" }, [
    createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
    saveBtn,
  ]);

  renderTab();
  overlay.appendChild(createEl("div", { className: "modal-box" }, [header, navTabs, container, toolbar].filter(Boolean)));
  overlay.classList.add("active");
}
