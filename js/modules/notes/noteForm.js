import { createEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { addNote } from "./notesModel.js";
import { getActiveStudent, getActiveStudentId } from "../../services/studentService.js";
import { getSchoolConfig } from "../../services/schoolService.js";

const TAG_GROUPS = [
  { cat: "tags_cat_didactic", tags: ["notes_tag_obs", "notes_tag_chk", "notes_tag_task", "notes_tag_met", "notes_tag_att", "notes_tag_comp"] },
  { cat: "tags_cat_relational", tags: ["notes_tag_soc", "notes_tag_anx", "notes_tag_peer"] },
  { cat: "tags_cat_outcomes", tags: ["notes_tag_aut", "notes_tag_suc", "notes_tag_cri", "notes_tag_imp"] },
];

export function createNoteForm(onNoteAdded) {
  let selectedTags = [];
  const contentInput = createEl("textarea", { className: "textarea-input", i18nPlaceholder: "notes_content_placeholder" });

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

  const submitBtn = createEl("button", {
    className: "btn btn-primary btn-block",
    i18n: "notes_btn_add",
    onClick: async () => {
      if (!contentInput.value.trim()) return;
      const activeId = getActiveStudentId();
      const isClass = activeId && activeId.startsWith("class_");
      const st = await getActiveStudent();
      const target = isClass ? activeId.replace("class_", "Classe ") : (st ? st.name : "Generale");
      const cfg = await getSchoolConfig();
      const meta = {
        schoolYear: cfg?.activeYear || "",
        className: isClass ? activeId.replace("class_", "") : (st?.className || ""),
        studentId: st?.id || null, personId: st?.personId || null,
      };
      await addNote(target, contentInput.value, selectedTags, isClass, meta);
      contentInput.value = "";
      showToast(t("toast_saved"), "success");
      if (onNoteAdded) onNoteAdded();
    },
  });

  return createEl("div", { className: "card" }, [
    createEl("div", { className: "form-group" }, [contentInput]),
    tagGroupsEl,
    submitBtn,
  ]);
}
