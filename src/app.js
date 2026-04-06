document.addEventListener("DOMContentLoaded", function () {
  // Słownik tłumaczeń
  const i18n = {
    pl: {
      "nav.title": "Signomix Viewer Lite",
      "nav.select": "Wybierz pulpit",
      "nav.login": "Autoryzacja",
      "nav.help": "Pomoc",
      "nav.about": "O aplikacji",
      "form.title": "Wprowadź klucz aplikacji",
      "form.key": "Klucz aplikacji",
      "form.submit": "Zatwierdź",
      "error.key": "Błędny klucz aplikacji lub problem z serwerem.",
      "error.network": "Wystąpił błąd podczas komunikacji z serwerem.",
      "error.dashboard": "Wystąpił błąd podczas ładowania dashboardu.",
    },
    en: {
      "nav.title": "Signomix Viewer Lite",
      "nav.select": "Select dashboard",
      "nav.login": "Authorization",
      "nav.help": "Help",
      "nav.about": "About",
      "form.title": "Enter application key",
      "form.key": "App Key",
      "form.submit": "Submit",
      "error.key": "Invalid application key or server problem.",
      "error.network":
        "Network error occurred while communicating with the server.",
      "error.dashboard": "An error occurred while loading the dashboard.",
    },
  };

  // Ustawienie początkowego języka
  let currentLang = localStorage.getItem("appLang") || "pl";

  // Funkcja zwracająca przetłumaczony tekst
  function t(key) {
    return i18n[currentLang][key] || key;
  }

  // Funkcja aktualizująca statyczne elementy HTML
  function updateUI() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.documentElement.lang = currentLang;
  }

  // Wywołujemy aktualizację po załadowaniu strony
  updateUI();

  // Obsługa przycisku "Zaloguj się"
  const loginButton = document.getElementById("menu-login");
  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();
      showAppKeyForm();

      // Zwinięcie menu na urządzeniach mobilnych (jeśli jest rozwinięte)
      const navbarCollapse = document.getElementById("navbarNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  }

  document.querySelectorAll(".lang-switch").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      currentLang = this.getAttribute("data-lang");
      localStorage.setItem("appLang", currentLang);
      updateUI();

      // Jeśli jesteśmy na ekranie logowania, przerysujmy formularz
      if (!localStorage.getItem("appKey")) {
        showAppKeyForm();
      }
    });
  });

  let appContainer = document.getElementById("app-container");
  const serverUrl = window.location.origin;

  // Pobierz parametr 'did' z URL
  const urlParams = new URLSearchParams(window.location.search);
  const did = urlParams.get("did"); // dashboard ID
  if (did) {
    localStorage.setItem("did", did);
  }

  // Sprawdź, czy appKey istnieje w localStorage
  let appKey = localStorage.getItem("appKey"); // application key

  if (!appKey) {
    showAppKeyForm();
  } else {
    fetchReports(appKey);
  }

  function showAppKeyForm(errorMessage = null) {
    appContainer.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-center">${t("form.title")}</h3>
                        </div>
                        <div class="card-body">
                            ${errorMessage ? `<div class="alert alert-danger" role="alert">${errorMessage}</div>` : ""}
                            <form id="appKeyForm">
                                <div class="mb-3">
                                    <label for="appKeyInput" class="form-label">${t("form.key")}</label>
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
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const newAppKey = document.getElementById("appKeyInput").value;
        localStorage.setItem("appKey", newAppKey);
        fetchReports(newAppKey);
      });
  }

  function fetchReports(newAppKey) {
    const url = `${serverUrl}/api/reports/reports`;
    fetch(url, {
      headers: {
        Authentication: newAppKey,
      },
    }).then((response) => {
      if (response.ok) {
        try {
          // Zaczekaj na przetworzenie odpowiedzi jako JSON, aby sprawdzić status
          response
            .json()
            .then((reports) => {
              //console.log(JSON.stringify(reports));
              if (reports.status == undefined) {
                localStorage.setItem("appKey", newAppKey);
                appKey = newAppKey;
                fetchDashboard();
              } else {
                // np. status 401 unauthorized, 403 forbidden, 500 server error
                showAppKeyForm(t("error.key"));
              }
            })
            .catch((e) => {
              // Błąd parsowania JSON
              showAppKeyForm(t("error.key"));
            });
        } catch (e) {
          showAppKeyForm(t("error.key"));
        }
      } else {
        showAppKeyForm(t("error.key"));
      }
    });
  }

  function fetchDashboard() {
    const did = localStorage.getItem("did");
    const appKey = localStorage.getItem("appKey");
    const url = `${serverUrl}/api/reports/page/${encodeURIComponent(did)}?title=false&header=false`;

    fetch(url, {
      headers: {
        Authentication: appKey,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        // Po prostu wypełniamy STAŁY kontener z index.html pobranym kodem (bez niszczenia reszty)
        appContainer.innerHTML = html.trim();

        // Wymuszamy na przeglądarce przetworzenie świeżo wstawionego kodu i klas RWD.
        // Wykonanie tego dla dokumentu na poziomie body upewnia, że reguły Media Queries "zaskoczą".
        void document.body.offsetHeight;

        // Powiadamiamy wszelkie skrypty lub wykresy, że rozmiar okna/kontenera się ustabilizował,
        // co jest wymagane przy renderowaniu responsywnych wykresów w widokach mobilnych.
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 50);

        console.log(
          "Dashboard załadowany pomyślnie i odświeżony układ widoku.",
        );
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania dashboardu:", error);
        appContainer.innerHTML =
          '<div class="alert alert-danger">${t("error.dashboard")}</div>';
      });
  }
});
