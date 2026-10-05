<!-- hub:map:start -->
# Mappa: js/modules/sync/
Torna al [router](../../AGENTS.md) · 29 file
- [cryptoUtils.js](../../js/modules/sync/cryptoUtils.js): Utilità crypto: token casuali, SHA-256, passphrase, base64 e cifratura XOR a keystream
- [deviceInfo.js](../../js/modules/sync/deviceInfo.js): Rileva tipo, OS e modello del dispositivo e gestisce il suo nome personalizzato
- [deviceMesh.js](../../js/modules/sync/deviceMesh.js): Gestisce il token del cluster di dispositivi e riesporta le funzioni di DB e hash
- [deviceMeshDB.js](../../js/modules/sync/deviceMeshDB.js): Archivio IndexedDB dei dispositivi accoppiati: lettura, salvataggio, rinomina, rimozione
- [deviceMeshHash.js](../../js/modules/sync/deviceMeshHash.js): Gestisce link con hash #pair e #unlock per accoppiare o sbloccare un dispositivo
- [directorySync.js](../../js/modules/sync/directorySync.js): Sincronizzazione su cartelle locali via File System Access, handle salvati in IndexedDB
- [localSyncBadge.js](../../js/modules/sync/localSyncBadge.js): Ascolta gli eventi di stato sync e li registra in console, rimuove il vecchio badge
- [localSyncCommands.js](../../js/modules/sync/localSyncCommands.js): Comandi di sync locale: scollega, sblocco remoto, stato blocco, HELLO e heartbeat
- [localSyncHandlers.js](../../js/modules/sync/localSyncHandlers.js): Gestisce i messaggi sync in arrivo: HELLO, blocco schermo, unpair, merge dati e checksum
- [localSyncPeer.js](../../js/modules/sync/localSyncPeer.js): Stato connessione peer locale, BroadcastChannel, liveness e invio messaggi cifrati
- [localSyncSender.js](../../js/modules/sync/localSyncSender.js): Avvia la sincronizzazione bilaterale: invia dump DB, attende ack, timeout e rifiuto
- [mqttEncoder.js](../../js/modules/sync/mqttEncoder.js): Codifica e decodifica pacchetti MQTT (CONNECT, SUBSCRIBE, PUBLISH, PINGREQ)
- [pairingHistory.js](../../js/modules/sync/pairingHistory.js): Storico in localStorage dei token di abbinamento e ricerca token da hash
- [pairingModal.js](../../js/modules/sync/pairingModal.js): Modale di abbinamento dispositivi con QR, codice alternativo e inserimento manuale
- [pairingResultUI.js](../../js/modules/sync/pairingResultUI.js): Mostra il riepilogo dei risultati della sincronizzazione dopo l'abbinamento
- [pairingSuccessUI.js](../../js/modules/sync/pairingSuccessUI.js): Schermata di abbinamento riuscito con pulsanti sincronizza ora o salta
- [payloadCompressor.js](../../js/modules/sync/payloadCompressor.js): Comprime e decomprime byte con gzip tramite CompressionStream, se disponibile
- [qrGf.js](../../js/modules/sync/qrGf.js): Aritmetica Galois GF(256) e codifica Reed-Solomon per i codici QR
- [qrMatrix.js](../../js/modules/sync/qrMatrix.js): Genera la matrice QR versione 5: pattern, codeword dati, correzione errori e maschera
- [qrSvg.js](../../js/modules/sync/qrSvg.js): Disegna una matrice QR come elemento SVG
- [remoteUnlockBanner.js](../../js/modules/sync/remoteUnlockBanner.js): Banner nell'header per sbloccare da remoto un dispositivo abbinato bloccato
- [sha256.js](../../js/modules/sync/sha256.js): Implementazione SHA-256 in JavaScript puro per byte e stringhe con output esadecimale
- [signalingReceiver.js](../../js/modules/sync/signalingReceiver.js): Riceve messaggi MQTT di signaling, scarta duplicati, decifra e avvisa i listener
- [smartMerge.js](../../js/modules/sync/smartMerge.js): Unisce i dati remoti con quelli locali per timestamp, con backup di sicurezza preventivo
- [syncConfirmModal.js](../../js/modules/sync/syncConfirmModal.js): Modale che chiede all'utente di autorizzare la sincronizzazione da un dispositivo
- [syncSummaryFormatter.js](../../js/modules/sync/syncSummaryFormatter.js): Formatta il riepilogo testuale e le pillole con icone degli elementi sincronizzati
- [webrtcChunker.js](../../js/modules/sync/webrtcChunker.js): Divide i messaggi grandi in chunk per il DataChannel e li ricompone in ricezione
- [webrtcPeer.js](../../js/modules/sync/webrtcPeer.js): Gestisce la connessione WebRTC peer-to-peer: offerta, risposta, ICE e DataChannel
- [webrtcSignaling.js](../../js/modules/sync/webrtcSignaling.js): Segnalazione WebRTC via broker MQTT su WebSocket, con riconnessione e cambio broker
<!-- hub:map:end -->
