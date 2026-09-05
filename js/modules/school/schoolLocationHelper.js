export function formatSchoolLocation(school) {
  if (!school) return "";
  const city = (school.city || "").trim();
  const prov = (school.province || "").trim().toUpperCase();
  if (city && prov) return `${city} (${prov})`;
  return city || prov;
}

export function formatSchoolFullName(school) {
  if (!school) return "";
  const loc = formatSchoolLocation(school);
  return loc ? `${school.name} - ${loc}` : school.name;
}
