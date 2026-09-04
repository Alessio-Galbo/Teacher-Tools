import { getAll, putItem } from "./db.js";

const DEFAULT_SETTINGS = {
  id: "main_config",
  activeYear: "2024/2025",
  years: ["2023/2024", "2024/2025", "2025/2026"],
};

export async function getSchoolConfig() {
  const list = await getAll("school_settings");
  if (list.length === 0) {
    await putItem("school_settings", DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return list[0];
}

export async function updateSchoolConfig(newConfig) {
  const current = await getSchoolConfig();
  const merged = { ...current, ...newConfig, id: "main_config" };
  await putItem("school_settings", merged);
  window.dispatchEvent(new CustomEvent("schoolConfigChanged", { detail: merged }));
  return merged;
}

export async function addAcademicYear(newYear) {
  if (!newYear || !newYear.trim()) return null;
  const config = await getSchoolConfig();
  const trimmed = newYear.trim();
  const years = Array.from(new Set([...config.years, trimmed]));
  return await updateSchoolConfig({ activeYear: trimmed, years });
}

export async function removeAcademicYear(yearToRemove) {
  const config = await getSchoolConfig();
  if (config.years.length <= 1) return null;
  const years = config.years.filter((y) => y !== yearToRemove);
  const activeYear = config.activeYear === yearToRemove ? years[0] : config.activeYear;
  return await updateSchoolConfig({ activeYear, years });
}
