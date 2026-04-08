# Signomix Viewer Lite

Dashboard viewer for Signomix platform. Lekka, bezpieczna aplikacja typu PWA (Progressive Web App) służąca do przeglądania pulpitów (dashboardów) z platformy Signomix. Zbudowana w oparciu o czysty kod JavaScript (Vanilla JS) oraz Bootstrap 5, bez użycia ciężkich frameworków.

## Funkcje

- **PWA (Progressive Web App):** Możliwość "zainstalowania" aplikacji na ekranie głównym urządzenia mobilnego lub desktopowego (zawiera odpowiedni `manifest.json` oraz ikony).
- **Bezpieczeństwo:** Klucz aplikacji (`appKey`) jest przesyłany w bezpieczny sposób za pomocą nagłówka HTTP `Authentication`, zamiast w widocznym parametrze URL.
- **Dynamiczna konfiguracja:** Aplikacja automatycznie rozpoznaje swój adres bazowy (np. podczas przenosin między środowiskiem testowym a produkcyjnym).
- **Lekki kontener Docker:** Aplikacja jest gotowa do wdrożenia dzięki dołączonemu plikowi `Dockerfile`, opartemu na bezpiecznym, uruchamianym bez uprawnień roota serwerze Nginx (obraz `nginxinc/nginx-unprivileged:alpine`).

## Struktura projektu

- `src/` - Główne pliki źródłowe aplikacji (HTML, CSS, JS, manifest, ikony).
- `Dockerfile` - Przepis do zbudowania lekkiego obrazu Docker.
- `default.conf` - Bezpieczna konfiguracja serwera Nginx (dodająca m.in. nagłówki bezpieczeństwa HTTP i obsługę PWA).
- `build-docker.sh` - Skrypt pomocniczy ułatwiający zbudowanie obrazu.

## Uruchamianie

### Uruchomienie lokalne (Development)
Możesz użyć dowolnego lokalnego serwera HTTP do serwowania plików statycznych z folderu `src`. Na przykład korzystając z Node.js (npx):
```bash
npx serve src
```
Lub z poziomu środowiska Python:
```bash
cd src
python -m http.server 8080
```

### Uruchomienie z użyciem Docker (Produkcja / Testy)
Dołączony skrypt automatyzuje proces budowy bezpiecznego i lekkiego obrazu.

1. Zbuduj obraz uruchamiając skrypt:
```bash
./build-docker.sh
```

2. Uruchom kontener w tle (port 8080):
```bash
docker run -d -p 8080:8080 --name signomix-viewer-lite signomix-viewer-lite:latest
```

Twoja aplikacja będzie dostępna pod adresem: `http://localhost:8080`

## Użytkowanie

Aby prawidłowo wywołać dany dashboard w przeglądarce, przekaż parametr `did` (Dashboard ID) w adresie URL, np:
`http://localhost:8080/?d=MY_DASHBOARD_ID`

1. Przy pierwszym uruchomieniu aplikacja poprosi o wpisanie **klucza aplikacji (App Key)** w celu uwierzytelnienia.
2. Po poprawnej autoryzacji klucz zostaje zapamiętany w lokalnej pamięci przeglądarki (`localStorage`), a następnie żądany dashboard zostanie pobrany i wyświetlony.
3. Wszelka późniejsza komunikacja z API Signomix (np. pobieranie danych) odbywa się poprzez wysyłanie podanego klucza w nagłówku `Authentication`.
