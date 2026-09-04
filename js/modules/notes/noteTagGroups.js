import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

const TAG_GROUPS = [
  { cat: "tags_cat_didactic", tags: ["notes_tag_obs", "notes_tag_chk", "notes_tag_task", "notes_tag_met", "notes_tag_att", "notes_tag_comp"] },
  { cat: "tags_cat_relational", tags: ["notes_tag_soc", "notes_tag_anx", "notes_tag_peer"] },
  { cat: "tags_cat_outcomes", tags: ["notes_tag_aut", "notes_tag_suc", "notes_tag_cri", "notes_tag_imp"] },
];

export function createTagGroupsBox(selectedTags, onToggle) {
  return createEl("div", { className: "form-group" },
    TAG_GROUPS.map((grp) =>
      createEl("div", { className: "tag-group-box" }, [
        createEl("div", { className: "tag-cat-label", i18n: grp.cat }),
        createEl("div", { className: "tags-bar" },
          grp.tags.map((tagKey) => {
            const val = t(tagKey);
            const isSel = selectedTags.includes(val);
            return createEl("span", {
              className: `badge badge-tag ${isSel ? "selected" : ""}`,
              i18n: tagKey,
              onClick: (e) => {
                e.target.classList.toggle("selected");
                onToggle(val);
              },
            });
          })
        ),
      ])
    )
  );
}
