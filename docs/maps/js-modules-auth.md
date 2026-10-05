<!-- hub:map:start -->
# Mappa: js/modules/auth/
Torna al [router](../../AGENTS.md) · 12 file
- [deviceProfile.js](../../js/modules/auth/deviceProfile.js): Profilo dispositivo (personale/ospite) salvato in storage e controllo all'avvio con splash o blocco
- [firstRunWizard.js](../../js/modules/auth/firstRunWizard.js): Procedura guidata di primo avvio: nome docente, materia, oppure collegamento a dispositivo esistente
- [guestBarUI.js](../../js/modules/auth/guestBarUI.js): Barra di sessione ospite sotto l'header con pulsanti blocca schermo ed esci
- [guestMode.js](../../js/modules/auth/guestMode.js): Logica modalità ospite: rilevamento, sessione sospesa e terminazione con cancellazione di tutti i…
- [guestOnboarding.js](../../js/modules/auth/guestOnboarding.js): Modale iniziale per ospiti: scelta tra documento vuoto, sincronizzazione o ripristino sessione…
- [lockScreen.js](../../js/modules/auth/lockScreen.js): Schermata di blocco con QR, notifica e PIN di sblocco; salva e rimuove i contenuti dell'app
- [lockScreenChoice.js](../../js/modules/auth/lockScreenChoice.js): Modale per scegliere il metodo di blocco: abbinamento telefono oppure PIN
- [lockScreenPin.js](../../js/modules/auth/lockScreenPin.js): Salvataggio, form di creazione/rimozione e modale di gestione del PIN a 4 cifre
- [splashModal.js](../../js/modules/auth/splashModal.js): Splash iniziale con barra di avanzamento e scelta del profilo personale o ospite
- [suspendedSessionPrompt.js](../../js/modules/auth/suspendedSessionPrompt.js): Modale che propone di ripristinare, ignorare o eliminare una sessione ospite sospesa
- [suspendedSessionService.js](../../js/modules/auth/suspendedSessionService.js): Salva, cifra, elenca e abbina sessioni ospite sospese in localStorage (max 5, 30 giorni)
- [teacherSetupModal.js](../../js/modules/auth/teacherSetupModal.js): Modale per impostare nome e materia del docente in modalità ospite
<!-- hub:map:end -->
