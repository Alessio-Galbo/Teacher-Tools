# Teacher Tools — istruzioni per agenti AI

Valgono le regole globali di AI-hub (file ≤ 100 righe, testi in `locales/`, niente codice inline). In più, per questo progetto:
1. **Git:** mai `git commit` / `git push` in autonomia; proponi e attendi conferma.
2. **Strumenti:** script in `Tools/`; aggiorna sempre [Tools/README.md](Tools/README.md).
3. **Versione e rilascio:** unica fonte `js/modules/info/changelogData.js`; procedura in 4 passi (versione, traduzioni, `CACHE_NAME` in `sw.js`, `python Tools/verify_rules.py`) in [Tools/RELEASE_WORKFLOW.md](Tools/RELEASE_WORKFLOW.md).
4. **Architettura** (versione e changelog, profili dispositivo, sincronizzazione): [docs/architettura.md](docs/architettura.md).

<!-- hub:map:start -->
## Mappe
| Area | Mappa | Contenuto |
|---|---|---|
| `Tools/` | [Tools](docs/maps/Tools.md) | Registro Strumenti e Utility (`/Tools`) |
| `css/` | [css](docs/maps/css.md) | 24 file in components/ |
| `js/components/` | [js-components](docs/maps/js-components.md) | 4 file, es. headerYearSelector.js, studentBar.js, studentDropdownItems.js |
| `js/modules/auth/` | [js-modules-auth](docs/maps/js-modules-auth.md) | 12 file, es. deviceProfile.js, firstRunWizard.js, guestBarUI.js |
| `js/modules/info/` | [js-modules-info](docs/maps/js-modules-info.md) | 4 file, es. changelogData.js, changelogModal.js, infoModal.js |
| `js/modules/notes/` | [js-modules-notes](docs/maps/js-modules-notes.md) | 18 file, es. noteForm.js, noteItem.js, noteModal.js |
| `js/modules/pei/` | [js-modules-pei](docs/maps/js-modules-pei.md) | 15 file, es. dossierModal.js, dossierRenderer.js, dossierText.js |
| `js/modules/school/` | [js-modules-school](docs/maps/js-modules-school.md) | 29 file, es. classEditModal.js, classListCard.js, classOverviewBody.js |
| `js/modules/settings/` | [js-modules-settings](docs/maps/js-modules-settings.md) | 15 file, es. backupSection.js, cloudSection.js, deviceMeshCard.js |
| `js/modules/sync/` | [js-modules-sync](docs/maps/js-modules-sync.md) | 29 file, es. cryptoUtils.js, deviceInfo.js, deviceMesh.js |
| `js/modules/tools/` | [js-modules-tools](docs/maps/js-modules-tools.md) | 40 file in dsa/, grades/, planner/, quiz/ |
| `js/services/` | [js-services](docs/maps/js-services.md) | 13 file, es. backup.js, classCleanupService.js, classRolloverService.js |
| `js/utils/` | [js-utils](docs/maps/js-utils.md) | 3 file, es. dom.js, renderHelper.js, toast.js |
| `misc` | [misc](docs/maps/misc.md) | file nella root e cartelle piccole: docs/, js/, locales/ |
## Avvio e test
- servizio `python Tools/server.py`: porta 8105 · `python Tools/server.py --port 8105`
- test: `python -m unittest` (dalla root)
## Regole
- globali: `~/.claude/CLAUDE.md` e `~/.gemini/GEMINI.md` (generate da AI-hub)
## Skill attive
- per tag: app-icon-generation, headless-chrome-cdp, pwa-service-worker-checklist, service-troubleshooting
## Non qui
- `.agents/`, `.claude/`, `.github/`: config dei tool AI
- `__pycache__/`: dipendenze/generati
<!-- hub:map:end -->
