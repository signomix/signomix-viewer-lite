# Używamy lekkiego i bezpiecznego obrazu nginx działającego jako non-root
FROM nginxinc/nginx-unprivileged:alpine

# Zastępujemy domyślną konfigurację naszą bezpieczną wersją
COPY default.conf /etc/nginx/conf.d/default.conf

# Kopiujemy wszystkie pliki aplikacji (w tym manifest, index.html, JS i CSS)
# z uprawnieniami użytkownika 'nginx'
COPY --chown=nginx:nginx src/ /usr/share/nginx/html/

# Port, na którym działa nginx-unprivileged (zazwyczaj 8080 zamiast 80)
EXPOSE 8080
