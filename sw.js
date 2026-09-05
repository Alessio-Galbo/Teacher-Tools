const CACHE_NAME = "teachertools-v42";
const CSS = ["variables", "base", "layout", "components/nav", "components/cards", "components/forms", "components/modal", "components/toast", "components/pei", "components/dossier", "components/dossierPrint", "components/notes", "components/studentBar", "components/school", "components/tree", "components/overview", "components/rollover", "components/headerYear", "components/tools", "components/quiz", "components/quizPrint", "components/settings"].map((c) => `./css/${c}.css`);

const JS = [
  "./js/app.js", "./js/i18n.js", "./js/utils/dom.js", "./js/utils/toast.js", "./js/utils/renderHelper.js",
  "./js/services/db.js", "./js/services/snapshot.js", "./js/services/gdrive.js", "./js/services/backup.js", "./js/services/studentService.js", "./js/services/pwaInstallService.js",
  "./js/services/schoolConfigService.js", "./js/services/schoolStorage.js", "./js/services/schoolService.js", "./js/services/classService.js", "./js/services/classCleanupService.js", "./js/services/classRolloverService.js",
  "./js/components/headerYearSelector.js", "./js/components/studentBar.js", "./js/components/studentSearchDropdown.js", "./js/components/studentDropdownItems.js", "./js/modules/notes/notesSearchBar.js", "./js/modules/notes/notesHeader.js",
  "./js/modules/pei/peiData.js", "./js/modules/pei/peiDim1.js", "./js/modules/pei/peiDim2.js", "./js/modules/pei/peiDim3.js", "./js/modules/pei/peiDim4.js",
  "./js/modules/pei/peiPhraseService.js", "./js/modules/pei/peiConfigModal.js", "./js/modules/pei/peiConfigListRenderer.js", "./js/modules/pei/peiOutputBox.js", "./js/modules/pei/peiForm.js", "./js/modules/pei/peiModel.js", "./js/modules/pei/peiView.js", "./js/modules/pei/dossierModal.js", "./js/modules/pei/dossierRenderer.js", "./js/modules/pei/dossierText.js",
  "./js/modules/notes/notesModel.js", "./js/modules/notes/noteItem.js", "./js/modules/notes/noteForm.js", "./js/modules/notes/noteModal.js", "./js/modules/notes/noteModalFields.js", "./js/modules/notes/noteTagGroups.js", "./js/modules/notes/notesTagFilter.js", "./js/modules/notes/notesHierarchy.js", "./js/modules/notes/notesGrouper.js", "./js/modules/notes/notesSchoolGrouper.js", "./js/modules/notes/notesYearFilter.js", "./js/modules/notes/notesGroupRenderer.js", "./js/modules/notes/notesDossierRenderer.js", "./js/modules/notes/notesSummaryGenerator.js", "./js/modules/notes/summaryModal.js", "./js/modules/notes/notesView.js",
  "./js/modules/school/schoolLocationHelper.js", "./js/modules/school/schoolTypeSelector.js", "./js/modules/school/schoolCard.js", "./js/modules/school/schoolConfigCard.js", "./js/modules/school/schoolModal.js", "./js/modules/school/studentModal.js", "./js/modules/school/studentSingleForm.js", "./js/modules/school/studentBatchForm.js", "./js/modules/school/studentBatchModal.js", "./js/modules/school/rolloverModal.js", "./js/modules/school/rolloverStudentList.js", "./js/modules/school/rolloverHelper.js", "./js/modules/school/yearSelectModal.js", "./js/modules/school/yearSelectHelper.js", "./js/modules/school/treeNode.js", "./js/modules/school/classTreeNode.js", "./js/modules/school/classEditModal.js", "./js/modules/school/studentTreeNode.js", "./js/modules/school/schoolTreeView.js", "./js/modules/school/studentOverviewBody.js", "./js/modules/school/studentOverviewModal.js", "./js/modules/school/classOverviewBody.js", "./js/modules/school/classOverviewModal.js", "./js/modules/school/schoolOverviewBody.js", "./js/modules/school/schoolOverviewModal.js", "./js/modules/school/globalOverviewModal.js", "./js/modules/school/schoolView.js",
  "./js/modules/settings/gdriveModal.js", "./js/modules/settings/cloudSection.js", "./js/modules/settings/backupSection.js", "./js/modules/settings/teacherProfileCard.js", "./js/modules/settings/pwaInstallModal.js", "./js/modules/settings/pwaInstallCard.js", "./js/modules/settings/settingsModal.js", "./js/modules/settings/settingsView.js", "./js/modules/info/infoModal.js",
  "./js/modules/tools/toolsView.js", "./js/modules/tools/dsa/dsaFormatter.js", "./js/modules/tools/dsa/dsaControls.js", "./js/modules/tools/dsa/dsaPrintModal.js", "./js/modules/tools/dsa/dsaView.js",
  "./js/modules/tools/quiz/quizBuilder.js", "./js/modules/tools/quiz/quizModel.js", "./js/modules/tools/quiz/quizRandomizer.js", "./js/modules/tools/quiz/quizPointsModal.js", "./js/modules/tools/quiz/quizOptionsRenderer.js", "./js/modules/tools/quiz/quizQuestionsList.js", "./js/modules/tools/quiz/quizMaxScoreBox.js", "./js/modules/tools/quiz/quizPrintHeaderRenderer.js", "./js/modules/tools/quiz/quizPrintFieldsSelector.js", "./js/modules/tools/quiz/quizPrintOptionsBar.js", "./js/modules/tools/quiz/quizPrintSheetRenderer.js", "./js/modules/tools/quiz/quizPrintModal.js", "./js/modules/tools/quiz/quizSavedModal.js", "./js/modules/tools/quiz/quizVariantMinimalBar.js", "./js/modules/tools/quiz/quizVariantsBar.js", "./js/modules/tools/quiz/quizHeaderCard.js", "./js/modules/tools/quiz/quizToolbar.js", "./js/modules/tools/quiz/quizCardRenderer.js", "./js/modules/tools/quiz/quizView.js",
  "./js/modules/tools/grades/gradesModel.js", "./js/modules/tools/grades/gradeCalculator.js", "./js/modules/tools/grades/gradeModalRoster.js", "./js/modules/tools/grades/gradeModalFields.js", "./js/modules/tools/grades/gradeModal.js", "./js/modules/tools/grades/gradesCardRenderer.js", "./js/modules/tools/grades/gradesView.js",
  "./js/modules/tools/planner/planModel.js", "./js/modules/tools/planner/planModalFields.js", "./js/modules/tools/planner/planModal.js", "./js/modules/tools/planner/plansListView.js", "./js/modules/tools/planner/calendarModel.js", "./js/modules/tools/planner/calendarCardRenderer.js", "./js/modules/tools/planner/calendarEventModal.js", "./js/modules/tools/planner/calendarView.js", "./js/modules/tools/planner/plannerView.js"
];

const CORE_ASSETS = [
  "./", "./index.html", "./manifest.json", "./favicon.ico",
  "./locales/it.json", "./locales/en.json",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/apple-touch-icon.png",
  ...CSS, ...JS
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && e.request.method === "GET") {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => new Response("Offline", { status: 408 }));
    })
  );
});
