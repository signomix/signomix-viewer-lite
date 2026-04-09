import { t } from "./i18n.js";

let newWorker;

export function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").then((reg) => {
      // Wykrycie zaległej aktualizacji z poprzedniej wizyty
      if (reg.waiting) {
        newWorker = reg.waiting;
        showUpdateBanner();
      }

      reg.addEventListener("updatefound", () => {
        newWorker = reg.installing;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Nowy service worker zainstalowany - wyświetlamy powiadomienie
              showUpdateBanner();
            }
          }
        });
      });
    });

    // Wymuś sprawdzenie nowej wersji przy każdym uruchomieniu PWA (np. z tła)
    navigator.serviceWorker.ready.then((reg) => {
      reg.update();
    });

    let refreshing;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}

function showUpdateBanner() {
  if (document.getElementById("update-banner")) return;

  const banner = document.createElement("div");
  banner.id = "update-banner";
  banner.className =
    "fixed-bottom w-100 bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow-lg";
  banner.style.zIndex = "9999";

  const text = document.createElement("span");
  text.setAttribute("data-i18n", "pwa.new_version");
  text.textContent = t("pwa.new_version");

  const updateBtn = document.createElement("button");
  updateBtn.className = "btn btn-success btn-sm";
  updateBtn.setAttribute("data-i18n", "pwa.update_now");
  updateBtn.textContent = t("pwa.update_now");

  updateBtn.addEventListener("click", () => {
    if (newWorker) {
      newWorker.postMessage("SKIP_WAITING");
    }
  });

  banner.appendChild(text);
  banner.appendChild(updateBtn);
  document.body.appendChild(banner);
}
