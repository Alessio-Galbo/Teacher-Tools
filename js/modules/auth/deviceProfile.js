export const DEVICE_PROFILES = {
  PERSONAL: "personal",
  GUEST: "guest",
};

const KEY_PROFILE = "teacher_tools_device_profile";
const KEY_REMEMBER = "teacher_tools_profile_remember";

export function isProfileRemembered() {
  return localStorage.getItem(KEY_REMEMBER) === "true";
}

export function getDeviceProfile() {
  if (isProfileRemembered()) {
    return localStorage.getItem(KEY_PROFILE) || null;
  }
  return sessionStorage.getItem(KEY_PROFILE) || null;
}

export function setDeviceProfile(profile, remember = false) {
  sessionStorage.setItem(KEY_PROFILE, profile);
  if (remember) {
    localStorage.setItem(KEY_PROFILE, profile);
    localStorage.setItem(KEY_REMEMBER, "true");
  } else {
    localStorage.removeItem(KEY_PROFILE);
    localStorage.removeItem(KEY_REMEMBER);
  }
  window.dispatchEvent(new CustomEvent("deviceProfileChanged", {
    detail: { profile, remember },
  }));
}

export async function checkDeviceProfileOnStartup() {
  const { showSplashModal, dismissSplash } = await import("./splashModal.js");
  await new Promise((r) => setTimeout(r, 350));
  const profile = getDeviceProfile();
  if (profile === DEVICE_PROFILES.GUEST) {
    const { getPairedDevices } = await import("../sync/deviceMesh.js");
    const { getStoredPin } = await import("./lockScreenPin.js");
    const paired = await getPairedDevices();
    if (paired.length > 0 || getStoredPin()) {
      dismissSplash();
      const { activateLockScreen } = await import("./lockScreen.js");
      await activateLockScreen();
      return DEVICE_PROFILES.GUEST;
    }
    dismissSplash();
    return DEVICE_PROFILES.GUEST;
  }
  if (profile === DEVICE_PROFILES.PERSONAL) {
    dismissSplash();
    return DEVICE_PROFILES.PERSONAL;
  }
  return new Promise((resolve) => {
    showSplashModal((selectedProfile) => {
      resolve(selectedProfile);
    });
  });
}
