import { createEl, clearEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { renderPlansListView } from "./plansListView.js";
import { renderCalendarView } from "./calendarView.js";

let currentPlannerSubTab = "plans";

export function renderPlannerView(container) {
  clearEl(container);

  const subNav = createEl("div", { className: "tools-subnav planner-subnav" });
  const tabs = [
    { id: "plans", labelKey: "planner_tab_plans", render: renderPlansListView },
    { id: "calendar", labelKey: "planner_tab_calendar", render: renderCalendarView }
  ];

  tabs.forEach((tab) => {
    const btn = createEl("button", {
      className: `tools-subnav-btn ${tab.id === currentPlannerSubTab ? "active" : ""}`,
      i18n: tab.labelKey
    }, t(tab.labelKey));

    btn.addEventListener("click", () => {
      currentPlannerSubTab = tab.id;
      subNav.querySelectorAll(".tools-subnav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      clearEl(subContent);
      tab.render(subContent);
    });
    subNav.appendChild(btn);
  });
  container.appendChild(subNav);

  const subContent = createEl("div", { className: "planner-content-area" });
  container.appendChild(subContent);

  const activeTab = tabs.find((t) => t.id === currentPlannerSubTab) || tabs[0];
  activeTab.render(subContent);
}
