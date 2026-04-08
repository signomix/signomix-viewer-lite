export const dictionary = {
  pl: {
    "nav.title": "Signomix Viewer Lite",
    "nav.select": "Wybierz pulpit",
    "nav.login": "Zaloguj się",
    "nav.help": "Pomoc",
    "nav.about": "O aplikacji",
    "form.title": "Wprowadź klucz aplikacji",
    "form.key": "Klucz aplikacji",
    "form.submit": "Zatwierdź",
    "form.select_dashboard": "Wybierz pulpit",
    "form.dashboard": "Pulpit",
    "form.show": "Wyświetl",
    "error.key": "Błędny klucz aplikacji lub problem z serwerem.",
    "error.network": "Wystąpił błąd podczas komunikacji z serwerem.",
    "error.dashboard": "Wystąpił błąd podczas ładowania dashboardu.",
    "error.fetch_dashboards":
      "Wystąpił błąd podczas pobierania listy pulpitów.",
    "footer.text": "© 2023 Signomix. Wszelkie prawa zastrzeżone.",
    "about.current_dashboard": "Aktualny pulpit",
    "about.id": "ID:",
    "about.name": "Nazwa:",
    "about.title": "Tytuł:",
    "about.info": "Informacje o aplikacji",
    "about.close": "Zamknij",
  },
  en: {
    "nav.title": "Signomix Viewer Lite",
    "nav.select": "Select dashboard",
    "nav.login": "Log in",
    "nav.help": "Help",
    "nav.about": "About",
    "form.title": "Enter application key",
    "form.key": "App Key",
    "form.submit": "Submit",
    "form.select_dashboard": "Select dashboard",
    "form.dashboard": "Dashboard",
    "form.show": "Show",
    "error.key": "Invalid application key or server problem.",
    "error.network":
      "Network error occurred while communicating with the server.",
    "error.dashboard": "An error occurred while loading the dashboard.",
    "error.fetch_dashboards":
      "An error occurred while fetching the dashboards list.",
    "footer.text": "© 2023 Signomix. All rights reserved.",
    "about.current_dashboard": "Current dashboard",
    "about.id": "ID:",
    "about.name": "Name:",
    "about.title": "Title:",
    "about.info": "Application info",
    "about.close": "Close",
  },
};

let currentLang = localStorage.getItem("appLang") || "pl";

export function t(key) {
  return dictionary[currentLang][key] || key;
}

export function updateUI() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.documentElement.lang = currentLang;
}

export function getCurrentLang() {
  return currentLang;
}

export function setLang(lang) {
  if (dictionary[lang]) {
    currentLang = lang;
    localStorage.setItem("appLang", currentLang);
    updateUI();
  }
}

export function initI18n(onLanguageChangeCallback) {
  updateUI();

  document.querySelectorAll(".lang-switch").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang");
      setLang(lang);
      if (typeof onLanguageChangeCallback === "function") {
        onLanguageChangeCallback(lang);
      }
    });
  });
}
