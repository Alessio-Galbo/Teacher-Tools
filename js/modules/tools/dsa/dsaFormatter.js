const CONNECTIVES = [
  "perché", "poiché", "quindi", "tuttavia", "inoltre",
  "invece", "infine", "allora", "ma", "però", "dunque",
  "siccome", "sebbene", "mentre", "infatti", "difatti",
  "di conseguenza", "nonostante", "pertanto"
];

export function simplifyTextToSentences(rawText) {
  if (!rawText || !rawText.trim()) return [];
  const paragraphs = rawText.split(/\n+/);
  const result = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const sentences = trimmed
      .split(/(?<=[.?!;:])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    result.push(...sentences);
  }
  return result;
}

export function highlightConnectives(sentence) {
  if (!sentence) return "";
  let formatted = sentence;
  CONNECTIVES.forEach((word) => {
    const regex = new RegExp(`\\b(${word})\\b`, "gi");
    formatted = formatted.replace(regex, `<mark class="dsa-connective">$1</mark>`);
  });
  return formatted;
}

export function buildAccessibleHTML(sentences, isSimplified = true) {
  if (!sentences || sentences.length === 0) return "";
  if (!isSimplified) {
    return sentences.map((s) => `<p class="dsa-sentence">${highlightConnectives(s)}</p>`).join("");
  }
  return sentences
    .map((s) => `<div class="dsa-chunk"><span class="dsa-bullet">▸</span> ${highlightConnectives(s)}</div>`)
    .join("");
}
