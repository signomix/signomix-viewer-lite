# Używamy lekkiego i bezpiecznego obrazu nginx działającego jako non-root
FROM nginxinc/nginx-unprivileged:alpine

# Wersja przekazywana podczas budowania obrazu
ARG SGX_VIEWER_LITE_VERSION=dev

# Zastępujemy domyślną konfigurację naszą bezpieczną wersją
COPY default.conf /etc/nginx/conf.d/default.conf

# Kopiujemy wszystkie pliki aplikacji (w tym manifest, index.html, JS i CSS)
# z uprawnieniami użytkownika 'nginx'
COPY --chown=nginx:nginx src/ /usr/share/nginx/html/

# Podmieniamy placeholder wersji w service workerze na wartość z ARG (wymaga uprawnień roota do zapisu w katalogu)
USER root
RUN sed -i "s/__SGX_VIEWER_LITE_VERSION__/${SGX_VIEWER_LITE_VERSION}/g" /usr/share/nginx/html/service-worker.js
USER nginx

# Port, na którym działa nginx-unprivileged (zazwyczaj 8080 zamiast 80)
EXPOSE 8080
