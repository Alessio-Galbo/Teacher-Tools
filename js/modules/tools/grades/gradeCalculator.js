export function parseGrade(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim().replace(",", ".");
  if (!str) return null;
  const direct = parseFloat(str);
  if (!isNaN(direct) && !str.includes("+") && !str.includes("-") && !str.includes("/")) {
    return direct;
  }
  if (str.includes("/")) {
    const parts = str.split("/").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return (parts[0] + parts[1]) / 2;
    }
  }
  if (str.endsWith("½")) {
    const base = parseFloat(str.slice(0, -1));
    return isNaN(base) ? null : base + 0.5;
  }
  if (str.endsWith("+")) {
    const base = parseFloat(str.slice(0, -1));
    return isNaN(base) ? null : base + 0.25;
  }
  if (str.endsWith("-")) {
    const base = parseFloat(str.slice(0, -1));
    return isNaN(base) ? null : base - 0.25;
  }
  if (str.endsWith("=")) {
    const base = parseFloat(str.slice(0, -1));
    return isNaN(base) ? null : base - 0.25;
  }
  return isNaN(direct) ? null : direct;
}

export function computeAssessmentAverage(gradesMap) {
  if (!gradesMap || typeof gradesMap !== "object") return null;
  const vals = Object.values(gradesMap)
    .map((entry) => parseGrade(typeof entry === "object" ? entry.grade : entry))
    .filter((v) => v !== null && !isNaN(v));
  if (vals.length === 0) return null;
  const sum = vals.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}

export function computeWeightedAverage(gradeWeightPairs) {
  let totalWeighted = 0;
  let totalWeight = 0;
  for (const { grade, weight } of gradeWeightPairs) {
    const num = parseGrade(grade);
    const w = typeof weight === "number" && weight > 0 ? weight : 1.0;
    if (num !== null && !isNaN(num)) {
      totalWeighted += num * w;
      totalWeight += w;
    }
  }
  if (totalWeight === 0) return null;
  return Math.round((totalWeighted / totalWeight) * 100) / 100;
}
