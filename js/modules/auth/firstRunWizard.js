import { createEl, clearEl } from "../../utils/dom.js";
import { t } from "../../i18n.js";
import { isGuestMode } from "./guestMode.js";
import { getSchoolConfig, updateSchoolConfig } from "../../services/schoolConfigService.js";
import { getAllSchoolsRaw } from "../../services/schoolService.js";
import { showPairingModal } from "../sync/pairingModal.js";

const KEY_FIRST_RUN = "teacher_tools_first_run_done";

export async function checkFirstRunWizard() {
  if (isGuestMode() || localStorage.getItem(KEY_FIRST_RUN)) return;
  if (document.getElementById("modal-container")?.classList.contains("active")) return;

  const cfg = await getSchoolConfig();
  const schools = await getAllSchoolsRaw();
  if (cfg.teacherName || (schools && schools.length > 0)) return;

  showWizardModal();
}

function showWizardModal() {
  const overlay = document.getElementById("modal-container");
  if (!overlay) return;
  clearEl(overlay);

  const modal = createEl("div", { className: "modal-dialog modal-md" });
  const head = createEl("div", { className: "modal-header" });
  head.appendChild(createEl("h3", { className: "modal-title" }, `👋 ${t("wizard_welcome_title")}`));
  const closeBtn = createEl("button", { className: "modal-close-btn" }, "✕");
  head.appendChild(closeBtn);
  modal.appendChild(head);

  const body = createEl("div", { className: "modal-body wizard-box" });
  body.appendChild(createEl("p", { className: "text-muted text-sm mb-1" }, t("wizard_welcome_subtitle")));

  const nameInp = createEl("input", {
    type: "text", className: "input-text input-sm",
    placeholder: t("settings_teacher_name_placeholder")
  });
  const subjInp = createEl("input", {
    type: "text", className: "input-text input-sm",
    placeholder: t("settings_teacher_subject_placeholder")
  });
  const startBtn = createEl("button", { className: "btn btn-primary btn-block mt-2" }, `🚀 ${t("wizard_btn_start_fresh")}`);

  body.appendChild(nameInp);
  body.appendChild(subjInp);
  body.appendChild(startBtn);

  const orDiv = createEl("div", { className: "wizard-or-divider" }, t("wizard_or_label"));
  body.appendChild(orDiv);

  const tipBox = createEl("div", { className: "wizard-tip-box" });
  tipBox.appendChild(createEl("span", { className: "text-muted text-xs" }, t("wizard_existing_tip_desc")));
  const pairBtn = createEl("button", { className: "btn btn-secondary btn-sm" }, `📲 ${t("wizard_btn_connect_existing")}`);
  tipBox.appendChild(pairBtn);
  body.appendChild(tipBox);

  modal.appendChild(body);

  const dismiss = () => {
    localStorage.setItem(KEY_FIRST_RUN, "true");
    overlay.classList.remove("active");
    clearEl(overlay);
  };
  closeBtn.addEventListener("click", dismiss);

  startBtn.addEventListener("click", async () => {
    const teacherName = nameInp.value.trim();
    const teacherSubject = subjInp.value.trim();
    if (teacherName || teacherSubject) {
      await updateSchoolConfig({ teacherName, teacherSubject });
    }
    dismiss();
  });

  pairBtn.addEventListener("click", () => {
    dismiss();
    showPairingModal();
  });

  overlay.appendChild(modal);
  overlay.classList.add("active");
}
