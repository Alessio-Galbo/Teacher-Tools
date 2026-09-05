# Guida Operativa: Rilascio Versioni & Aggiornamento Changelog

Questo documento descrive l'architettura delle versioni e la procedura standard per rilasciare nuovi aggiornamenti in **Teacher Tools**.

---

## 1. Architettura & Singola Fonte di Verità

Il sistema è centralizzato per evitare disallineamenti tra codice, interfaccia e notifiche:

* **Costante di Versione & Dati:** [`js/modules/info/changelogData.js`](../js/modules/info/changelogData.js)
  * `CURRENT_APP_VERSION`: numero di versione corrente (es. `"0.5.0"`). Usato dinamicamente sia dal badge nella finestra Info (ℹ️), sia dall'avvisatore di aggiornamenti.
  * `CHANGELOG_HISTORY`: array ordinato delle release con `version`, `date`, `titleKey` e lista chiavi `items`.
* **Traduzioni Bilingue:** [`locales/it.json`](../locales/it.json) e [`locales/en.json`](../locales/en.json)  
  I testi delle novità sono salvati come chiavi i18n per supportare il cambio lingua all'istante.
* **Notifica Automatica:** [`js/modules/info/updateNotifier.js`](../js/modules/info/updateNotifier.js)  
  Al primo avvio dopo un aggiornamento, confronta `CURRENT_APP_VERSION` con `localStorage` e apre in automatico la modale *"Novità della Versione"*.
* **Cache PWA:** [`sw.js`](../sw.js)  
  `CACHE_NAME`: controlla la propagazione immediata dei nuovi file su smartphone e browser.

---

## 2. Procedura di Rilascio in 4 Passaggi

Quando è pronta una nuova versione (es. `0.5.1` o `0.6.0`):

### Passo 1: Aggiornare `changelogData.js`
1. Modificare `export const CURRENT_APP_VERSION = "0.X.Y";`.
2. Aggiungere in cima a `CHANGELOG_HISTORY` il nuovo blocco versione:
   ```javascript
   {
     version: "0.X.Y",
     date: "AAAA-MM-GG",
     titleKey: "changelog_v0XY_title",
     items: ["changelog_v0XY_item1", "changelog_v0XY_item2"],
   },
   ```

### Passo 2: Aggiungere i testi nei file di Lingua
In `locales/it.json` e `locales/en.json`, aggiungere le stringhe per `changelog_v0XY_title` e le voci `item`.

### Passo 3: Incrementare la Cache in `sw.js`
In `sw.js`, avanzare di 1 la versione della cache:
```javascript
const CACHE_NAME = "teachertools-v46"; // incrementa il numero
```

### Passo 4: Verifica, Commit e Tag di Rilascio
1. Eseguire la validazione vincoli:
   ```powershell
   python Tools/verify_rules.py
   ```
2. **Attenzione (Regola PERMISSION FIRST):** Mostrare le modifiche all'utente e attendere il suo consenso prima di eseguire:
   ```powershell
   git add .
   git commit -m "Release v0.X.Y: ..."
   git push origin main
   git tag -a v0.X.Y -m "Teacher Tools v0.X.Y"
   git push origin v0.X.Y
   ```
3. Creare la Release corrispondente su GitHub (`https://github.com/Alessio-Galbo/Teacher-Tools/releases`).
