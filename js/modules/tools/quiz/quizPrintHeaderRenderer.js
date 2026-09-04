import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

function renderTopRow(meta, pref) {
  const row = createEl("div", { className: "quiz-print-inst-row" });
  if (pref.fields?.school !== false) {
    row.appendChild(createEl("span", { className: "quiz-print-school" }, (meta.schoolName || "ISTITUTO SCOLASTICO").toUpperCase()));
  }
  if (pref.fields?.teacher !== false && meta.teacherName) {
    row.appendChild(createEl("span", { className: "quiz-print-teacher" }, `Docente: ${meta.teacherName}`));
  }
  row.appendChild(createEl("span", { className: "quiz-print-year" }, `A.S. ${meta.academicYear || ""}`));
  return row;
}

function renderMetaColumns(meta, pref, totalPoints) {
  const showStudent = pref.fields?.student !== false;
  const showDateClass = pref.fields?.dateClass !== false;
  const showPoints = pref.fields?.points !== false;
  const showVote = pref.fields?.vote !== false;

  const hasLeft = showStudent || showDateClass;
  const hasRight = showPoints || showVote;
  if (!hasLeft && !hasRight) return null;

  const table = createEl("div", {
    className: `quiz-print-meta-table ${!hasRight ? "no-eval" : ""} ${!hasLeft ? "no-student" : ""}`.trim()
  });

  if (hasLeft) {
    const leftCol = createEl("div", { className: "quiz-print-meta-col quiz-print-meta-col-left" });
    if (showStudent) {
      leftCol.appendChild(createEl("div", { className: "quiz-meta-line" }, `${t("quiz_print_student")} ____________________________________`));
    }
    if (showDateClass) {
      leftCol.appendChild(createEl("div", { className: "quiz-meta-line" }, `${t("quiz_print_class")} __________    ${t("quiz_print_date")} __________`));
    }
    table.appendChild(leftCol);
  }

  if (hasRight) {
    const rightCol = createEl("div", { className: "quiz-print-meta-col quiz-print-meta-col-right" });
    if (showPoints) {
      const pts = meta.maxScore || totalPoints || 10;
      rightCol.appendChild(createEl("div", { className: "quiz-meta-line" }, `${t("quiz_print_score")} ________ / ${pts}`));
    }
    if (showVote) {
      rightCol.appendChild(createEl("div", { className: "quiz-meta-line" }, `${t("quiz_print_vote")} ____________________`));
    }
    table.appendChild(rightCol);
  }
  return table;
}

export function renderPrintHeader(meta, variantName, pref = {}, totalPoints = 10) {
  const style = pref.headerStyle || "formal";
  const box = createEl("div", { className: `quiz-print-header-box header-style-${style}` });

  box.appendChild(renderTopRow(meta, pref));

  const mainRow = createEl("div", { className: "quiz-print-main-row" });
  const titleGroup = createEl("div", { className: "quiz-print-title-group" });
  const defaultTitle = meta.subject ? `${t("quiz_print_title")} (${meta.subject})` : t("quiz_print_title");
  const displayTitle = (meta.title && meta.title.trim()) ? meta.title.trim() : defaultTitle;
  titleGroup.appendChild(createEl("h2", { className: "quiz-print-title" }, displayTitle));
  if (pref.fields?.topic !== false && meta.topic) {
    titleGroup.appendChild(createEl("div", { className: "quiz-print-topic" }, `Argomento: ${meta.topic}`));
  }
  mainRow.appendChild(titleGroup);

  if (variantName) {
    mainRow.appendChild(createEl("div", { className: "quiz-print-variant-stamp" }, variantName.toUpperCase()));
  }
  box.appendChild(mainRow);

  const metaTable = renderMetaColumns(meta, pref, totalPoints);
  if (metaTable) box.appendChild(metaTable);

  if (pref.fields?.instructions !== false) {
    box.appendChild(createEl("div", { className: "quiz-print-instructions" }, t("quiz_print_instructions")));
  }
  return box;
}
