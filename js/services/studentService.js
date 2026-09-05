import { getAll, putItem, deleteItem } from "./db.js";

let activeStudentId = localStorage.getItem("teacher_tools_active_student") || "";

export async function getStudents(schoolYear = null) {
  const list = await getAll("students");
  const filtered = schoolYear ? list.filter((s) => !s.schoolYear || s.schoolYear === schoolYear) : list;
  return filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || a.name.localeCompare(b.name));
}

export async function addStudent(data) {
  const isObj = typeof data === "object" && data !== null;
  const name = isObj ? data.name : data;
  if (!name || !name.trim()) return null;
  const s = {
    id: "stud_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    personId: (isObj && (data.personId || data.id)) || ("p_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4)),
    originStudentId: (isObj && (data.originStudentId || data.id)) || null,
    name: name.trim(),
    className: isObj ? (data.className || "") : "",
    classId: isObj ? (data.classId || "") : "",
    schoolId: isObj ? (data.schoolId || "") : "",
    schoolYear: isObj ? (data.schoolYear || "") : "",
    supportType: isObj ? (data.supportType || "pei") : "pei",
    notes: isObj ? (data.notes || "") : "",
    isPinned: Boolean(isObj && data.isPinned),
    createdAt: new Date().toISOString(),
  };
  await putItem("students", s);
  setActiveStudent(s.id);
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  return s;
}

export async function togglePinStudent(id) {
  const list = await getAll("students");
  const st = list.find((s) => s.id === id);
  if (!st) return null;
  st.isPinned = !st.isPinned;
  await putItem("students", st);
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  return st;
}

export async function updateStudent(student) {
  if (!student || !student.id) return null;
  await putItem("students", student);
  window.dispatchEvent(new CustomEvent("studentListChanged"));
  if (student.id === activeStudentId) window.dispatchEvent(new CustomEvent("activeStudentChanged", { detail: student.id }));
  return student;
}

export async function removeStudent(id) {
  await deleteItem("students", id);
  if (activeStudentId === id) setActiveStudent("__ALL__");
  window.dispatchEvent(new CustomEvent("studentListChanged"));
}

export function getActiveStudentId() { return activeStudentId; }

export async function getActiveStudent() {
  const students = await getAll("students");
  return students.find((s) => s.id === activeStudentId) || null;
}

export function setActiveStudent(id) {
  activeStudentId = id;
  localStorage.setItem("teacher_tools_active_student", id);
  window.dispatchEvent(new CustomEvent("activeStudentChanged", { detail: id }));
}
