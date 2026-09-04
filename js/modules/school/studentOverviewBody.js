import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function createStudentOverviewBody(options) {
  const { activeSt, peers = [], notes = [], schoolName = "", year = "", availableYears = [], onPeerSelect, onYearSelect } = options;

  const yearNav = availableYears.length > 1 ? createEl("div", { className: "overview-year-nav" },
    availableYears.map((yr) => createEl("button", {
      className: `overview-year-btn ${yr === year ? "active" : ""}`,
      onClick: () => { if (onYearSelect) onYearSelect(yr); },
    }, `📅 ${yr}`))
  ) : null;

  const infoGrid = createEl("div", { className: "overview-grid" }, [
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "school_card_title" }),
      createEl("span", { className: "badge" }, `🏫 ${schoolName}`),
    ]),
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "student_field_class" }),
      createEl("span", { className: "badge" }, `🏢 ${activeSt.className || t("school_unassigned_class")}`),
    ]),
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "student_field_type" }),
      createEl("span", {
        className: `badge ${activeSt.supportType === "bes" ? "badge-bes" : (activeSt.supportType === "curriculare" ? "badge-curriculare" : "badge-pei")}`,
      }, (activeSt.supportType || "pei").toUpperCase()),
    ]),
    createEl("div", { className: "overview-info-item" }, [
      createEl("span", { className: "form-label", i18n: "school_label_active_year" }),
      createEl("span", { className: "badge badge-primary" }, `📅 ${year}`),
    ]),
  ]);

  const privateNotesBox = activeSt.notes ? createEl("div", { className: "overview-private-notes" }, [
    createEl("span", { className: "form-label", i18n: "student_field_notes" }),
    createEl("p", { className: "note-text" }, `🔒 ${activeSt.notes}`),
  ]) : null;

  const peerChips = peers.map((p) => createEl("span", {
    className: "overview-peer-chip",
    onClick: () => { if (onPeerSelect) onPeerSelect(p.id); },
  }, `🎓 ${p.name}`));

  const recentNotes = notes.slice(0, 3).map((n) => createEl("div", { className: "overview-note-item" }, [
    createEl("div", { className: "note-meta" }, [
      createEl("span", { className: "badge" }, n.tags.join(" ") || "#Osservazione"),
      createEl("span", { className: "note-date" }, new Date(n.createdAt).toLocaleDateString()),
    ]),
    createEl("p", { className: "note-text" }, n.content),
  ]));

  return createEl("div", { className: "modal-body" }, [
    yearNav, infoGrid, privateNotesBox,
    peers.length > 0 ? createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "school_peers_label" }),
      createEl("div", { className: "tags-bar" }, peerChips),
    ]) : null,
    createEl("div", { className: "form-group" }, [
      createEl("label", { className: "form-label", i18n: "school_recent_notes" }),
      recentNotes.length > 0 ? createEl("div", {}, recentNotes) : createEl("p", { className: "app-subtitle", i18n: "notes_empty" }),
    ]),
  ].filter(Boolean));
}
