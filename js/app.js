import { initI18n, translateDOM, t } from "./i18n.js";
import { openDB } from "./services/db.js";
import { getSchoolConfig } from "./services/schoolConfigService.js";
import { initHeaderYearSelector } from "./components/headerYearSelector.js";
import { initStudentBar } from "./components/studentBar.js";
import { showSettingsModal } from "./modules/settings/settingsModal.js";
import { initPwaInstall } from "./services/pwaInstallService.js";
import { checkDeviceProfileOnStartup } from "./modules/auth/deviceProfile.js";
import { initGuestModeUI } from "./modules/auth/guestMode.js";
import { setSplashProgress } from "./modules/auth/splashModal.js";

const savedTheme = localStorage.getItem("teacher_tools_theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
let currentTab = "view-pei";
const viewModules = {};

const viewLoaders = {
  "view-pei": () => import("./modules/pei/peiView.js").then((m) => m.renderPeiView),
  "view-notes": () => import("./modules/notes/notesView.js").then((m) => m.renderNotesView),
  "view-students": () => import("./modules/school/schoolView.js").then((m) => m.renderSchoolView),
  "view-tools": () => import("./modules/tools/toolsView.js").then((m) => m.renderToolsView),
  "view-settings": () => import("./modules/settings/settingsView.js").then((m) => m.renderSettingsView),
};

async function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".view-section").forEach((sec) => sec.classList.toggle("active", sec.id === tabId));
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.target === tabId));
  const bar = document.getElementById("student-bar-container");
  if (bar) bar.style.display = (tabId === "view-pei" || tabId === "view-notes") ? "" : "none";
  const container = document.getElementById(tabId);
  if (!container) return;
  if (!viewModules[tabId] && viewLoaders[tabId]) {
    viewModules[tabId] = await viewLoaders[tabId]();
  }
  if (viewModules[tabId]) viewModules[tabId](container);
}

async function bootstrap() {
  setSplashProgress(10);
  initPwaInstall();
  await initI18n();
  setSplashProgress(35, t("splash_step_db"));
  await openDB();
  setSplashProgress(60, t("splash_step_services"));
  await getSchoolConfig();
  initGuestModeUI();
  initHeaderYearSelector(document.getElementById("header-year-container"));
  initStudentBar(document.getElementById("student-bar-container"));
  import("./modules/sync/remoteUnlockBanner.js").then((m) => m.initRemoteUnlockBanner());
  import("./modules/sync/localSyncBadge.js").then((m) => m.initLocalSyncBadge());
  import("./modules/sync/deviceMesh.js").then((m) => m.checkIncomingPairHash());
  import("./modules/sync/localSyncPeer.js").then((m) => m.initAutoSync());
  import("./modules/info/updateNotifier.js").then((m) => m.checkAppUpdate());
  setSplashProgress(85, t("splash_step_views"));
  await switchTab("view-pei");
  setSplashProgress(100, t("splash_step_ready"));
  await checkDeviceProfileOnStartup();
  initGuestModeUI();
  import("./modules/auth/guestOnboarding.js").then((m) => m.checkAppOnboarding());

  document.getElementById("tab-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (btn && btn.dataset.target) switchTab(btn.dataset.target);
  });

  document.getElementById("header-info-btn")?.addEventListener("click", () => import("./modules/info/infoModal.js").then((m) => m.showInfoModal()));
  document.getElementById("header-settings-btn")?.addEventListener("click", () => showSettingsModal());
  window.addEventListener("navigateToTab", (e) => { if (e.detail) switchTab(e.detail); });

  const refreshActive = () => {
    const container = document.getElementById(currentTab);
    if (container && viewModules[currentTab]) viewModules[currentTab](container);
  };

  window.addEventListener("languageChanged", () => { translateDOM(); refreshActive(); });
  ["dataRestored", "globalYearChanged"].forEach((evt) => window.addEventListener(evt, refreshActive));
  window.addEventListener("deviceProfileChanged", () => {
    initGuestModeUI();
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").then((reg) => reg.update()).catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
