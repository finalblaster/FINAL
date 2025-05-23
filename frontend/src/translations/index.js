import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions par module
import { commonTranslations, commonMessages } from './common';
import { dashboardTranslations } from './modules/dashboard';
import { documentsTranslations } from './modules/documents';
import { settingsTranslations } from './modules/settings';
import { assistantTranslations } from './modules/assistant';
import { propertiesTranslations } from './modules/properties';
import { communicationsTranslations } from './modules/communications';
import { sidebarTranslations } from './modules/sidebar';
import { reportsTranslations } from './modules/reports';
import { authTranslations } from './modules/auth';
import { STORAGE_KEYS } from '@/utils/config';

// Fonction pour fusionner les ressources
const mergeTranslations = () => {
  const resources = {
    fr: { translation: {} },
    en: { translation: {} },
    es: { translation: {} },
    de: { translation: {} }
  };

  // Liste des fichiers de traduction à fusionner
  const translationModules = [
    commonTranslations,
    commonMessages,
    dashboardTranslations,
    documentsTranslations,
    settingsTranslations,
    assistantTranslations,
    propertiesTranslations,
    communicationsTranslations,
    sidebarTranslations,
    reportsTranslations,
    authTranslations
  ];

  // Fusion des traductions pour chaque langue
  translationModules.forEach(module => {
    ['fr', 'en', 'es', 'de'].forEach(lang => {
      if (module[lang]) {
        resources[lang].translation = {
          ...resources[lang].translation,
          ...module[lang]
        };
      }
    });
  });

  return resources;
};

// Initialisation de i18n
i18n
  .use(LanguageDetector) // Détection automatique de la langue
  .use(initReactI18next)
  .init({
    resources: mergeTranslations(),
    fallbackLng: 'fr',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement
      defaultVariables: {
        siteName: 'Zoopok', // Définir la variable siteName disponible pour toutes les traductions
      },
    }
  });

// Export de l'instance i18n
export default i18n;

// Pour éviter les dépendances circulaires, nous ne pouvons pas importer depuis LanguageSelector
// directement. À la place, définissons une fonction changeLanguage qui importera dynamiquement
// la fonction changeAppLanguage
export const changeLanguage = (lang) => {
  return import('@/components/LanguageSelector').then(module => {
    return module.changeAppLanguage(lang);
  });
};

// Hook personnalisé pour obtenir les traductions (pour les composants React)
export const useTranslations = () => {
  return {
    t: i18n.t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage
  };
};
