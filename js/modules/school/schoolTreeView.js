import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { getSchoolConfig, getActiveSchool, getClasses, addClass } from "../../services/schoolService.js";
import { getStudents } from "../../services/studentService.js";
import { createTreeNode } from "./treeNode.js";
import { createClassTreeNode } from "./classTreeNode.js";

export function createSchoolTreeView(onRefresh) {
  const container = createEl("div", { className: "tree-container card" });
  let renderSeq = 0;

  async function render() {
    const curSeq = ++renderSeq;
    const config = await getSchoolConfig();
    const school = await getActiveSchool();

    if (curSeq !== renderSeq) return;

    if (!school) {
      container.replaceChildren();
      container.style.display = "none";
      return;
    }

    container.style.display = "";
    const classes = await getClasses(config.activeYear, school.id);
    const students = await getStudents(config.activeYear);
    if (curSeq !== renderSeq) return;

    const refreshCallback = () => { render(); if (onRefresh) onRefresh(); };
    const classNodes = classes.map((cls) => createClassTreeNode(cls, students, refreshCallback));

    const addClassBtn = createEl("button", {
      className: "btn btn-secondary btn-block",
      i18n: "school_btn_add_class",
      onClick: async () => {
        const name = prompt(t("school_prompt_class_name"));
        if (name && name.trim()) {
          await addClass(name, config.activeYear, null, school.id);
          refreshCallback();
        }
      },
    });

    const rootNode = createTreeNode({
      icon: "🏫",
      title: `${school.name}${school.city ? ` (${school.city})` : ""}`,
      badges: [createEl("span", { className: "badge badge-primary" }, config.activeYear)],
      children: classNodes,
      isCollapsible: false,
    });

    container.replaceChildren(rootNode, createEl("div", { className: "form-group" }, [addClassBtn]));
  }

  window.addEventListener("activeSchoolChanged", render);
  window.addEventListener("globalYearChanged", render);
  render();
  return { el: container, refresh: render };
}
