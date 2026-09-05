import { getAll } from "./db.js";
import { getSchoolConfig } from "./schoolConfigService.js";
import { getAllSchoolsRaw, getSchools, getHistoricSchools, saveSchoolDb, deleteSchoolDb } from "./schoolStorage.js";
import { removeClassAndCleanup } from "./classCleanupService.js";

export { getClasses, addClass, removeClass, rolloverClass } from "./classService.js";
export { getSchoolConfig, updateSchoolConfig, addAcademicYear, removeAcademicYear } from "./schoolConfigService.js";
export { getSchools, getHistoricSchools } from "./schoolStorage.js";

let activeSchoolId = localStorage.getItem("teacher_tools_active_school") || "";

export function getActiveSchoolId() { return activeSchoolId; }

export function setActiveSchool(id) {
  activeSchoolId = id || "";
  localStorage.setItem("teacher_tools_active_school", activeSchoolId);
  window.dispatchEvent(new CustomEvent("activeSchoolChanged", { detail: activeSchoolId }));
}

export async function getActiveSchool(year = null) {
  const schools = await getSchools(year);
  if (schools.length === 0) return null;
  return schools.find((s) => s.id === activeSchoolId) || schools[0];
}

export async function addSchool(name, city = "", year = null, extra = {}) {
  if (!name || !name.trim()) return null;
  const config = await getSchoolConfig();
  const sch = {
    id: "sch_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    name: name.trim(),
    city: city.trim(),
    province: (extra.province || "").trim().toUpperCase(),
    schoolType: extra.schoolType || "secondaria_2",
    maxGrade: extra.maxGrade || 5,
    years: [year || config.activeYear],
    createdAt: new Date().toISOString(),
  };
  await saveSchoolDb(sch);
  setActiveSchool(sch.id);
  window.dispatchEvent(new CustomEvent("schoolsListChanged"));
  return sch;
}

export async function associateSchoolToYear(schoolId, year = null) {
  const config = await getSchoolConfig();
  const yr = year || config.activeYear;
  const all = await getAllSchoolsRaw();
  const sch = all.find((s) => s.id === schoolId);
  if (!sch) return null;
  if (!sch.years.includes(yr)) sch.years.push(yr);
  await saveSchoolDb(sch);
  setActiveSchool(sch.id);
  window.dispatchEvent(new CustomEvent("schoolsListChanged"));
  return sch;
}

export async function removeSchoolFromYear(schoolId, year = null) {
  const config = await getSchoolConfig();
  const yr = year || config.activeYear;
  const all = await getAllSchoolsRaw();
  const sch = all.find((s) => s.id === schoolId);
  if (!sch) return;
  sch.years = sch.years.filter((y) => y !== yr);
  if (sch.years.length === 0) {
    await deleteSchoolDb(schoolId);
    const classes = await getAll("classes");
    for (const c of classes) {
      if (c.schoolId === schoolId) await removeClassAndCleanup(c.id);
    }
  } else {
    await saveSchoolDb(sch);
  }
  const remaining = await getSchools(yr);
  setActiveSchool(remaining[0]?.id || "");
  window.dispatchEvent(new CustomEvent("schoolsListChanged"));
}

export async function updateSchool(school) {
  if (!school || !school.id) return null;
  await saveSchoolDb(school);
  window.dispatchEvent(new CustomEvent("schoolsListChanged"));
  return school;
}
