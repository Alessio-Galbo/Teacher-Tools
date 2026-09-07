import { getDeviceProfile, DEVICE_PROFILES } from "./deviceProfile.js";
import { clearAllStores } from "../../services/db.js";

const KEY_SUSPENDED = "teacher_tools_suspended_guest_session";

export function isGuestMode() {
  return getDeviceProfile() === DEVICE_PROFILES.GUEST;
}

export function hasSuspendedGuestSession() {
  return !!localStorage.getItem(KEY_SUSPENDED);
}

export function clearSuspendedGuestSession() {
  localStorage.removeItem(KEY_SUSPENDED);
}

export async function terminateGuestSession() {
  clearSuspendedGuestSession();
  try {
    const { sendTerminateGuestSession } = await import("../sync/localSyncPeer.js");
    await sendTerminateGuestSession();
  } catch (_) {}
  sessionStorage.clear();
  await clearAllStores();
  try {
    const { clearPairedDevices } = await import("../sync/deviceMesh.js");
    await clearPairedDevices();
  } catch (_) {}
  [
    "tt_cluster_mesh_token",
    "teacher_tools_device_profile",
    "teacher_tools_profile_remember",
    "teacher_tools_guest_pin",
    KEY_SUSPENDED,
  ].forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}

export { initGuestModeUI } from "./guestBarUI.js";
