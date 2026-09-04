import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

export function renderCalendarEventCard(event, classMap, isTeacherMode, onEdit, onDelete) {
  const card = createEl("div", { className: `card calendar-event-card type-${event.type}` });
  const head = createEl("div", { className: "card-header" });
  const titles = createEl("div");
  titles.appendChild(createEl("h4", { className: "card-title" }, event.title));
  const subText = `${event.date} ${event.time ? "• " + event.time : ""} • ${classMap[event.classId] || "Tutte"}`;
  titles.appendChild(createEl("span", { className: "text-muted" }, subText));
  head.appendChild(titles);

  const actions = createEl("div", { className: "quiz-card-actions" });
  if (isTeacherMode) {
    const editBtn = createEl("button", { className: "btn btn-secondary btn-sm", i18n: "notes_btn_edit" }, t("notes_btn_edit"));
    editBtn.addEventListener("click", () => onEdit(event));
    const delBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, "🗑️");
    delBtn.addEventListener("click", () => onDelete(event));
    actions.appendChild(editBtn); actions.appendChild(delBtn);
  }
  head.appendChild(actions);
  card.appendChild(head);

  const meta = createEl("div", { className: "grade-card-meta" });
  meta.appendChild(createEl("span", { className: "badge badge-primary", i18n: `calendar_type_${event.type}` }, t(`calendar_type_${event.type}`)));
  if (isTeacherMode && event.notes) {
    card.appendChild(createEl("p", { className: "calendar-event-notes" }, `📝 ${event.notes}`));
  }
  card.appendChild(meta);
  return card;
}
