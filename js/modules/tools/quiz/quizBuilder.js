export function createQuestion(type, defaultPoints = {}) {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const points = typeof defaultPoints[type] === "number" ? defaultPoints[type] : (type === "open" ? 2 : (type === "true_false" ? 0.5 : 1));
  if (type === "multiple_choice") {
    return { id, type, points, prompt: "", options: ["", "", "", ""] };
  }
  if (type === "true_false") {
    return { id, type, points, prompt: "" };
  }
  if (type === "cloze") {
    return { id, type, points, prompt: "" };
  }
  return { id, type: "open", points, prompt: "", lines: 3 };
}

export function formatQuizAsText(meta, questions, variantName = "") {
  let out = `====================================================\n`;
  out += `${meta.title || "PROVA DI VERIFICA"}${variantName ? " - " + variantName : ""}\n`;
  out += `Materia: ${meta.subject || "-"} | Argomento: ${meta.topic || "-"}`;
  if (meta.teacherName) out += ` | Docente: ${meta.teacherName}`;
  out += `\nAlunno/a: _______________________ Data: _________ Classe: _____\n`;
  out += `VALUTAZIONE: Punti _____ / ${meta.maxScore || 10}  |  Voto: ____________\n`;
  out += `====================================================\n\n`;

  questions.forEach((q, idx) => {
    let pText = q.prompt || "(Quesito)";
    if (q.type === "cloze") {
      pText = pText.includes("[") ? pText.replace(/\[.*?\]/g, " [ .................... ] ") : `${pText} ....................`;
    }
    out += `${idx + 1}. [ ${q.points || 1} pt ] ${pText}\n`;
    if (q.type === "multiple_choice") {
      const letters = ["A", "B", "C", "D"];
      (q.options || []).forEach((opt, oIdx) => {
        out += `   [ ] ${letters[oIdx]}) ${opt || "..."}\n`;
      });
    } else if (q.type === "true_false") {
      out += `   [  ] VERO     [  ] FALSO\n`;
    } else if (q.type === "open") {
      for (let i = 0; i < (q.lines || 3); i++) {
        out += `   _____________________________________________________\n`;
      }
    }
    out += "\n";
  });
  return out;
}
