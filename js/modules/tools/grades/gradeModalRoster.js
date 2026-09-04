import { createEl, clearEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

export function renderRoster(container, students, existingGrades = {}) {
  clearEl(container);
  if (!students || students.length === 0) {
    container.appendChild(createEl("p", { className: "text-muted", i18n: "school_no_students_in_class" }, t("school_no_students_in_class")));
    return;
  }
  const table = createEl("table", { className: "grades-roster-table" });
  const thead = createEl("thead");
  const trHead = createEl("tr");
  trHead.appendChild(createEl("th", { i18n: "grades_col_student" }, t("grades_col_student")));
  trHead.appendChild(createEl("th", { i18n: "grades_col_grade" }, t("grades_col_grade")));
  trHead.appendChild(createEl("th", { i18n: "grades_col_notes" }, t("grades_col_notes")));
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = createEl("tbody");
  students.forEach((st) => {
    const entry = existingGrades[st.id] || {};
    const tr = createEl("tr", { "data-student-id": st.id });
    const tdName = createEl("td", { className: "grades-student-name" }, st.name);

    const tdGrade = createEl("td");
    const gradeInp = createEl("input", {
      type: "text",
      className: "input-text grade-input",
      placeholder: "es. 7.5",
      value: entry.grade || ""
    });
    tdGrade.appendChild(gradeInp);

    const tdNote = createEl("td");
    const noteInp = createEl("input", {
      type: "text",
      className: "input-text grade-note-input",
      placeholder: "Note/Misure...",
      value: entry.notes || ""
    });
    tdNote.appendChild(noteInp);

    tr.appendChild(tdName);
    tr.appendChild(tdGrade);
    tr.appendChild(tdNote);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

export function extractRosterData(container) {
  const grades = {};
  container.querySelectorAll("tr[data-student-id]").forEach((tr) => {
    const sId = tr.dataset.studentId;
    const gradeVal = tr.querySelector(".grade-input")?.value?.trim() || "";
    const notesVal = tr.querySelector(".grade-note-input")?.value?.trim() || "";
    if (gradeVal || notesVal) {
      grades[sId] = { grade: gradeVal, notes: notesVal };
    }
  });
  return grades;
}
