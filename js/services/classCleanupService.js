import { getAll, putItem, deleteItem } from "./db.js";

export async function removeClassAndCleanup(id) {
  const cls = (await getAll("classes")).find((c) => c.id === id);
  await deleteItem("classes", id);

  const allClasses = await getAll("classes");
  for (const c of allClasses) {
    let changed = false;
    if (c.promotedToClassId === id) {
      delete c.promotedToClassId; delete c.promotedToYear; delete c.promotedToClassName;
      changed = true;
    }
    if (c.originClassId === id) {
      delete c.originClassId;
      changed = true;
    }
    if (changed) await putItem("classes", c);
  }

  const allStudents = await getAll("students");
  for (const st of allStudents) {
    if (st.classId === id || (cls && st.className === cls.name && st.schoolYear === cls.schoolYear)) {
      await deleteItem("students", st.id);
    }
  }

  window.dispatchEvent(new CustomEvent("classesChanged"));
  window.dispatchEvent(new CustomEvent("studentListChanged"));
}
