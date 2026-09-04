import { createEl, clearEl } from "../../../utils/dom.js";
import { showToast } from "../../../utils/toast.js";
import { t } from "../../../i18n.js";
import { getSavedQuizzes, removeQuiz } from "./quizModel.js";

export async function showQuizSavedModal(academicYear, onLoad) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-lg" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title", i18n: "quiz_saved_modal_title" }, t("quiz_saved_modal_title")));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body" });
  modal.appendChild(body);

  const closeModal = () => { overlay.classList.remove("active"); clearEl(overlay); };
  closeBtn.addEventListener("click", closeModal);

  const renderList = async () => {
    clearEl(body);
    const quizzes = await getSavedQuizzes(academicYear);
    if (quizzes.length === 0) {
      body.appendChild(createEl("p", { className: "text-muted", i18n: "quiz_no_saved" }, t("quiz_no_saved")));
      return;
    }
    quizzes.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    quizzes.forEach((q) => {
      const card = createEl("div", { className: "card" });
      const cardHead = createEl("div", { className: "card-header" });
      const titles = createEl("div");
      titles.appendChild(createEl("h4", { className: "card-title" }, q.title || q.topic || t("quiz_title")));
      titles.appendChild(createEl("span", { className: "text-muted" }, `${q.subject || "-"} • ${q.updatedAt?.slice(0, 10)}`));
      cardHead.appendChild(titles);

      const actions = createEl("div", { className: "quiz-card-actions" });
      const loadBtn = createEl("button", { className: "btn btn-primary btn-sm", i18n: "quiz_btn_load" }, t("quiz_btn_load"));
      loadBtn.addEventListener("click", () => { onLoad(q); closeModal(); });
      const delBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, "🗑️");
      delBtn.addEventListener("click", async () => {
        if (confirm(t("quiz_delete_confirm"))) {
          await removeQuiz(q.id);
          showToast("toast_deleted");
          renderList();
        }
      });
      actions.appendChild(loadBtn); actions.appendChild(delBtn);
      cardHead.appendChild(actions);
      card.appendChild(cardHead);

      const meta = createEl("div", { className: "quiz-card-meta" });
      const variantsCount = q.variants?.length || 1;
      const vLabel = variantsCount === 1 ? t("quiz_variant_single") : t("quiz_variants_count");
      meta.appendChild(createEl("span", { className: "badge badge-primary" }, `${variantsCount} ${vLabel}`));
      card.appendChild(meta);
      body.appendChild(card);
    });
  };

  await renderList();
  overlay.appendChild(modal);
  overlay.classList.add("active");
}
