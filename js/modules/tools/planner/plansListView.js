import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { getPlans, removePlan } from "./planModel.js";
import { showPlanModal } from "./planModal.js";

export async function renderPlansListView(container) {
  clearEl(container);
  const cfg = await getSchoolConfig();
  const classes = await getClasses(cfg.activeYear);
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
  const plans = await getPlans(cfg.activeYear);

  const toolbarCard = createEl("div", { className: "card tools-toolbar-card" });
  toolbarCard.appendChild(createEl("h3", { className: "card-title", i18n: "planner_tab_plans" }, t("planner_tab_plans")));
  const newBtn = createEl("button", { className: "btn btn-primary btn-sm", i18n: "planner_btn_new_plan" }, t("planner_btn_new_plan"));
  newBtn.addEventListener("click", () => showPlanModal({ onSaved: () => renderPlansListView(container) }));
  toolbarCard.appendChild(newBtn);
  container.appendChild(toolbarCard);

  const listContainer = createEl("div", { className: "plans-list-container" });
  container.appendChild(listContainer);

  if (plans.length === 0) {
    const empty = createEl("div", { className: "tools-empty-state" });
    empty.appendChild(createEl("span", { className: "tools-empty-icon" }, "📖"));
    empty.appendChild(createEl("p", { className: "text-muted", i18n: "planner_no_plans" }, t("planner_no_plans")));
    listContainer.appendChild(empty);
    return;
  }

  plans.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  plans.forEach((p) => {
    const card = createEl("div", { className: "card plan-card" });
    const cardHead = createEl("div", { className: "card-header" });
    const titles = createEl("div");
    titles.appendChild(createEl("h4", { className: "card-title" }, p.title));
    titles.appendChild(createEl("span", { className: "text-muted" }, `${p.subject || "-"} • ${p.period || "Anno Intero"}`));
    cardHead.appendChild(titles);

    const actions = createEl("div", { className: "quiz-card-actions" });
    const editBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "notes_btn_edit" }, t("notes_btn_edit"));
    editBtn.addEventListener("click", () => showPlanModal({ plan: p, onSaved: () => renderPlansListView(container) }));
    const delBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, "🗑️");
    delBtn.addEventListener("click", async () => {
      if (confirm(t("planner_plan_delete_confirm"))) {
        await removePlan(p.id);
        showToast("planner_plan_deleted");
        renderPlansListView(container);
      }
    });
    actions.appendChild(editBtn); actions.appendChild(delBtn);
    cardHead.appendChild(actions);
    card.appendChild(cardHead);

    const meta = createEl("div", { className: "grade-card-meta" });
    p.classIds.forEach((cId) => {
      meta.appendChild(createEl("span", { className: "badge badge-primary" }, classMap[cId] || cId));
    });
    card.appendChild(meta);
    listContainer.appendChild(card);
  });
}
