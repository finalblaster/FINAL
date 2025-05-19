import React, { createContext, useContext } from 'react';
import useLanguage from '@/hooks/useLanguage';

// Création du contexte
const LanguageContext = createContext(null);

/**
 * Provider pour le contexte de langue
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 */
export const LanguageProvider = ({ children }) => {
  const languageUtils = useLanguage();
  
  return (
    <LanguageContext.Provider value={languageUtils}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de langue
 * @returns {Object} - Utilitaires de langue (currentLanguage, changeLanguage, t, etc.)
 */
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  
  if (context === null) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  
  return context;
};

export default LanguageContext; 