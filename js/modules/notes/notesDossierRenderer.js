import { createEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";

export function renderNotesDossierDOM({ notes, scopeLabel, activeYear, schoolName }) {
  const container = createEl("div", { className: "dossier-paper" });

  const badges = [
    createEl("span", { className: "badge" }, `${t("notes_dossier_date")} ${new Date().toLocaleDateString()}`),
    createEl("span", { className: "badge badge-primary" }, `${t("notes_dossier_target")} ${scopeLabel}`),
  ];
  if (activeYear) badges.push(createEl("span", { className: "badge" }, `${t("notes_dossier_year")} ${activeYear}`));
  if (schoolName) badges.push(createEl("span", { className: "badge" }, `${t("notes_dossier_school")} ${schoolName}`));
  badges.push(createEl("span", { className: "badge" }, `${t("notes_dossier_total")} ${notes.length}`));

  const headerBox = createEl("div", { className: "dossier-header-box" }, [
    createEl("div", { className: "dossier-official-title", i18n: "notes_dossier_title" }),
    createEl("div", { className: "dossier-official-sub", i18n: "notes_dossier_sub" }),
    createEl("div", { className: "tags-bar" }, badges),
  ]);
  container.appendChild(headerBox);

  if (notes.length === 0) {
    container.appendChild(createEl("p", { className: "app-subtitle", i18n: "notes_empty" }));
    return container;
  }

  notes.forEach((n, idx) => {
    const card = createEl("div", { className: "dossier-dim-card" }, [
      createEl("div", { className: "dossier-dim-title" },
        `${idx + 1}. ${n.studentCode || "Osservazione"} ${n.className ? `• Classe ${n.className}` : ""}`
      ),
      createEl("div", { className: "dossier-field" }, [
        createEl("div", { className: "dossier-label" }, new Date(n.createdAt).toLocaleDateString()),
        createEl("div", { className: "dossier-content" }, n.content),
      ]),
      n.tags && n.tags.length > 0 ? createEl("div", { className: "tags-bar" },
        n.tags.map((tg) => createEl("span", { className: "badge" }, tg))
      ) : null,
    ].filter(Boolean));
    container.appendChild(card);
  });

  return container;
}
