import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { getCalendarEvents, removeCalendarEvent } from "./calendarModel.js";
import { showCalendarEventModal } from "./calendarEventModal.js";
import { renderCalendarEventCard } from "./calendarCardRenderer.js";

export async function renderCalendarView(container) {
  clearEl(container);
  const cfg = await getSchoolConfig();
  const classes = await getClasses(cfg.activeYear);
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
  let mode = "teacher";
  let selectedClassId = "";

  const toolbarCard = createEl("div", { className: "card tools-toolbar-card" });
  const modeGroup = createEl("div", { className: "calendar-mode-group" });
  const teacherBtn = createEl("button", { className: "btn btn-sm btn-primary", i18n: "calendar_mode_teacher" }, t("calendar_mode_teacher"));
  const studentBtn = createEl("button", { className: "btn btn-sm btn-secondary", i18n: "calendar_mode_student" }, t("calendar_mode_student"));

  teacherBtn.addEventListener("click", () => {
    mode = "teacher"; teacherBtn.className = "btn btn-sm btn-primary"; studentBtn.className = "btn btn-sm btn-secondary"; refreshList();
  });
  studentBtn.addEventListener("click", () => {
    mode = "student"; studentBtn.className = "btn btn-sm btn-primary"; teacherBtn.className = "btn btn-sm btn-secondary"; refreshList();
  });
  modeGroup.appendChild(teacherBtn); modeGroup.appendChild(studentBtn);
  toolbarCard.appendChild(modeGroup);

  const filterSel = createEl("select", { className: "select-input tools-filter-select" });
  filterSel.appendChild(createEl("option", { value: "", i18n: "grades_filter_class" }, t("grades_filter_class")));
  classes.forEach((c) => filterSel.appendChild(createEl("option", { value: c.id }, c.name)));
  filterSel.addEventListener("change", (e) => { selectedClassId = e.target.value; refreshList(); });
  toolbarCard.appendChild(filterSel);

  const newBtn = createEl("button", { className: "btn btn-primary btn-sm", i18n: "planner_btn_new_event" }, t("planner_btn_new_event"));
  newBtn.addEventListener("click", () => showCalendarEventModal({ onSaved: () => refreshList() }));
  toolbarCard.appendChild(newBtn);
  container.appendChild(toolbarCard);

  const listContainer = createEl("div", { className: "calendar-list-container" });
  container.appendChild(listContainer);

  const refreshList = async () => {
    clearEl(listContainer);
    newBtn.style.display = mode === "teacher" ? "" : "none";
    const all = await getCalendarEvents(cfg.activeYear);
    let filtered = all.filter((ev) => !selectedClassId || ev.classId === selectedClassId);
    if (mode === "student") {
      filtered = filtered.filter((ev) => ev.type !== "meeting");
    }
    if (filtered.length === 0) {
      const empty = createEl("div", { className: "tools-empty-state" });
      empty.appendChild(createEl("span", { className: "tools-empty-icon" }, "🗓️"));
      empty.appendChild(createEl("p", { className: "text-muted", i18n: "calendar_no_events" }, t("calendar_no_events")));
      listContainer.appendChild(empty);
      return;
    }
    filtered.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    filtered.forEach((ev) => {
      listContainer.appendChild(renderCalendarEventCard(ev, classMap, mode === "teacher",
        (e) => showCalendarEventModal({ event: e, onSaved: () => refreshList() }),
        async (e) => {
          if (confirm(t("calendar_event_deleted"))) {
            await removeCalendarEvent(e.id);
            showToast("toast_deleted");
            refreshList();
          }
        }
      ));
    });
  };
  refreshList();
}
