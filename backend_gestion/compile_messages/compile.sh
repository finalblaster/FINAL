#!/bin/bash
# Script pour compiler les fichiers de traduction

# Se déplacer au répertoire où se trouvent les fichiers de traduction
cd "$(dirname "$0")/.."

# Compiler les fichiers de traduction pour chaque langue
for lang in en es de; do
  echo "Compilation des traductions pour la langue: $lang"
  msgfmt -o locale/${lang}/LC_MESSAGES/django.mo locale/${lang}/LC_MESSAGES/django.po
done

echo "Compilation terminée" 