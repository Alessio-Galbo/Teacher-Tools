<!-- hub:map:start -->
# Mappa: js/services/
Torna al [router](../../AGENTS.md) · 13 file
- [backup.js](../../js/services/backup.js): Esporta/importa tutto il database in JSON, condivisione file (iCloud/share) e dump
- [classCleanupService.js](../../js/services/classCleanupService.js): Elimina una classe e ripulisce riferimenti di promozione, origine e studenti collegati
- [classRolloverService.js](../../js/services/classRolloverService.js): Passaggio d'anno: crea classe di destinazione, promuove o trattiene studenti, fine ciclo
- [classService.js](../../js/services/classService.js): CRUD classi in IndexedDB: elenco filtrato, aggiunta, modifica con rinomina negli studenti
- [db.js](../../js/services/db.js): Wrapper IndexedDB: apertura DB, versione, store e operazioni getAll/get/put/delete/clear
- [gdrive.js](../../js/services/gdrive.js): Integrazione Google Drive: client ID, login OAuth, token ed email salvati, disconnessione
- [pwaInstallService.js](../../js/services/pwaInstallService.js): Installazione PWA (prompt, stato standalone) e registrazione del service worker
- [restoreService.js](../../js/services/restoreService.js): Ripristina il database da un dump: svuota gli store e reinserisce i dati
- [schoolConfigService.js](../../js/services/schoolConfigService.js): Configurazione scolastica: anno attivo, elenco anni accademici, aggiunta e rimozione
- [schoolService.js](../../js/services/schoolService.js): Gestione scuole: scuola attiva, aggiunta, associazione ad anni; riesporta servizi correlati
- [schoolStorage.js](../../js/services/schoolStorage.js): Accesso allo store scuole: lettura grezza, filtro per anno, salvataggio ed eliminazione
- [snapshot.js](../../js/services/snapshot.js): Snapshot automatici dei dati: creazione, elenco e ripristino con backup pre-rollback
- [studentService.js](../../js/services/studentService.js): CRUD studenti: elenco ordinato, aggiunta, pin, modifica, rimozione e studente attivo
<!-- hub:map:end -->
