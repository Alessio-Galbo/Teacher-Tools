import { getAll, putItem, deleteItem } from "../../services/db.js";
import { createSnapshot } from "../../services/snapshot.js";

export async function addNote(targetCode, content, tags = [], isClassNote = false, meta = {}) {
  if (!targetCode.trim() || !content.trim()) throw new Error("Dati mancanti");
  const note = {
    id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    studentCode: targetCode.trim(),
    isClassNote: Boolean(isClassNote),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : [],
    schoolYear: meta.schoolYear || "",
    className: meta.className || (isClassNote ? targetCode.replace(/^Classe\s+/, "") : ""),
    createdAt: meta.createdAt || new Date().toISOString(),
  };
  await putItem("notes", note);
  await createSnapshot("Nuova Nota: " + note.studentCode);
  return note;
}

export async function updateNote(id, updates) {
  const notes = await getAll("notes");
  const existing = notes.find((n) => n.id === id);
  if (!existing) throw new Error("Nota non trovata");
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  await putItem("notes", merged);
  await createSnapshot("Modifica Nota: " + (merged.studentCode || id));
  return merged;
}

export async function getNotes(filterTag = null, searchKeyword = "") {
  const [notes, students] = await Promise.all([getAll("notes"), getAll("students")]);
  const kw = searchKeyword.toLowerCase().trim();
  const matched = kw ? students.find((s) => s.name.toLowerCase() === kw) : null;
  const clsName = matched && matched.className ? matched.className.toLowerCase() : "";

  return notes
    .map((n) => {
      if (!n.schoolYear && n.createdAt) {
        const d = new Date(n.createdAt);
        const y = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
        n.schoolYear = `${y}/${y + 1}`;
      }
      if (!n.className) {
        if (n.isClassNote) n.className = (n.studentCode || "").replace(/^Classe\s+/, "");
        else {
          const st = students.find((s) => s.name === n.studentCode);
          if (st?.className) n.className = st.className;
        }
      }
      return n;
    })
    .filter((n) => {
      if (filterTag && !n.tags.includes(filterTag)) return false;
      if (!kw) return true;
      const code = (n.studentCode || "").toLowerCase();
      return code.includes(kw) || n.content.toLowerCase().includes(kw) || (clsName && (code === `classe ${clsName}` || code === clsName));
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function removeNote(id) {
  await deleteItem("notes", id);
  await createSnapshot("Eliminazione Nota");
}

export async function generateStudentSummary(targetCode) {
  const allNotes = await getNotes(null, targetCode);
  if (allNotes.length === 0) return "Nessuna osservazione registrata.";

  const byTag = {};
  allNotes.forEach((n) => { n.tags.forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; }); });
  const tagSummary = Object.entries(byTag).map(([t, c]) => `${t}: ${c}`).join(", ");

  const lines = [
    `RELAZIONE OSSERVAZIONE D'AULA - Destinatario: ${targetCode}`,
    `Data: ${new Date().toLocaleDateString()} | Totale Note: ${allNotes.length}`,
    `Tag: ${tagSummary || "Generale"}\n`,
    ...allNotes.map((n, i) => `${i + 1}. [${new Date(n.createdAt).toLocaleDateString()}] ${n.content}`),
  ];
  return lines.join("\n");
}
