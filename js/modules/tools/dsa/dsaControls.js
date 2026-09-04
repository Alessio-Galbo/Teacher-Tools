import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";

function makeGroup(labelKey, select) {
  const grp = createEl("div", { className: "form-group dsa-control-group" });
  grp.appendChild(createEl("label", { className: "form-label", i18n: labelKey }, t(labelKey)));
  grp.appendChild(select);
  return grp;
}

export function createDsaControls(onChange) {
  const grid = createEl("div", { className: "dsa-controls-grid" });

  const fontSel = createEl("select", { className: "select-input" });
  fontSel.appendChild(createEl("option", { value: "sans-serif" }, "Standard (Sans)"));
  fontSel.appendChild(createEl("option", { value: "opendyslexic" }, "OpenDyslexic / Accessibile"));
  fontSel.appendChild(createEl("option", { value: "verdana" }, "Verdana (Spaziato)"));

  const sizeSel = createEl("select", { className: "select-input" });
  sizeSel.appendChild(createEl("option", { value: "size-normal" }, "Normale"));
  sizeSel.appendChild(createEl("option", { value: "size-large" }, "Grande (+25%)"));
  sizeSel.appendChild(createEl("option", { value: "size-xl" }, "Molto Grande (+50%)"));

  const spacingSel = createEl("select", { className: "select-input" });
  spacingSel.appendChild(createEl("option", { value: "spacing-normal" }, "1.5"));
  spacingSel.appendChild(createEl("option", { value: "spacing-wide" }, "1.8"));
  spacingSel.appendChild(createEl("option", { value: "spacing-wider" }, "2.0"));

  const contrastSel = createEl("select", { className: "select-input" });
  contrastSel.appendChild(createEl("option", { value: "contrast-default", i18n: "dsa_contrast_default" }, t("dsa_contrast_default")));
  contrastSel.appendChild(createEl("option", { value: "contrast-cream", i18n: "dsa_contrast_cream" }, t("dsa_contrast_cream")));
  contrastSel.appendChild(createEl("option", { value: "contrast-dark", i18n: "dsa_contrast_dark" }, t("dsa_contrast_dark")));
  contrastSel.appendChild(createEl("option", { value: "contrast-blue", i18n: "dsa_contrast_blue" }, t("dsa_contrast_blue")));

  const trigger = () => onChange({
    font: fontSel.value, size: sizeSel.value, spacing: spacingSel.value, contrast: contrastSel.value
  });
  [fontSel, sizeSel, spacingSel, contrastSel].forEach((sel) => sel.addEventListener("change", trigger));

  grid.appendChild(makeGroup("dsa_font_label", fontSel));
  grid.appendChild(makeGroup("dsa_size_label", sizeSel));
  grid.appendChild(makeGroup("dsa_spacing_label", spacingSel));
  grid.appendChild(makeGroup("dsa_contrast_label", contrastSel));

  return grid;
}
