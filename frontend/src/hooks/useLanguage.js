import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/utils/config';
import i18n from '@/translations';

/**
 * Hook personnalisé pour gérer la langue de l'application
 * @returns {Object} - Méthodes et propriétés pour gérer la langue
 */
const useLanguage = () => {
  // Récupérer la langue sauvegardée ou utiliser la langue par défaut
  const getSavedLanguage = () => {
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        return savedLanguage;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return DEFAULT_LANGUAGE;
  };

  const [currentLanguage, setCurrentLanguage] = useState(getSavedLanguage);

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
      // Synchroniser avec i18next
      i18n.changeLanguage(currentLanguage);
      // Optionnel: Ajouter un attribut lang à l'élément HTML pour l'accessibilité
      document.documentElement.lang = currentLanguage;
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [currentLanguage]);

  /**
   * Change la langue actuelle
   * @param {string} languageCode - Code de la langue (ex: 'en', 'fr')
   */
  const changeLanguage = useCallback((languageCode) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      setCurrentLanguage(languageCode);
      i18n.changeLanguage(languageCode);
    } else {
      console.error(`Language code "${languageCode}" is not supported`);
    }
  }, []);

  /**
   * Obtient les détails de la langue actuelle
   * @returns {Object} - Détails de la langue actuelle (code, name, flag)
   */
  const getCurrentLanguageDetails = useCallback(() => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || 
           SUPPORTED_LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE);
  }, [currentLanguage]);

  /**
   * Traduit une clé en fonction de la langue actuelle
   * @param {Object} translations - Objet avec les traductions pour chaque langue
   * @param {string} key - Clé à traduire
   * @param {Object} params - Paramètres pour la substitution dans la traduction
   * @returns {string} - Texte traduit
   */
  const t = useCallback((translations, key, params = {}) => {
    // Si translations n'est pas un objet valide, retourner la clé
    if (!translations || typeof translations !== 'object') {
      return key;
    }

    // Obtenir la traduction pour la langue actuelle ou la langue par défaut
    const translation = translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
    
    // Si la traduction n'existe pas, retourner la clé
    if (!translation || !translation[key]) {
      return key;
    }

    // Remplacer les paramètres dans la traduction
    let result = translation[key];
    
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        result = result.replace(`{{${param}}}`, params[param]);
      });
    }

    return result;
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguageDetails,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t,
  };
};

export default useLanguage; 