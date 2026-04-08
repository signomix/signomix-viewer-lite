import { initI18n } from "./i18n.js";
import { initPWA } from "./pwa.js";
import {
  showAppKeyForm,
  selectDashboardForm,
  renderDashboard,
  showAboutPage,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initPWA();

  // 1. Inicjalizacja mechanizmu tłumaczeń
  // Callback odświeża formularz logowania, jeśli zostanie zmieniony język,
  // a użytkownik nie jest jeszcze zalogowany.
  initI18n((lang) => {
    if (!localStorage.getItem("appKey")) {
      showAppKeyForm();
    }
    closeMobileMenu();
  });

  // 2. Pobierz parametr 'd' z adres URL
  const urlParams = new URLSearchParams(window.location.search);
  const did = urlParams.get("d"); // dashboard ID przekazany jako parametr URL ?d=12345
  if (did) {
    localStorage.setItem("did", did);
  }

  // 3. Logika startowa: decydujemy co pokazać użytkownikowi
  const appKey = localStorage.getItem("appKey");

  if (!appKey) {
    // Brak klucza = pokaż logowanie
    showAppKeyForm();
  } else if (!localStorage.getItem("did")) {
    // Mamy klucz, ale nie wiemy który pulpit pokazać
    selectDashboardForm();
  } else {
    // Mamy klucz i ID pulpitu, więc od razu ładujemy dashboard
    renderDashboard();
  }

  // 4. Podpięcie zdarzeń do paska nawigacyjnego (górnego menu)
  const loginButton = document.getElementById("menu-login");
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      showAppKeyForm();
      closeMobileMenu();
    });
  }

  const selectDashboardBtn = document.getElementById("menu-select-dashboard");
  if (selectDashboardBtn) {
    selectDashboardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      selectDashboardForm();
      closeMobileMenu();
    });
  }

  const aboutBtn = document.getElementById("menu-about");
  if (aboutBtn) {
    aboutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showAboutPage();
      closeMobileMenu();
    });
  }

  // Funkcja pomocnicza: zwija menu typu "hamburger" na urządzeniach mobilnych po kliknięciu w opcję
  function closeMobileMenu() {
    const navbarCollapse = document.getElementById("navbarNav");
    if (
      navbarCollapse &&
      navbarCollapse.classList.contains("show") &&
      window.bootstrap
    ) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  }
});
