import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';
import { resources } from './resources';

// Configuration de i18next
i18n
  // Détection automatique de la langue du navigateur
  .use(LanguageDetector)
  // Initialisation du module react-i18next
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    // Ressources de traduction
    resources,
    // Langue par défaut
    fallbackLng: DEFAULT_LANGUAGE,
    // Langue à utiliser si la détection automatique échoue
    lng: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE,
    // Permet d'utiliser des clés de traduction imbriquées
    keySeparator: '.',
    // Liste des langues supportées
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    // Options d'interpolation
    interpolation: {
      // Échapper les valeurs par défaut pour éviter les attaques XSS
      escapeValue: true,
      // Définir des variables par défaut pour l'interpolation
      defaultVariables: {
        siteName: 'Sputnik',
      },
    },
    // Options de détection
    detection: {
      // Ordre des méthodes de détection
      order: ['localStorage', 'navigator'],
      // Nom de la clé dans localStorage (utiliser la même que dans config)
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      // Cacher la langue dans localStorage
      caches: ['localStorage'],
    },
    // Activer le debug en développement
    debug: process.env.NODE_ENV === 'development',
  });

// Exporter l'instance i18n
export default i18n;
