import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { renderDsaView } from "./dsa/dsaView.js";
import { renderQuizView } from "./quiz/quizView.js";
import { renderGradesView } from "./grades/gradesView.js";
import { renderPlannerView } from "./planner/plannerView.js";

let currentSubTab = "dsa";

const SUB_MODULES = [
  { id: "dsa", labelKey: "tools_tab_dsa", render: renderDsaView },
  { id: "quiz", labelKey: "tools_tab_quiz", render: renderQuizView },
  { id: "grades", labelKey: "tools_tab_grades", render: renderGradesView },
  { id: "planner", labelKey: "tools_tab_planner", render: renderPlannerView }
];

export function renderToolsView(container) {
  clearEl(container);

  const header = createEl("div", { className: "section-header-row" });
  const titleGroup = createEl("div", { className: "section-header-info" });
  titleGroup.appendChild(createEl("h2", { className: "section-title", i18n: "tools_title" }, t("tools_title")));
  titleGroup.appendChild(createEl("p", { className: "section-subtitle", i18n: "tools_subtitle" }, t("tools_subtitle")));
  header.appendChild(titleGroup);
  container.appendChild(header);

  const selectWrap = createEl("div", { className: "tools-select-wrap" });
  const dropdown = createEl("select", { className: "select-input tools-subnav-dropdown" });
  SUB_MODULES.forEach((mod) => {
    const opt = createEl("option", { value: mod.id, i18n: mod.labelKey }, t(mod.labelKey));
    if (mod.id === currentSubTab) opt.selected = true;
    dropdown.appendChild(opt);
  });
  dropdown.addEventListener("change", () => {
    currentSubTab = dropdown.value;
    subNav.querySelectorAll(".tools-subnav-btn").forEach((b, idx) => {
      b.classList.toggle("active", SUB_MODULES[idx].id === currentSubTab);
    });
    mountSubModule(contentArea, SUB_MODULES.find((m) => m.id === currentSubTab));
  });
  selectWrap.appendChild(dropdown);
  container.appendChild(selectWrap);

  const subNav = createEl("div", { className: "tools-subnav" });
  SUB_MODULES.forEach((mod) => {
    const btn = createEl("button", {
      className: `tools-subnav-btn ${mod.id === currentSubTab ? "active" : ""}`,
      i18n: mod.labelKey
    }, t(mod.labelKey));

    btn.addEventListener("click", () => {
      currentSubTab = mod.id;
      dropdown.value = mod.id;
      subNav.querySelectorAll(".tools-subnav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mountSubModule(contentArea, mod);
    });
    subNav.appendChild(btn);
  });
  container.appendChild(subNav);

  const contentArea = createEl("div", { className: "tools-content-area" });
  container.appendChild(contentArea);

  const activeModule = SUB_MODULES.find((m) => m.id === currentSubTab) || SUB_MODULES[0];
  mountSubModule(contentArea, activeModule);
}

function mountSubModule(contentArea, module) {
  clearEl(contentArea);
  module.render(contentArea);
}
