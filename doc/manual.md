# Podręcznik Użytkownika: Signomix Viewer

## 1. Wprowadzenie

**Signomix Viewer** to lekka, bezpieczna aplikacja typu PWA (Progressive Web App) służąca do przeglądania pulpitów (dashboardów) z platformy **Signomix IoT**. Aplikacja została zaprojektowana z myślą o urządzeniach mobilnych oraz komputerach osobistych, ograniczając do minimum przesyłanie zbędnych danych.

Aplikacja stanowi interfejs wizualny dla danych gromadzonych przez platformę Signomix. Pełną dokumentację platformy Signomix IoT, proces tworzenia pulpitów oraz regulamin można znaleźć na stronie:
🔗 [https://documentation.signomix.com](https://documentation.signomix.com)

## 2. Uruchamianie i Instalacja (PWA)

Jako aplikacja PWA, Signomix Viewer nie wymaga pobierania ze sklepów z aplikacjami (Google Play / App Store). Działa bezpośrednio w przeglądarce, ale może zostać "zainstalowana" w systemie, zachowując się jak natywna aplikacja.

### 2.1. Uruchomienie w przeglądarce
Aby rozpocząć pracę, wystarczy wejść na adres URL aplikacji dostarczony przez administratora (np. `https://twojadomena.com`).
Możesz również wywołać konkretny pulpit podając jego ID w adresie: `https://twojadomena.com/?d=MOJ_DASHBOARD`.

### 2.2. Instalacja na komputerze (Desktop)
1. Otwórz aplikację w przeglądarce opartej na Chromium (Google Chrome, Microsoft Edge, Brave).
2. W pasku adresu, po prawej stronie, pojawi się ikona instalacji (ikona komputera ze strzałką w dół lub przycisk "Zainstaluj").
3. Kliknij ikonę i potwierdź instalację. Aplikacja pojawi się na pulpicie i w menu Start.

*[Miejsce na zrzut ekranu: Przycisk instalacji PWA w pasku adresu przeglądarki Chrome]*

### 2.3. Instalacja na smartfonie (Android / iOS)
**Android (Chrome):**
1. Otwórz adres aplikacji w przeglądarce Chrome.
2. Rozwiń menu przeglądarki (trzy kropki w prawym górnym rogu).
3. Wybierz opcję **"Dodaj do ekranu głównego"** (Add to Home screen).

**iOS (Safari):**
1. Otwórz adres aplikacji w przeglądarce Safari.
2. Naciśnij przycisk "Udostępnij" (kwadrat ze strzałką skierowaną w górę) na dolnym pasku.
3. Przewiń listę w dół i wybierz **"Do ekranu początk."** (Add to Home Screen).

*[Miejsce na zrzut ekranu: Menu przeglądarki mobilnej z zaznaczoną opcją "Dodaj do ekranu głównego"]*

## 3. Funkcjonalność aplikacji

### 3.1. Autoryzacja
Przy pierwszym uruchomieniu zostaniesz poproszony o wpisanie **Klucza aplikacji (App Key)**. Jest to unikalny token uprawniający do odczytu Twoich pulpitów. Po jego wpisaniu, klucz jest bezpiecznie zapamiętywany w przeglądarce.

*[Miejsce na zrzut ekranu: Formularz logowania / wprowadzania klucza App Key]*

### 3.2. Wybór i podgląd pulpitu
Z górnego menu możesz wybrać opcję **"Wybierz pulpit"**. Wyświetli się lista rozwijana zawierająca wszystkie zdefiniowane w Signomiksie pulpity, udostępnione dla Twojego kontay.
Po zatwierdzeniu, pulpit załaduje się na głównym ekranie. Aplikacja posiada mechanizm **automatycznego odświeżania** (np. co 30 sekund), który jest wstrzymywany, gdy aplikacja działa w tle, aby oszczędzać baterię i transfer.

*[Miejsce na zrzut ekranu: Rozwinięta lista dostępnych pulpitów]*
*[Miejsce na zrzut ekranu: Główny widok wybranego pulpitu z danymi]*

Signomix Viewer obsługuje wybrane typy kontrolek pulpitu, aktualnie są to:
- **Karta wartości (Value card)** - wyświetlająca pojedynczą wartość (np. temperatura, wilgotność).
- **Tekst (Text)** - wyświetlający informacje tekstowe.
- **LED (LED)** - sygnalizująca stan (np. włączony/wyłączony).

Inne typy kontrolek nie są obsługiwane w aktualnej wersji aplikacji. Nieobsługiwane sa kontrolki typu:
- **Wykres (Chart)** - różnego rodzaju wykresy.
- **Tabela z danymi (Data table)** - wyświetlająca dane w formie tabelarycznej.
- **Mapa (Map)** - pokazująca lokalizację geograficzną lub trasy.
- **Plan (Plan)** - wizualizacja obiektów i ich stanu (np. wartości z czujników na planie budynku).
- **Przycisk (Button)** - umożliwiający interakcję (np. włącz/wyłącz urządzenie).
- **Data (Date)** - wyświetlająca datę.
- **Obraz (Image)** - pokazujący grafikę lub zdjęcie.
- **Odnośnik (Link)** - umożliwiający przejście do innego pulpitu.
- **Stoper (Stopwatch)** 
- **Czas (Time)**
- **Wartość tekstowa (Text Value)**
- **Surowe dane (Raw Data)**
- **Informacja o źródle danych (Data source info)**

### 3.3. Zmiana wersji językowej
W górnym menu (lub w menu bocznym na urządzeniach mobilnych) znajdują się przyciski **PL / EN**. Kliknięcie jednego z nich natychmiast zmienia język interfejsu aplikacji, bez konieczności przeładowywania strony.

### 3.4. Informacje o aplikacji i aktualizacje
Zakładka **"O aplikacji"** wyświetla:
* Aktualnie wybrany pulpit (ID, Nazwa, Tytuł).
* ID zalogowanego użytkownika.
* Wersję aplikacji.

Jeśli administrator wdroży nową wersję na serwerze, na dole ekranu automatycznie pojawi się baner **"Dostępna jest nowa wersja aplikacji!"**. Wystarczy kliknąć "Zaktualizuj teraz", a aplikacja automatycnie zaktualizuje się do najnowszej wersji.

*[Miejsce na zrzut ekranu: Karta "O aplikacji" ze szczegółami]*
*[Miejsce na zrzut ekranu: Dolny baner informujący o dostępnej aktualizacji]*

## 4. Rozwiązywanie problemów (Błędy)

Podczas korzystania z aplikacji możesz napotkać następujące komunikaty:

* **"Błędny klucz aplikacji lub problem z serwerem"**: Wprowadzony `App Key` jest niepoprawny lub stracił ważność. Spróbuj zalogować się ponownie z poprawnym kluczem wygenerowanym na platformie Signomix.
* **"Wystąpił błąd podczas komunikacji z serwerem"**: Brak połączenia z Internetem. Sprawdź swoje połączenie Wi-Fi/LTE. Dzięki PWA interfejs załaduje się nawet bez sieci, ale pobranie nowych danych wymaga dostępu do Internetu.
* **"Wystąpił błąd podczas ładowania dashboardu"**: Wybrany pulpit mógł zostać usunięty na platformie lub wystąpił chwilowy błąd po stronie serwera Signomix. Spróbuj wybrać pulpit ponownie z menu.

## 5. Bezpieczeństwo

Signomix Viewer został zaprojektowany z zachowaniem standardów bezpieczeństwa:

1. **Bezpieczny transport (HTTPS)**: Aplikacja musi być serwowana przez szyfrowane połączenie HTTPS (wymóg dla technologii Service Worker i PWA).
2. **Ochrona klucza API**: Podany klucz **nigdy** nie jest wysyłany jako część adresu URL (co narażałoby go na wyciek w logach serwera). Jest on przesyłany wyłącznie i bezpiecznie w zaszyfrowanych nagłówkach HTTP (`Authentication`).
3. **Lokalne przechowywanie**: Klucz i preferencje są zapisywane w bezpiecznym magazynie przeglądarki (`Local storage`). Nie są one współdzielone między różnymi witrynami. W przypadku współdzielenia urządzenia, zaleca się "Wylogowanie" lub wyczyszczenie danych przeglądarki.
4. **Bezpieczny Kontener (dla administratorów)**: W przypadku hostowania własnego serwera z aplikacją, obraz Docker uruchamia serwer WWW z uprawnieniami zwykłego użytkownika (non-root), minimalizując ryzyko ataków.
