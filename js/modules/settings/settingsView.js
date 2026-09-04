import { createEl, clearEl } from "../../utils/dom.js";
import { setLanguage, getLanguage } from "../../i18n.js";
import { createBackupSection } from "./backupSection.js";
import { createCloudCard } from "./cloudSection.js";
import { createTeacherProfileCard } from "./teacherProfileCard.js";

export function renderSettingsView(container) {
  clearEl(container);
  const header = createEl("div", { className: "section-header" }, [
    createEl("h2", { className: "section-title", i18n: "settings_title" }),
  ]);
  const refresh = () => renderSettingsView(container);
  container.appendChild(header);
  container.appendChild(createTeacherProfileCard(refresh));
  container.appendChild(createCloudCard(refresh));
  container.appendChild(createBackupSection());
  container.appendChild(createThemeCard(refresh));
  container.appendChild(createLanguageCard(refresh));
}

export function createThemeCard(onRefresh = null) {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const btn = createEl("button", {
    className: "btn btn-secondary btn-block",
    i18n: currentTheme === "dark" ? "settings_theme_light" : "settings_theme_dark",
    onClick: () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("teacher_tools_theme", next);
      if (onRefresh) onRefresh();
    },
  });
  return createEl("div", { className: "card" }, [
    createEl("h3", { className: "card-title", i18n: "settings_theme_title" }),
    createEl("div", { className: "form-group" }, [btn]),
  ]);
}

export function createLanguageCard(onRefresh = null) {
  const currentLang = getLanguage();
  const btn = createEl("button", {
    className: "btn btn-secondary btn-block",
    onClick: async () => {
      const next = currentLang === "it" ? "en" : "it";
      await setLanguage(next);
      if (onRefresh) onRefresh();
    },
  }, currentLang === "it" ? "Passa a English" : "Passa a Italiano");
  return createEl("div", { className: "card" }, [
    createEl("h3", { className: "card-title", i18n: "settings_lang_title" }),
    createEl("div", { className: "form-group" }, [btn]),
  ]);
}
