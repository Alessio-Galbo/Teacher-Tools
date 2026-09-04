import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { showToast } from "../../utils/toast.js";
import { getClasses, addClass, removeClass, getSchoolConfig } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { showRolloverModal } from "./rolloverModal.js";

export function createClassListCard(onClassSelected, onRefreshNeeded) {
  const card = createEl("div", { className: "card" });

  async function render() {
    card.replaceChildren();
    const config = await getSchoolConfig();
    const classes = await getClasses(config.activeYear);
    const students = await getStudents(config.activeYear);

    const addClassBtn = createEl("button", {
      className: "btn btn-secondary btn-sm",
      i18n: "school_btn_add_class",
      onClick: async () => {
        const name = prompt(t("school_prompt_class_name"));
        if (name && name.trim()) {
          await addClass(name, config.activeYear);
          showToast(t("school_class_created"), "success");
          render();
          if (onRefreshNeeded) onRefreshNeeded();
        }
      },
    });

    const header = createEl("div", { className: "card-header" }, [
      createEl("h3", { className: "card-title", i18n: "school_classes_title" }),
      addClassBtn,
    ]);

    const chipsContainer = createEl("div", { className: "class-chips-container" });

    if (classes.length === 0) {
      chipsContainer.appendChild(createEl("p", { className: "app-subtitle", i18n: "school_classes_empty" }));
    } else {
      classes.forEach((c) => {
        const count = students.filter((s) => s.classId === c.id || s.className === c.name).length;
        const promoteBtn = createEl("button", {
          className: "btn btn-secondary btn-sm",
          i18n: "school_btn_promote",
          onClick: (e) => {
            e.stopPropagation();
            showRolloverModal(c, () => {
              render();
              if (onRefreshNeeded) onRefreshNeeded();
            });
          },
        });

        const deleteBtn = createEl("span", {
          className: "class-chip-remove",
          onClick: async (e) => {
            e.stopPropagation();
            if (confirm(t("school_class_delete_confirm"))) {
              await removeClass(c.id);
              render();
              if (onRefreshNeeded) onRefreshNeeded();
            }
          },
        }, "✕");

        const chip = createEl("div", {
          className: "class-chip",
          onClick: () => { if (onClassSelected) onClassSelected(c); },
        }, [
          createEl("span", {}, `🏫 ${c.name} (${count})`),
          promoteBtn,
          deleteBtn,
        ]);
        chipsContainer.appendChild(chip);
      });
    }

    card.appendChild(header);
    card.appendChild(chipsContainer);
  }

  render();
  return { el: card, refresh: render };
}
