const KEY_NICKNAME = "tt_custom_device_name";

export function getMyDeviceNickname() {
  return localStorage.getItem(KEY_NICKNAME) || "";
}

export function setMyDeviceNickname(name) {
  if (name?.trim()) localStorage.setItem(KEY_NICKNAME, name.trim());
  else localStorage.removeItem(KEY_NICKNAME);
}

export function detectDeviceDetails() {
  const ua = navigator.userAgent;
  let type = "desktop";
  let icon = "💻";
  let os = "Dispositivo";
  let model = "";

  if (/ipad|tablet/i.test(ua)) {
    type = "tablet"; icon = "📲"; os = "iPad / Tablet";
  } else if (/iphone/i.test(ua)) {
    type = "mobile"; icon = "📱"; os = "iPhone";
  } else if (/android/i.test(ua)) {
    type = /mobile/i.test(ua) ? "mobile" : "tablet";
    icon = type === "mobile" ? "📱" : "📲";
    os = "Android";
    const m = ua.match(/Android [^;]+;\s*([^;)]+)/i);
    if (m && m[1]) model = m[1].split(/build/i)[0].trim();
  } else if (/windows/i.test(ua)) {
    type = "desktop"; icon = "💻"; os = "PC Windows";
  } else if (/macintosh|mac os/i.test(ua)) {
    type = "desktop"; icon = "💻"; os = "Mac";
  } else if (/cros/i.test(ua)) {
    type = "desktop"; icon = "💻"; os = "Chromebook";
  }

  return { type, icon, os, model };
}

export function getMyDeviceDisplay() {
  const custom = getMyDeviceNickname();
  if (custom) return custom;

  const det = detectDeviceDetails();
  let base = det.model ? `${det.os} (${det.model})` : det.os;

  let teacher = "";
  try {
    const raw = localStorage.getItem("teacher_tools_profile");
    if (raw) teacher = JSON.parse(raw).name || "";
  } catch (_) {}

  return teacher ? `${base} - ${teacher}` : base;
}
