import { t } from "../i18n.js";

export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "className") {
      el.className = val;
    } else if (key === "dataset") {
      for (const [dKey, dVal] of Object.entries(val)) {
        el.dataset[dKey] = dVal;
      }
    } else if (key === "i18n") {
      el.dataset.i18n = val;
      el.textContent = t(val);
    } else if (key === "i18nPlaceholder") {
      el.dataset.i18nPlaceholder = val;
      el.placeholder = t(val);
    } else if (key === "value") {
      el.value = val;
    } else if (key.startsWith("on") && typeof val === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (val !== false && val !== null && val !== undefined) {
      el.setAttribute(key, val === true ? "" : val);
    }
  }

  if (typeof children === "string" || typeof children === "number") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    for (const child of children) {
      if (typeof child === "string" || typeof child === "number") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    }
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export function clearEl(el) {
  while (el && el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
