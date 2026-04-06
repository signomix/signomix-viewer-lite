document.addEventListener("DOMContentLoaded", function () {
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
                            <h3 class="text-center">Wprowadź klucz aplikacji</h3>
                        </div>
                        <div class="card-body">
                            ${errorMessage ? `<div class="alert alert-danger" role="alert">${errorMessage}</div>` : ""}
                            <form id="appKeyForm">
                                <div class="mb-3">
                                    <label for="appKeyInput" class="form-label">App Key</label>
                                    <input type="text" class="form-control" id="appKeyInput" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Zatwierdź</button>
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

  function fetchReports(appKey) {
    const url = `${serverUrl}/api/reports/reports`;
    fetch(url, {
      headers: {
        Authentication: appKey,
      },
    })
      .then((response) => {
        if (response.ok) {
          localStorage.setItem("appKey", appKey);
          fetchDashboard();
        } else {
          showAppKeyForm("Błędny klucz aplikacji lub problem z serwerem.");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        showAppKeyForm("Wystąpił błąd podczas komunikacji z serwerem.");
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
          '<div class="alert alert-danger">Wystąpił błąd podczas ładowania dashboardu.</div>';
      });
  }
});
