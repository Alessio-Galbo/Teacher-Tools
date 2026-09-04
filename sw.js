const CACHE_NAME = "teachertools-v14";
const CSS = ["variables", "base", "layout", "components/nav", "components/cards", "components/forms", "components/modal", "components/toast", "components/pei", "components/dossier", "components/notes", "components/studentBar", "components/school", "components/tree", "components/overview", "components/rollover"].map((c) => `./css/${c}.css`);
const JS = [
  "./js/app.js", "./js/i18n.js", "./js/utils/dom.js", "./js/utils/toast.js", "./js/utils/renderHelper.js",
  "./js/services/db.js", "./js/services/snapshot.js", "./js/services/gdrive.js", "./js/services/backup.js", "./js/services/studentService.js",
  "./js/services/schoolConfigService.js", "./js/services/schoolStorage.js", "./js/services/schoolService.js", "./js/services/classService.js",
  "./js/components/headerYearSelector.js", "./js/components/studentBar.js", "./js/components/studentSearchDropdown.js", "./js/components/studentDropdownItems.js", "./js/modules/notes/notesSearchBar.js",
  "./js/modules/pei/peiData.js", "./js/modules/pei/peiDim1.js", "./js/modules/pei/peiDim2.js", "./js/modules/pei/peiDim3.js", "./js/modules/pei/peiDim4.js",
  "./js/modules/pei/peiForm.js", "./js/modules/pei/peiModel.js", "./js/modules/pei/peiView.js", "./js/modules/pei/dossierModal.js", "./js/modules/pei/dossierRenderer.js", "./js/modules/pei/dossierText.js",
  "./js/modules/notes/notesModel.js", "./js/modules/notes/noteItem.js", "./js/modules/notes/noteForm.js", "./js/modules/notes/noteModal.js", "./js/modules/notes/noteTagGroups.js", "./js/modules/notes/notesTagFilter.js", "./js/modules/notes/notesHierarchy.js", "./js/modules/notes/notesGrouper.js", "./js/modules/notes/summaryModal.js", "./js/modules/notes/notesView.js",
  "./js/modules/school/schoolCard.js", "./js/modules/school/schoolConfigCard.js", "./js/modules/school/schoolModal.js", "./js/modules/school/studentModal.js", "./js/modules/school/rolloverModal.js", "./js/modules/school/rolloverStudentList.js", "./js/modules/school/treeNode.js", "./js/modules/school/classTreeNode.js", "./js/modules/school/studentTreeNode.js", "./js/modules/school/schoolTreeView.js", "./js/modules/school/studentOverviewBody.js", "./js/modules/school/studentOverviewModal.js", "./js/modules/school/classOverviewModal.js", "./js/modules/school/schoolView.js",
  "./js/modules/settings/cloudSection.js", "./js/modules/settings/backupSection.js", "./js/modules/settings/settingsView.js"
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
