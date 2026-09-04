import { getAll, putItem, deleteItem } from "../../services/db.js";
import { createSnapshot } from "../../services/snapshot.js";

export async function addNote(targetCode, content, tags = [], isClassNote = false) {
  if (!targetCode.trim() || !content.trim()) throw new Error("Dati mancanti");
  const note = {
    id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    studentCode: targetCode.trim(),
    isClassNote: Boolean(isClassNote),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };
  await putItem("notes", note);
  await createSnapshot("Nuova Nota: " + note.studentCode);
  return note;
}

export async function getNotes(filterTag = null, searchKeyword = "") {
  const [notes, students] = await Promise.all([getAll("notes"), getAll("students")]);
  const kw = searchKeyword.toLowerCase().trim();
  const matchedStudent = kw ? students.find((s) => s.name.toLowerCase() === kw) : null;
  const studentClassName = matchedStudent && matchedStudent.className ? matchedStudent.className.toLowerCase() : "";

  return notes
    .filter((n) => {
      const matchTag = !filterTag || n.tags.includes(filterTag);
      if (!matchTag) return false;
      if (!kw) return true;

      const codeLower = n.studentCode.toLowerCase();
      const matchDirect = codeLower.includes(kw) || n.content.toLowerCase().includes(kw);
      const matchClassInherit = studentClassName && (codeLower === `classe ${studentClassName}` || codeLower === studentClassName);

      return matchDirect || matchClassInherit;
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
  allNotes.forEach((n) => {
    n.tags.forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; });
  });

  const tagSummary = Object.entries(byTag)
    .map(([tag, count]) => `${tag}: ${count} osservazioni`)
    .join(", ");

  const lines = [
    `RELAZIONE PERIODICA DI OSSERVAZIONE D'AULA`,
    `Destinatario: ${targetCode}`,
    `Data: ${new Date().toLocaleDateString()}`,
    `Numero osservazioni: ${allNotes.length}`,
    `Indicatori: ${tagSummary || "Generale"}`,
    `\nCRONOLOGIA OSSERVAZIONI:`,
    ...allNotes.map((n, i) => `${i + 1}. [${new Date(n.createdAt).toLocaleDateString()}] ${n.isClassNote ? "(Nota di Classe) " : ""}${n.content}`),
  ];
  return lines.join("\n");
}
