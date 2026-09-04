import { t } from "../../i18n.js";
import { peiDimensions } from "./peiData.js";
import { assemblePeiText } from "./peiModel.js";

export function buildFullDossierText(selections = {}, studentName = "") {
  const header = [
    "PIANO EDUCATIVO INDIVIDUALIZZATO (PEI) - SCUOLA SECONDARIA II GRADO",
    "Linee Guida Ministeriali D.I. 182/2020 e D.I. 153/2023",
    studentName ? `Studente: ${studentName}` : "",
    `Data Documento: ${new Date().toLocaleDateString()}`,
    "------------------------------------------------------------------\n",
  ].filter(Boolean).join("\n");

  const sections = peiDimensions.map((dim) => {
    const sel = selections[dim.id] || {};
    const text = assemblePeiText(dim.id, sel.levelId, sel.goalId, sel.strategyId);
    return `${t(dim.nameKey).toUpperCase()}\n\n${text}\n`;
  });

  return [header, ...sections].join("\n==================================================================\n\n");
}
