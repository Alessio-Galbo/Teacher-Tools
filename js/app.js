import { initI18n, translateDOM } from "./i18n.js";
import { openDB } from "./services/db.js";
import { initHeaderYearSelector } from "./components/headerYearSelector.js";
import { initStudentBar } from "./components/studentBar.js";
import { renderPeiView } from "./modules/pei/peiView.js";
import { renderNotesView } from "./modules/notes/notesView.js";
import { renderSchoolView } from "./modules/school/schoolView.js";
import { renderSettingsView } from "./modules/settings/settingsView.js";

let currentTab = "view-pei";

const views = {
  "view-pei": renderPeiView,
  "view-notes": renderNotesView,
  "view-students": renderSchoolView,
  "view-settings": renderSettingsView,
};

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === tabId);
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === tabId);
  });
  const studentBar = document.getElementById("student-bar-container");
  if (studentBar) {
    studentBar.style.display = (tabId === "view-pei" || tabId === "view-notes") ? "" : "none";
  }
  const container = document.getElementById(tabId);
  if (container && views[tabId]) views[tabId](container);
}

async function bootstrap() {
  const savedTheme = localStorage.getItem("teacher_tools_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  await initI18n();
  await openDB();

  initHeaderYearSelector(document.getElementById("header-year-container"));
  initStudentBar(document.getElementById("student-bar-container"));

  document.getElementById("tab-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (btn && btn.dataset.target) switchTab(btn.dataset.target);
  });

  window.addEventListener("navigateToTab", (e) => {
    if (e.detail) switchTab(e.detail);
  });

  const refreshActive = () => {
    const container = document.getElementById(currentTab);
    if (container && views[currentTab]) views[currentTab](container);
  };

  window.addEventListener("languageChanged", () => { translateDOM(); refreshActive(); });
  window.addEventListener("dataRestored", refreshActive);
  window.addEventListener("globalYearChanged", refreshActive);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").then((reg) => reg.update()).catch(() => {});
  }

  switchTab("view-pei");
}

document.addEventListener("DOMContentLoaded", bootstrap);
