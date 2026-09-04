import { t } from "../../i18n.js";

export function computeYearOptions(existing) {
  const now = new Date();
  const curStart = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const curYear = `${curStart}/${curStart + 1}`;
  const nextYear = `${curStart + 1}/${curStart + 2}`;

  const options = [];
  for (let y = curStart + 1; y >= curStart - 6; y--) {
    const yr = `${y}/${y + 1}`;
    if (!existing.has(yr)) options.push(yr);
  }
  if (options.length === 0) options.push(curYear);
  const def = !existing.has(curYear) ? curYear : (!existing.has(nextYear) ? nextYear : options[0]);
  return { options, curStart, defaultYear: def };
}

export function validateCustomYear(val, existing) {
  const num = parseInt(val, 10);
  if (!/^\d{4}$/.test(val) || isNaN(num) || num < 1950 || num > 2099) {
    return { valid: false, formatted: null, message: t("school_modal_year_invalid") };
  }
  const formatted = `${num}/${num + 1}`;
  if (existing.has(formatted)) {
    return { valid: false, formatted, message: `${formatted} (${t("school_modal_year_exists")})` };
  }
  return { valid: true, formatted, message: formatted };
}
