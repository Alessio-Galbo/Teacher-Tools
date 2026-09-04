import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { addNote } from "./notesModel.js";
import { getActiveStudent, getActiveStudentId } from "../../services/studentService.js";

const TAG_GROUPS = [
  { cat: "tags_cat_didactic", tags: ["notes_tag_obs", "notes_tag_chk", "notes_tag_task", "notes_tag_met", "notes_tag_att", "notes_tag_comp"] },
  { cat: "tags_cat_relational", tags: ["notes_tag_soc", "notes_tag_anx", "notes_tag_peer"] },
  { cat: "tags_cat_outcomes", tags: ["notes_tag_aut", "notes_tag_suc", "notes_tag_cri", "notes_tag_imp"] },
];

export async function showNoteModal(options = {}) {
  const { onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const activeId = getActiveStudentId();
  const isClass = activeId && activeId.startsWith("class_");
  const st = await getActiveStudent();
  const target = isClass ? activeId.replace("class_", "Classe ") : (st ? st.name : "Generale");

  let selectedTags = [];
  const contentInput = createEl("textarea", { className: "textarea-input", i18nPlaceholder: "notes_content_placeholder" });
  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };

  const tagGroupsEl = createEl("div", { className: "form-group" },
    TAG_GROUPS.map((grp) =>
      createEl("div", { className: "tag-group-box" }, [
        createEl("div", { className: "tag-cat-label", i18n: grp.cat }),
        createEl("div", { className: "tags-bar" },
          grp.tags.map((tagKey) =>
            createEl("span", {
              className: "badge badge-tag",
              i18n: tagKey,
              onClick: (e) => {
                const val = t(tagKey);
                selectedTags = selectedTags.includes(val) ? selectedTags.filter((x) => x !== val) : [...selectedTags, val];
                e.target.classList.toggle("selected");
              },
            })
          )
        ),
      ])
    )
  );

  const saveBtn = createEl("button", {
    className: "btn btn-primary",
    i18n: "notes_btn_add",
    onClick: async () => {
      if (!contentInput.value.trim()) return;
      await addNote(target, contentInput.value.trim(), selectedTags, isClass);
      showToast(t("toast_saved"), "success");
      closeModal();
      if (onSaved) onSaved();
    },
  });

  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("div", { className: "modal-title-group" }, [
        createEl("h3", { className: "modal-title", i18n: "notes_modal_title" }),
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
