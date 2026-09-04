import { dumpDatabase } from "./backup.js";

let tokenClient = null;
let accessToken = localStorage.getItem("gdrive_access_token") || null;
let userEmail = localStorage.getItem("gdrive_user_email") || null;

export function getStoredClientId() { return localStorage.getItem("gdrive_client_id") || ""; }
export function setStoredClientId(id) { localStorage.setItem("gdrive_client_id", id.trim()); }
export function getGDriveState() { return { isConnected: !!accessToken, email: userEmail }; }

function loadGisScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Errore caricamento Google Identity Services"));
    document.head.appendChild(script);
  });
}

export async function connectGDrive(onSuccess) {
  const clientId = getStoredClientId();
  if (!clientId) {
    const { showGDriveModal } = await import("../modules/settings/gdriveModal.js");
    showGDriveModal(onSuccess);
    return;
  }

  await loadGisScript();
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: async (resp) => {
      if (resp.access_token) {
        accessToken = resp.access_token;
        localStorage.setItem("gdrive_access_token", accessToken);
        userEmail = await fetchUserEmail();
        localStorage.setItem("gdrive_user_email", userEmail);
        if (onSuccess) onSuccess();
      }
    },
  });
  tokenClient.requestAccessToken({ prompt: "consent" });
}

async function fetchUserEmail() {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const info = await res.json();
    return info.email || "Google User";
  } catch { return "Google User"; }
}

export function disconnectGDrive() {
  accessToken = null;
  userEmail = null;
  localStorage.removeItem("gdrive_access_token");
  localStorage.removeItem("gdrive_user_email");
}

export async function syncToGDrive() {
  if (!accessToken) throw new Error("Google Drive non collegato");
  const data = await dumpDatabase();
  const fileContent = JSON.stringify(data, null, 2);
  const metadata = { name: "TeacherTools_Backup.json", mimeType: "application/json" };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", new Blob([fileContent], { type: "application/json" }));

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Sync fallita: HTTP ${res.status}`);
  return await res.json();
}
