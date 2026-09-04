import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSchoolConfig } from "../../../services/schoolConfigService.js";
import { getClasses } from "../../../services/classService.js";
import { getAssessments, removeAssessment } from "./gradesModel.js";
import { showGradeModal } from "./gradeModal.js";
import { renderAssessmentCard } from "./gradesCardRenderer.js";

export async function renderGradesView(container) {
  clearEl(container);
  const cfg = await getSchoolConfig();
  const year = cfg.activeYear;
  const classes = await getClasses(year);
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
  const assessments = await getAssessments(year);

  const toolbarCard = createEl("div", { className: "card tools-toolbar-card" });
  const filterGrp = createEl("div", { className: "tools-filter-group" });
  const filterClass = createEl("select", { className: "select-input tools-filter-select" });
  filterClass.appendChild(createEl("option", { value: "", i18n: "grades_filter_class" }, t("grades_filter_class")));
  classes.forEach((c) => filterClass.appendChild(createEl("option", { value: c.id }, c.name)));
  filterGrp.appendChild(filterClass);

  const newBtn = createEl("button", { className: "btn btn-primary", i18n: "grades_btn_new" }, t("grades_btn_new"));
  newBtn.addEventListener("click", () => {
    showGradeModal({ onSaved: () => renderGradesView(container) });
  });

  toolbarCard.appendChild(filterGrp);
  toolbarCard.appendChild(newBtn);
  container.appendChild(toolbarCard);

  const listContainer = createEl("div", { className: "grades-list-container" });
  container.appendChild(listContainer);

  const refreshList = () => {
    clearEl(listContainer);
    const selectedClass = filterClass.value;
    const filtered = assessments.filter((a) => !selectedClass || a.classId === selectedClass);
    if (filtered.length === 0) {
      const empty = createEl("div", { className: "tools-empty-state" });
      empty.appendChild(createEl("span", { className: "tools-empty-icon" }, "📊"));
      empty.appendChild(createEl("p", { className: "text-muted", i18n: "grades_no_assessments" }, t("grades_no_assessments")));
      listContainer.appendChild(empty);
      return;
    }
    filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    filtered.forEach((a) => {
      const card = renderAssessmentCard(
        a,
        classMap,
        (asm) => showGradeModal({ assessment: asm, onSaved: () => renderGradesView(container) }),
        async (asm) => {
          if (confirm(t("grades_delete_confirm"))) {
            await removeAssessment(asm.id);
            showToast("grades_deleted");
            renderGradesView(container);
          }
        }
      );
      listContainer.appendChild(card);
    });
  };

  filterClass.addEventListener("change", refreshList);
  refreshList();
}
