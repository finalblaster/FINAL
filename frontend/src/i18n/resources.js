import { commonTranslations } from '@/translations/common';

// Conversion du format de nos traductions au format i18n
export const resources = {
  en: {
    translation: {
      ...commonTranslations.en,
    }
  },
  fr: {
    translation: {
      ...commonTranslations.fr,
    }
  },
  es: {
    translation: {
      ...commonTranslations.es,
    }
  },
  de: {
    translation: {
      ...commonTranslations.de,
    }
  }
}; 