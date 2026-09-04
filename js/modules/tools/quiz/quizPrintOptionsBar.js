import { createEl } from "../../../utils/dom.js";
import { t } from "../../../i18n.js";
import { createQuizPrintFieldsSelector } from "./quizPrintFieldsSelector.js";

const PREF_KEY = "quiz_print_pref";
const DEFAULT_PREF = {
  headerStyle: "formal", questionsLayout: "1col", scope: "current",
  fields: {
    school: true, teacher: true, student: true, dateClass: true,
    points: true, vote: true, topic: true, instructions: true, pointsTag: true
  }
};

export function getQuizPrintPref() {
  try {
    const s = localStorage.getItem(PREF_KEY);
    if (s) {
      const p = JSON.parse(s);
      const f = { ...DEFAULT_PREF.fields, ...p.fields };
      if (p.fields?.eval !== undefined) {
        if (p.fields.points === undefined) f.points = p.fields.eval;
        if (p.fields.vote === undefined) f.vote = p.fields.eval;
      }
      return { ...DEFAULT_PREF, ...p, fields: f };
    }
  } catch (e) {}
  return { ...DEFAULT_PREF };
}

function createSelectGroup(labelKey, opts, curVal, onSelect) {
  const grp = createEl("div", { className: "quiz-opt-group" });
  grp.appendChild(createEl("label", { className: "quiz-opt-label", i18n: labelKey }, t(labelKey)));
  const sel = createEl("select", { className: "select-input quiz-opt-select" });
  opts.forEach((opt) => {
    const o = createEl("option", { value: opt.val, i18n: opt.label }, t(opt.label));
    if (curVal === opt.val) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener("change", (e) => onSelect(e.target.value));
  grp.appendChild(sel);
  return grp;
}

export function createQuizPrintOptionsBar(onChange) {
  const pref = getQuizPrintPref();
  const bar = createEl("div", { className: "quiz-print-options-bar" });
  const save = () => { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); onChange(pref); };

  bar.appendChild(createSelectGroup("quiz_print_scope_label", [
    { val: "current", label: "quiz_print_scope_current" },
    { val: "all", label: "quiz_print_scope_all" }
  ], pref.scope, (v) => { pref.scope = v; save(); }));

  bar.appendChild(createSelectGroup("quiz_print_style_label", [
    { val: "formal", label: "quiz_print_style_formal" },
    { val: "linear", label: "quiz_print_style_linear" },
    { val: "compact", label: "quiz_print_style_compact" }
  ], pref.headerStyle, (v) => { pref.headerStyle = v; save(); }));

  bar.appendChild(createSelectGroup("quiz_print_layout_label", [
    { val: "1col", label: "quiz_print_layout_1col" },
    { val: "2col", label: "quiz_print_layout_2col" }
  ], pref.questionsLayout, (v) => { pref.questionsLayout = v; save(); }));

  bar.appendChild(createQuizPrintFieldsSelector(pref, save));
  return bar;
}
