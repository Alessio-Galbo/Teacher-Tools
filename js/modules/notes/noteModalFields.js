import { createEl } from "../../utils/dom.js";
import { createTagGroupsBox } from "./noteTagGroups.js";

export function createNoteModalFields(options = {}) {
  const { note = null, onTagToggle } = options;

  const defaultDate = note?.createdAt
    ? new Date(note.createdAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const dateInput = createEl("input", {
    className: "input-text",
    type: "date",
    value: defaultDate,
  });

  const dateGroup = createEl("div", { className: "form-group" }, [
    createEl("label", { className: "form-label", i18n: "notes_date_label" }),
    dateInput,
  ]);

  const contentInput = createEl("textarea", {
    className: "textarea-input",
    i18nPlaceholder: "notes_content_placeholder",
  });
  if (note?.content) contentInput.value = note.content;

  const textGroup = createEl("div", { className: "form-group" }, [contentInput]);
  const tagGroupsEl = createTagGroupsBox(note?.tags || [], onTagToggle);

  const container = createEl("div", { className: "modal-body" }, [
    dateGroup,
    textGroup,
    tagGroupsEl,
  ]);

  return { container, dateInput, contentInput };
}
