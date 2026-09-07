import { t } from "../../i18n.js";

export function mergeCounts(c1 = {}, c2 = {}) {
  const merged = { ...c1 };
  for (const [k, v] of Object.entries(c2 || {})) {
    merged[k] = (merged[k] || 0) + v;
  }
  return merged;
}

export function formatSyncSummary(counts = {}) {
  const parts = [];
  if (counts.schools) parts.push(t(counts.schools === 1 ? "sync_summary_school" : "sync_summary_schools", { count: counts.schools }));
  if (counts.classes) parts.push(t(counts.classes === 1 ? "sync_summary_class" : "sync_summary_classes", { count: counts.classes }));
  if (counts.students) parts.push(t(counts.students === 1 ? "sync_summary_student" : "sync_summary_students", { count: counts.students }));
  if (counts.notes) parts.push(t(counts.notes === 1 ? "sync_summary_note" : "sync_summary_notes", { count: counts.notes }));
  if (counts.quizzes) parts.push(t("sync_summary_quizzes", { count: counts.quizzes }));
  if (counts.didactic_plans) parts.push(t("sync_summary_plans", { count: counts.didactic_plans }));
  if (counts.school_settings) parts.push(t("sync_summary_settings"));
  if (counts.assessments) parts.push(t("sync_summary_assessments", { count: counts.assessments }));
  if (counts.calendar_events) parts.push(t("sync_summary_calendar", { count: counts.calendar_events }));
  return parts.length ? parts.join(", ") : t("sync_summary_no_changes");
}

export function getSyncItemPills(counts = {}) {
  const items = [];
  if (counts.schools) items.push({ icon: "🏫", label: t(counts.schools === 1 ? "sync_summary_school" : "sync_summary_schools", { count: counts.schools }) });
  if (counts.classes) items.push({ icon: "📚", label: t(counts.classes === 1 ? "sync_summary_class" : "sync_summary_classes", { count: counts.classes }) });
  if (counts.students) items.push({ icon: "👥", label: t(counts.students === 1 ? "sync_summary_student" : "sync_summary_students", { count: counts.students }) });
  if (counts.notes) items.push({ icon: "📝", label: t(counts.notes === 1 ? "sync_summary_note" : "sync_summary_notes", { count: counts.notes }) });
  if (counts.quizzes) items.push({ icon: "📋", label: t("sync_summary_quizzes", { count: counts.quizzes }) });
  if (counts.didactic_plans) items.push({ icon: "📖", label: t("sync_summary_plans", { count: counts.didactic_plans }) });
  if (counts.school_settings) items.push({ icon: "⚙️", label: t("sync_summary_settings") });
  if (counts.assessments) items.push({ icon: "📊", label: t("sync_summary_assessments", { count: counts.assessments }) });
  if (counts.calendar_events) items.push({ icon: "🗓️", label: t("sync_summary_calendar", { count: counts.calendar_events }) });
  return items;
}
