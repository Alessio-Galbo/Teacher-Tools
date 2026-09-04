let currentLang = "it";
let dictionary = {};

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  return dictionary[key] || key;
}

export function translateDOM(root = document) {
  const elements = root.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.dataset.i18n;
    if (key && dictionary[key]) {
      el.textContent = dictionary[key];
    }
  });

  const placeholders = root.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && dictionary[key]) {
      el.placeholder = dictionary[key];
    }
  });
}

export async function setLanguage(lang) {
  try {
    const res = await fetch(`./locales/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dictionary = await res.json();
    currentLang = lang;
    localStorage.setItem("teacher_tools_lang", lang);
    translateDOM();
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  } catch (err) {
    console.error("Errore caricamento dizionario i18n:", err);
  }
}

export async function initI18n() {
  const saved = localStorage.getItem("teacher_tools_lang") || "it";
  await setLanguage(saved);
}
