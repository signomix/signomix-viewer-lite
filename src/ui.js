import { t } from "./i18n.js";
import { checkAppKey, fetchDashboardsList, fetchDashboardHtml } from "./api.js";

const appContainer = document.getElementById("app-container");

/**
 * Wyświetla formularz logowania (wymaga podania appKey).
 * Opcjonalnie z komunikatem o błędzie.
 */
export function showAppKeyForm(errorMessage = null) {
  appContainer.innerHTML = `
      <div class="row justify-content-center">
          <div class="col-md-6">
              <div class="card shadow-sm">
                  <div class="card-header bg-primary text-white">
                      <h3 class="text-center mb-0">${t("form.title")}</h3>
                  </div>
                  <div class="card-body">
                      ${errorMessage ? `<div class="alert alert-danger" role="alert">${errorMessage}</div>` : ""}
                      <form id="appKeyForm">
                          <div class="mb-3">
                              <label for="appKeyInput" class="form-label fw-bold">${t("form.key")}</label>
                              <input type="text" class="form-control" id="appKeyInput" required>
                          </div>
                          <button type="submit" class="btn btn-primary w-100">${t("form.submit")}</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  `;

  document
    .getElementById("appKeyForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const newAppKey = document.getElementById("appKeyInput").value.trim();

      try {
        // Weryfikujemy nowy klucz
        const response = await checkAppKey(newAppKey);

        try {
          const reports = await response.json();
          console.log(JSON.stringify(reports));
          if (reports.status === undefined) {
            localStorage.setItem("appKey", newAppKey);

            // Jeśli mamy już jakieś zapisane ID, wyrenderuj od razu pulpit,
            // w przeciwnym razie wyświetl listę wyboru pulpitów
            if (localStorage.getItem("did")) {
              renderDashboard();
            } else {
              selectDashboardForm();
            }
          } else {
            // Np. status 401 unauthorized, 403 forbidden
            showAppKeyForm(t("error.key"));
          }
        } catch (err) {
          showAppKeyForm(t("error.key"));
        }
      } catch (error) {
        console.error("Błąd podczas logowania:", error);
        showAppKeyForm(t("error.network"));
      }
    });
}

/**
 * Wyświetla formularz z listą rozwijaną (select) umożliwiający wybór pulpitu.
 * Odpytuje API o wszystkie dostępne dla danego klucza pulpity.
 */
export async function selectDashboardForm() {
  const appKey = localStorage.getItem("appKey");

  if (!appKey) {
    showAppKeyForm();
    return;
  }

  try {
    const dashboards = await fetchDashboardsList(appKey);
    const savedDid = localStorage.getItem("did");

    let optionsHtml = "";
    dashboards.forEach((db) => {
      const isSelected = db.id === savedDid ? "selected" : "";
      optionsHtml += `<option value="${db.id}" ${isSelected}>${db.name}</option>`;
    });

    appContainer.innerHTML = `
      <div class="row justify-content-center">
          <div class="col-md-6">
              <div class="card shadow-sm">
                  <div class="card-header bg-secondary text-white">
                      <h3 class="text-center mb-0">${t("form.select_dashboard")}</h3>
                  </div>
                  <div class="card-body">
                      <form id="selectDashboardForm">
                          <div class="mb-3">
                              <label for="dashboardSelect" class="form-label fw-bold">${t("form.dashboard")}</label>
                              <select class="form-select" id="dashboardSelect" required>
                                  <option value="" disabled ${!savedDid ? "selected" : ""}>-- ${t("form.select_dashboard")} --</option>
                                  ${optionsHtml}
                              </select>
                          </div>
                          <button type="submit" class="btn btn-primary w-100">${t("form.show")}</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    `;

    document
      .getElementById("selectDashboardForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedDid = document.getElementById("dashboardSelect").value;
        if (selectedDid) {
          localStorage.setItem("did", selectedDid);
          renderDashboard();
        }
      });
  } catch (error) {
    console.error("Błąd podczas pobierania listy pulpitów:", error);
    showAppKeyForm(t("error.fetch_dashboards")); // Opcjonalnie wyloguj, jeśli to wina złego appKey
  }
}

/**
 * Renderuje wybrany pulpit (dashboard) na cały ekran (appContainer).
 */
export async function renderDashboard() {
  const did = localStorage.getItem("did");
  const appKey = localStorage.getItem("appKey");

  // Jeśli brak wymaganych danych w storage, wymuś wywołanie formularza logowania lub wyboru pulpitu
  if (!appKey) return showAppKeyForm();
  if (!did) return selectDashboardForm();

  try {
    const htmlContent = await fetchDashboardHtml(did, appKey);

    // Po prostu wypełniamy STAŁY kontener z index.html pobranym kodem (bez niszczenia reszty)
    appContainer.innerHTML = htmlContent.trim();

    // Wymuszamy na przeglądarce przetworzenie świeżo wstawionego kodu i klas RWD.
    void document.body.offsetHeight;

    // Powiadamiamy wszelkie skrypty lub wykresy, że rozmiar okna/kontenera się ustabilizował
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  } catch (error) {
    console.error("Błąd podczas pobierania HTML dashboardu:", error);
    appContainer.innerHTML = `<div class="alert alert-danger">${t("error.dashboard")}</div>`;
  }
}

/**
 * Wyświetla stronę informacyjną o aplikacji i aktualnie wybranym pulpicie
 */
export async function showAboutPage() {
  const did = localStorage.getItem("did") || "Brak";
  const appKey = localStorage.getItem("appKey");

  let dbName = "Brak danych";
  let dbTitle = "Brak danych";

  // Jeśli użytkownik jest zalogowany i ma wybrany pulpit, próbujemy pobrać jego szczegóły
  if (appKey && did !== "Brak") {
    try {
      const dashboards = await fetchDashboardsList(appKey);
      const currentDb = dashboards.find((db) => db.id === did);
      if (currentDb) {
        dbName = currentDb.name || dbName;
        dbTitle = currentDb.title || currentDb.name || "Brak danych";
      }
    } catch (err) {
      console.error("Nie udało się pobrać szczegółów pulpitu:", err);
    }
  }

  const aboutText = `
    <p><strong>Signomix Viewer Lite</strong> to lekka, bezpieczna aplikacja w architekturze PWA służąca do przeglądania pulpitów.</p>
    <p>Została zaprojektowana z myślą o urządzeniach mobilnych oraz ograniczeniu przesyłania zbędnych danych.</p>
  `;

  appContainer.innerHTML = `
    <div class="row justify-content-center mt-3">
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-info text-white">
                    <h3 class="text-center mb-0" data-i18n="nav.about">${t("nav.about")}</h3>
                </div>
                <div class="card-body">
                    <h5 class="border-bottom pb-2 mb-3" data-i18n="about.current_dashboard">${t("about.current_dashboard")}</h5>
                    <table class="table table-borderless table-sm mb-4">
                        <tbody>
                            <tr><th scope="row" style="width: 20%;" data-i18n="about.id">${t("about.id")}</th><td>${did}</td></tr>
                            <tr><th scope="row" data-i18n="about.name">${t("about.name")}</th><td>${dbName}</td></tr>
                            <tr><th scope="row" data-i18n="about.title">${t("about.title")}</th><td>${dbTitle}</td></tr>
                        </tbody>
                    </table>

                    <h5 class="border-bottom pb-2 mb-3" data-i18n="about.info">${t("about.info")}</h5>
                    <div class="text-muted">
                        ${aboutText}
                    </div>
                    <div class="mt-4 text-center">
                        <button id="closeAboutBtn" class="btn btn-secondary w-100" data-i18n="about.close">${t("about.close")}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

  document
    .getElementById("closeAboutBtn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      renderDashboard();
    });
}
