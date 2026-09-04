import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { saveCalendarEvent } from "./calendarModel.js";

function makeField(labelKey, input) {
  const grp = createEl("div", { className: "form-group" });
  grp.appendChild(createEl("label", { className: "form-label", i18n: labelKey }, t(labelKey)));
  grp.appendChild(input);
  return grp;
}

export async function showCalendarEventModal(options = {}) {
  const { event = null, onSaved = null } = options;
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const cfg = await getSchoolConfig();
  const classes = await getClasses(cfg.activeYear);

  const modal = createEl("div", { className: "modal-dialog modal-md" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "planner_btn_new_event" }, t("planner_btn_new_event")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  const titleInp = createEl("input", { type: "text", className: "input-text", value: event?.title || "", placeholder: "es. Verifica Scritta Cap. 3" });
  const dateInp = createEl("input", { type: "date", className: "input-text", value: event?.date || new Date().toISOString().split("T")[0] });
  const timeInp = createEl("input", { type: "text", className: "input-text", value: event?.time || "", placeholder: "es. 10:00 - 11:00" });

  const classSel = createEl("select", { className: "select-input" });
  classes.forEach((c) => {
    const opt = createEl("option", { value: c.id }, c.name);
    if (event?.classId === c.id) opt.selected = true;
    classSel.appendChild(opt);
  });

  const typeSel = createEl("select", { className: "select-input" });
  ["test", "lesson", "homework", "meeting"].forEach((k) => {
    const opt = createEl("option", { value: k, i18n: `calendar_type_${k}` }, t(`calendar_type_${k}`));
    if (event?.type === k) opt.selected = true;
    typeSel.appendChild(opt);
  });

  const notesInp = createEl("textarea", { className: "textarea-input", rows: "2", value: event?.notes || "", placeholder: "Annotazioni riservate per il docente..." });

  body.appendChild(makeField("calendar_field_title", titleInp));
  body.appendChild(makeField("calendar_field_date", dateInp));
  body.appendChild(makeField("calendar_field_time", timeInp));
  body.appendChild(makeField("calendar_field_class", classSel));
  body.appendChild(makeField("calendar_field_type", typeSel));
  body.appendChild(makeField("calendar_field_notes", notesInp));
  modal.appendChild(body);

  const foot = createEl("div", { className: "modal-footer" });
  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel" }, t("btn_cancel"));
  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save" }, t("btn_save"));
  foot.appendChild(cancelBtn); foot.appendChild(saveBtn);
  modal.appendChild(foot);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal); cancelBtn.addEventListener("click", closeModal);

  saveBtn.addEventListener("click", async () => {
    await saveCalendarEvent({
      id: event?.id,
      title: titleInp.value.trim() || t("calendar_type_test"),
      date: dateInp.value,
      time: timeInp.value.trim(),
      classId: classSel.value,
      academicYear: cfg.activeYear,
      type: typeSel.value,
      notes: notesInp.value.trim()
    });
    showToast("calendar_event_saved");
    closeModal();
    if (onSaved) onSaved();
  });

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
