function formatNoteLine(n, showTarget = true) {
  const dateStr = new Date(n.createdAt).toLocaleDateString();
  const targetStr = showTarget ? ` [${n.studentCode || "Generale"}${n.className ? ` • ${n.className}` : ""}]` : "";
  const tagStr = (n.tags && n.tags.length > 0) ? ` (${n.tags.join(" ")})` : "";
  return `• [${dateStr}]${targetStr}: ${n.content}${tagStr}`;
}

export function generateStructuredSummary({ notes = [], activeId = "", schools = [], classes = [], students = [], keyword = "", year = "" }) {
  if (notes.length === 0) return "Nessuna osservazione presente per i criteri selezionati.";

  const byTag = {};
  notes.forEach((n) => { (n.tags || []).forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; }); });
  const tagSummary = Object.entries(byTag).map(([t, c]) => `${t}: ${c}`).join(", ") || "Generale";

  let scopeLabel = "Tutti gli Studenti";
  if (activeId && activeId.startsWith("school_")) {
    const s = schools.find((x) => `school_${x.id}` === activeId || x.id === activeId.replace("school_", ""));
    scopeLabel = s ? `Scuola: ${s.name}${s.city ? ` (${s.city})` : ""}` : "Scuola";
  } else if (activeId && activeId.startsWith("class_")) {
    scopeLabel = `Classe ${activeId.replace("class_", "")}`;
  } else if (activeId && activeId !== "__ALL__") {
    const st = students.find((x) => x.id === activeId);
    scopeLabel = st ? `Alunno: ${st.name}${st.className ? ` (Classe ${st.className})` : ""}` : "Alunno";
  }

  const lines = [
    "==================================================",
    "RIEPILOGO OSSERVAZIONI D'AULA",
    `Ambito: ${scopeLabel}`,
    `Anno Scolastico: ${year || "Attivo"} | Data Generazione: ${new Date().toLocaleDateString()}`,
    `Totale Note: ${notes.length} | Tag: ${tagSummary}`,
    keyword ? `Filtro di ricerca applicato: "${keyword}"` : null,
    "==================================================",
    "",
  ].filter(Boolean);

  if (activeId && activeId.startsWith("class_")) {
    const clsName = activeId.replace("class_", "").toLowerCase();
    const classOnly = notes.filter((n) => n.isClassNote || (n.studentCode || "").toLowerCase().startsWith("classe "));
    const stOnly = notes.filter((n) => !classOnly.includes(n));

    if (classOnly.length > 0) {
      lines.push("--- NOTE D'AULA / COLLETTIVE ---");
      classOnly.forEach((n) => lines.push(formatNoteLine(n, false)));
      lines.push("");
    }
    if (stOnly.length > 0) {
      lines.push("--- NOTE INDIVIDUALI DEGLI ALUNNI ---");
      stOnly.forEach((n) => lines.push(formatNoteLine(n, true)));
    }
  } else {
    notes.forEach((n, idx) => {
      lines.push(`${idx + 1}. ${formatNoteLine(n, true).replace(/^• /, "")}`);
    });
  }

  return lines.join("\n");
}
