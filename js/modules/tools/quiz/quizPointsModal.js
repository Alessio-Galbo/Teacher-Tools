import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";

function makeWeightRow(icon, labelKey, val, onInput) {
  const item = createEl("div", { className: "quiz-weight-item" });
  const info = createEl("div", { className: "quiz-weight-info" }, [
    createEl("span", { className: "quiz-weight-icon" }, icon),
    createEl("span", { className: "quiz-weight-label", i18n: labelKey }, t(labelKey))
  ]);
  const wrap = createEl("div", { className: "quiz-weight-input-wrap" });
  const inp = createEl("input", {
    type: "number", className: "input-text quiz-weight-input",
    step: "0.25", min: "0.25", value: val
  });
  inp.addEventListener("input", (e) => onInput(parseFloat(e.target.value) || 0.25));
  wrap.appendChild(inp);
  wrap.appendChild(createEl("span", { className: "quiz-weight-unit" }, "pt"));
  item.appendChild(info);
  item.appendChild(wrap);
  return item;
}

export function showQuizPointsModal(state, onUpdate) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const def = state.defaultPoints || { multiple_choice: 1, true_false: 0.5, cloze: 1, open: 2 };
  const current = { ...def };
  const modal = createEl("div", { className: "modal-dialog quiz-points-dialog" });

  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "quiz_weights_modal_title" }, t("quiz_weights_modal_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  body.appendChild(createEl("p", { className: "text-muted", i18n: "quiz_weights_desc" }, t("quiz_weights_desc")));

  const grid = createEl("div", { className: "quiz-weights-grid" });
  grid.appendChild(makeWeightRow("🔘", "quiz_type_mc", current.multiple_choice, (v) => { current.multiple_choice = v; }));
  grid.appendChild(makeWeightRow("✔️", "quiz_type_tf", current.true_false, (v) => { current.true_false = v; }));
  grid.appendChild(makeWeightRow("🔤", "quiz_type_cloze", current.cloze, (v) => { current.cloze = v; }));
  grid.appendChild(makeWeightRow("✍️", "quiz_type_open", current.open, (v) => { current.open = v; }));
  body.appendChild(grid);

  const checkGroup = createEl("div", { className: "quiz-weight-check-group" });
  const check = createEl("input", { type: "checkbox", id: "apply-weights-check", checked: true });
  checkGroup.appendChild(check);
  checkGroup.appendChild(createEl("label", { htmlFor: "apply-weights-check", i18n: "quiz_weights_apply_all" }, t("quiz_weights_apply_all")));
  body.appendChild(checkGroup);

  const footer = createEl("div", { className: "modal-footer quiz-modal-footer-centered" });
  const cancelBtn = createEl("button", { className: "btn btn-secondary", i18n: "btn_cancel" }, t("btn_cancel"));
  const saveBtn = createEl("button", { className: "btn btn-primary", i18n: "btn_save" }, t("btn_save"));

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  cancelBtn.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  saveBtn.addEventListener("click", () => {
    state.defaultPoints = current;
    if (check.checked) {
      state.variants.forEach((v) => {
        v.questions.forEach((q) => { if (current[q.type]) q.points = current[q.type]; });
      });
    }
    showToast("quiz_weights_saved");
    onUpdate();
    closeModal();
  });

  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
