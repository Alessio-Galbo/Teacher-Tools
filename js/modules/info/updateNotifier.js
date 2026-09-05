import { CURRENT_APP_VERSION } from "./changelogData.js";
import { showChangelogModal } from "./changelogModal.js";

export function checkAppUpdate() {
  const lastSeen = localStorage.getItem("teacher_tools_last_seen_version");
  if (!lastSeen) {
    localStorage.setItem("teacher_tools_last_seen_version", CURRENT_APP_VERSION);
    return;
  }
  if (lastSeen !== CURRENT_APP_VERSION) {
    localStorage.setItem("teacher_tools_last_seen_version", CURRENT_APP_VERSION);
    setTimeout(() => {
      showChangelogModal(CURRENT_APP_VERSION);
    }, 500);
  }
}
