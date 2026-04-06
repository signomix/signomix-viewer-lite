#!/bin/bash

IMAGE_NAME="signomix-viewer-lite"
IMAGE_TAG="latest"

echo "Zaczynam budowanie lekkiego i bezpiecznego obrazu Docker: $IMAGE_NAME:$IMAGE_TAG ..."

# Uruchomienie budowania z wykorzystaniem podanego przed chwilą Dockerfile
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

echo "=========================================================="
echo "Gotowe! Obraz został pomyślnie zbudowany."
echo ""
echo "Aby uruchomić aplikację zablokowaną w tle (detached), wykonaj:"
echo "  docker run -d -p 8080:8080 --name $IMAGE_NAME $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Aplikacja będzie wtedy dostępna pod adresem: http://localhost:8080"
