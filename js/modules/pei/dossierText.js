import { t } from "../../i18n.js";
import { peiDimensions } from "./peiData.js";
import { assemblePeiText } from "./peiModel.js";

const TYPE_MAP = {
  secondaria_2: "pei_school_type_sec2",
  secondaria_1: "pei_school_type_sec1",
  primaria: "pei_school_type_prim",
  infanzia: "pei_school_type_inf",
  custom: "pei_school_type_custom",
};

export function buildFullDossierText(data = {}, legacyStudent = "", legacyDims = {}) {
  const isObj = data && typeof data === "object" && !Array.isArray(data) && ("selections" in data || "schoolType" in data);
  const selections = isObj ? (data.selections || {}) : data;
  const studentName = isObj ? (data.studentName || "") : legacyStudent;
  const effectiveDims = isObj ? (data.effectiveDims || {}) : legacyDims;
  const schoolName = isObj ? (data.schoolName || "") : "";
  const schoolType = isObj ? (data.schoolType || "secondaria_2") : "secondaria_2";
  const activeYear = isObj ? (data.activeYear || "") : "";

  const typeLabel = t(TYPE_MAP[schoolType] || "pei_school_type_sec2").toUpperCase();
  const header = [
    t("pei_dossier_republic"),
    `${t("pei_dossier_title")} - ${typeLabel}`,
    t("pei_dossier_guidelines"),
    schoolName ? `${t("pei_dossier_lbl_school")} ${schoolName}` : "",
    activeYear ? `${t("pei_dossier_lbl_year")} ${activeYear}` : "",
    studentName ? `${t("pei_dossier_lbl_student")} ${studentName}` : "",
    `${t("pei_dossier_lbl_date")} ${new Date().toLocaleDateString()}`,
    "------------------------------------------------------------------\n",
  ].filter(Boolean).join("\n");

  const sections = peiDimensions.map((dim) => {
    const sel = selections[dim.id] || {};
    const text = assemblePeiText(dim.id, sel.levelId, sel.goalId, sel.strategyId, effectiveDims[dim.id]);
    return `${t(dim.nameKey).toUpperCase()}\n\n${text}\n`;
  });

  return [header, ...sections].join("\n==================================================================\n\n");
}
