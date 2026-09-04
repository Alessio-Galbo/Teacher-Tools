import { getAll, getItem, putItem, deleteItem } from "../../../services/db.js";

export async function getCalendarEvents(academicYear = null) {
  const all = await getAll("calendar_events");
  if (!academicYear) return all;
  return all.filter((e) => !e.academicYear || e.academicYear === academicYear);
}

export async function saveCalendarEvent(data) {
  const event = {
    id: data.id || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: data.title || "",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time || "",
    classId: data.classId || "",
    academicYear: data.academicYear || "",
    type: data.type || "test",
    notes: data.notes || "",
    updatedAt: new Date().toISOString()
  };
  await putItem("calendar_events", event);
  return event;
}

export async function removeCalendarEvent(id) {
  await deleteItem("calendar_events", id);
}
