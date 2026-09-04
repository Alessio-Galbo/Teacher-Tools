import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { addNote, updateNote } from "./notesModel.js";
import { getActiveStudent, getActiveStudentId } from "../../services/studentService.js";
import { getSchools } from "../../services/schoolService.js";
import { createTagGroupsBox } from "./noteTagGroups.js";

export async function showNoteModal(options = {}) {
  const { note = null, onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const activeId = getActiveStudentId();
  let target = "Generale";
  let isClass = false;

  if (note) {
    target = note.studentCode || "Generale";
    isClass = Boolean(note.isClassNote);
  } else if (activeId && activeId.startsWith("school_")) {
    const schools = await getSchools();
    const sch = schools.find((s) => `school_${s.id}` === activeId || s.id === activeId.replace("school_", ""));
    target = sch ? sch.name : "Scuola";
  } else if (activeId && activeId.startsWith("class_")) {
    target = `Classe ${activeId.replace("class_", "")}`;
    isClass = true;
  } else {
    const st = await getActiveStudent();
    target = st ? st.name : "Generale";
  }

  let selectedTags = note && Array.isArray(note.tags) ? [...note.tags] : [];
  const contentInput = createEl("textarea", { className: "textarea-input", i18nPlaceholder: "notes_content_placeholder" });
  if (note && note.content) contentInput.value = note.content;

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  const tagGroupsEl = createTagGroupsBox(selectedTags, (tagVal) => {
    selectedTags = selectedTags.includes(tagVal) ? selectedTags.filter((x) => x !== tagVal) : [...selectedTags, tagVal];
  });

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "notes_btn_add",
    onClick: async () => {
      if (!contentInput.value.trim()) return;
      if (note) {
        await updateNote(note.id, { content: contentInput.value.trim(), tags: selectedTags });
      } else {
        await addNote(target, contentInput.value.trim(), selectedTags, isClass);
      }
      showToast(t("toast_saved"), "success");
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("div", { className: "modal-title-group" }, [
        createEl("h3", { className: "modal-title", i18n: note ? "notes_modal_title_edit" : "notes_modal_title" }),
        createEl("span", { className: "badge badge-primary" }, target),
      ]),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    createEl("div", { className: "modal-body" }, [
      createEl("div", { className: "form-group" }, [contentInput]),
      tagGroupsEl,
    ]),
    createEl("div", { className: "modal-toolbar" }, [
      createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel", onClick: closeModal }),
      saveBtn,
    ]),
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
  setTimeout(() => contentInput.focus(), 50);
}
