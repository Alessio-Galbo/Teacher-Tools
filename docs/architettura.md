# Architettura (note per agenti AI)

Spostato da `AGENTS.md` il 2026-10-04, testo invariato.

## Sistema di Versione & Changelog
La versione dell'applicazione e le note di rilascio seguono il principio della **Singola Fonte di Verità**:

* **Fonte Dati & Costante Versione:** [`js/modules/info/changelogData.js`](../js/modules/info/changelogData.js)
  * `CURRENT_APP_VERSION`: stringa con la versione attuale (es. `"0.6.0"`).
  * `CHANGELOG_HISTORY`: array con le release storiche (`version`, `date`, `titleKey`, `items`).
* **Interfaccia Badge & Modale:**
  * Il badge versione nella modale Info (`ℹ️`) legge direttamente `CURRENT_APP_VERSION`.
  * Accanto al badge c'è il pulsante `[ 📜 Changelog ]` gestito da [`js/modules/info/changelogModal.js`](../js/modules/info/changelogModal.js).
* **Notifica Automatica al Lancio:**
  * [`js/modules/info/updateNotifier.js`](../js/modules/info/updateNotifier.js) confronta all'avvio `CURRENT_APP_VERSION` con `localStorage` (`teacher_tools_last_seen_version`).
  * Se la versione è cambiata, mostra automaticamente la modale con le novità.

## Architettura Profili Dispositivo & Sincronizzazione
* **Profili (`js/modules/auth/`):**
  * `deviceProfile.js`: Gestisce `PERSONAL` (persistente) vs `GUEST` (effimero).
  * `guestMode.js` & `lockScreen.js`: Badge rosso in header, lock screen e distruzione dati (`clearAllStores()`) all'uscita esplicita.
* **Sincronizzazione (`js/modules/sync/`):**
  * `directorySync.js`: File System Access API multi-cartella, isolato in `TT_LocalSyncHandlesDB` (inibito in modalità ospite).
  * `deviceMesh.js` & `cryptoUtils.js`: Cerchia dispositivi con token 256-bit e QR code SVG autonomo (`qrGf.js`, `qrMatrix.js`, `qrSvg.js`).
  * `localSyncPeer.js` & `smartMerge.js`: Canale WebRTC P2P e fusione differenziale con snapshot preventivo obbligatorio.
