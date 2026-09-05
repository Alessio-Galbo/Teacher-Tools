import { createEl, clearEl } from "../../utils/dom.js";
import { showToast } from "../../utils/toast.js";
import { t } from "../../i18n.js";
import { getDimensionById } from "./peiData.js";
import { getPhraseConfig, addCustomPhrase, deleteCustomPhrase, toggleHideDefaultPhrase } from "./peiPhraseService.js";
import { renderConfigControls, renderChecklistItems } from "./peiConfigListRenderer.js";

export async function showPeiConfigModal(onSaved) {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  let activeDimId = "dim1";
  let activeSection = "levels";
  const bodyEl = createEl("div", { className: "modal-body" });

  async function renderContent() {
    clearEl(bodyEl);
    const { customPhrases, hiddenIds } = await getPhraseConfig();
    const dim = getDimensionById(activeDimId);
    const controls = renderConfigControls({
      activeDimId, activeSection,
      onDimChange: (id) => { activeDimId = id; renderContent(); },
      onSectionChange: (sec) => { activeSection = sec; renderContent(); },
    });

    const { defaultList, customList } = renderChecklistItems({
      defaultItems: dim[activeSection] || [],
      customItems: customPhrases.filter((p) => p.dimId === activeDimId && p.section === activeSection),
      hiddenSet: new Set(hiddenIds),
      onToggle: async (id, visible) => {
        await toggleHideDefaultPhrase(id, visible);
        showToast(t("pei_config_saved"), "info");
        renderContent();
      },
      onDelete: async (id) => {
        await deleteCustomPhrase(id);
        showToast(t("pei_config_deleted"), "info");
        renderContent();
      },
    });

    const addInput = createEl("input", { className: "input-text", i18nPlaceholder: "pei_config_add_placeholder" });
    const addBtn = createEl("button", {
      className: "btn btn-primary btn-sm", i18n: "pei_config_add_btn",
      onClick: async () => {
        if (!addInput.value.trim()) return;
        await addCustomPhrase(activeDimId, activeSection, addInput.value);
        showToast(t("pei_config_saved"), "success");
        renderContent();
      },
    });

    bodyEl.append(
      ...controls,
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "pei_config_defaults" }),
        createEl("div", { className: "student-checklist" }, defaultList),
      ]),
      createEl("div", { className: "form-group" }, [
        createEl("label", { className: "form-label", i18n: "pei_config_custom" }),
        customList.length > 0 ? createEl("div", { className: "student-checklist" }, customList) : createEl("p", { className: "app-subtitle", i18n: "notes_empty" }),
      ]),
      createEl("div", { className: "notes-toolbar" }, [addInput, addBtn])
    );
  }

  const closeModal = () => { overlay.classList.remove("active"); if (onSaved) onSaved(); };
  const modalBox = createEl("div", { className: "modal-box" }, [
    createEl("div", { className: "modal-header" }, [
      createEl("h3", { className: "modal-title", i18n: "pei_config_title" }),
      createEl("button", { className: "modal-close-btn", onClick: closeModal }, "✕"),
    ]),
    bodyEl,
  ]);

  overlay.appendChild(modalBox);
  overlay.classList.add("active");
  await renderContent();
}
