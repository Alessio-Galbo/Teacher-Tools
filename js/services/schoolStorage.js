import { getAll, putItem, deleteItem } from "./db.js";
import { getSchoolConfig } from "./schoolConfigService.js";

export async function getAllSchoolsRaw() {
  const list = await getAll("schools");
  return list.map((s) => ({ ...s, years: Array.isArray(s.years) ? s.years : [s.year || "2024/2025"] }));
}

export async function getSchools(targetYear = null) {
  const config = await getSchoolConfig();
  const yr = targetYear || config.activeYear;
  const all = await getAllSchoolsRaw();
  return all.filter((s) => s.years.includes(yr));
}

export async function getHistoricSchools(currentYear = null) {
  const config = await getSchoolConfig();
  const yr = currentYear || config.activeYear;
  const all = await getAllSchoolsRaw();
  return all.filter((s) => !s.years.includes(yr));
}

export async function saveSchoolDb(school) {
  return await putItem("schools", school);
}

export async function deleteSchoolDb(id) {
  return await deleteItem("schools", id);
}
