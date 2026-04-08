import { t } from "./i18n.js";
import { checkAppKey, fetchDashboardsList, fetchDashboardHtml } from "./api.js";

const appContainer = document.getElementById("app-container");

const refreshPeriod = 30; // Czas odświeżania w sekundach
let refreshIntervalId = null;

function stopRefresh() {
  if (refreshIntervalId) {
    clearTimeout(refreshIntervalId);
    refreshIntervalId = null;
  }
}

/**
 * Wyświetla formularz logowania (wymaga podania appKey).
 * Opcjonalnie z komunikatem o błędzie.
 */
export function showAppKeyForm(errorMessage = null) {
  stopRefresh();
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
  stopRefresh();
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
          let dName =
            dashboards.find((db) => db.id === selectedDid)?.name || "Unknown";
          localStorage.setItem("dName", dName);
          let dTitle =
            dashboards.find((db) => db.id === selectedDid)?.title || dName;
          localStorage.setItem("dTitle", dTitle);
          renderDashboard();
        }
      });
  } catch (error) {
    //console.error("Błąd podczas pobierania listy pulpitów:", error);
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

    stopRefresh();
    refreshIntervalId = setTimeout(renderDashboard, refreshPeriod * 1000);
  } catch (error) {
    //console.error("Błąd podczas pobierania HTML dashboardu:", error);
    stopRefresh();
    appContainer.innerHTML = `<div class="alert alert-danger">${t("error.dashboard")}</div>`;
  }
}

/**
 * Wyświetla stronę informacyjną o aplikacji i aktualnie wybranym pulpicie
 */
export async function showAboutPage() {
  stopRefresh();
  const did = localStorage.getItem("did") || "None";
  const appKey = localStorage.getItem("appKey");

  let dbName = "Brak danych";
  let dbTitle = "Brak danych";
  let appVersion = "Nieznana";

  try {
    const swResponse = await fetch("./service-worker.js");
    if (swResponse.ok) {
      const swText = await swResponse.text();
      const match = swText.match(/const\s+CACHE_NAME\s*=\s*["']([^"']+)["']/);
      if (match && match[1]) {
        appVersion = match[1];
      }
    }
  } catch (err) {
    console.error(
      "Nie udało się pobrać wersji aplikacji z service workera:",
      err,
    );
  }

  // Jeśli użytkownik jest zalogowany i ma wybrany pulpit, próbujemy pobrać jego szczegóły
  if (appKey && did !== "None") {
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

  const aboutText =
    t("about.text") || "Brak dodatkowych informacji o aplikacji.";

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
                    <p class="mb-3">
                        <strong data-i18n="about.version">${t("about.version")}</strong> ${appVersion}
                    </p>
                    <div class="text-muted" data-i18n="about.text">
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
