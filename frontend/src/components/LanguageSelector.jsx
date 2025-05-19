import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES, STORAGE_KEYS } from '@/utils/config';
import axiosInstance from '../api/axiosConfig';
import i18next from 'i18next';

/**
 * Fonction pour changer la langue de l'application
 * @param {string} lang - Code de la langue
 * @returns {Promise} - Promise résolue quand la langue est changée
 */
export const changeAppLanguage = (lang) => {
  return new Promise((resolve, reject) => {
    // Utiliser i18next.language pour accéder à la langue courante de l'instance i18n globale
    if (lang === i18next.language) {
      resolve(); // Rien à faire si c'est déjà la langue actuelle
      return;
    }
    
    console.log('%c=== CHANGEMENT DE LANGUE ===', 'background: #4CAF50; color: white; padding: 5px; border-radius: 3px;');
    console.log('Ancienne langue:', i18next.language);
    console.log('Nouvelle langue:', lang);
    
    i18next.changeLanguage(lang).then(() => {
      console.log('Langue changée avec succès');
      console.log('Nouvelle langue i18n:', i18next.language);
      
      // Sauvegarder la langue dans le localStorage
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      
      // Mettre à jour la langue dans les en-têtes d'API
      axiosInstance.defaults.headers['Accept-Language'] = lang;
      
      console.log('%c================================', 'background: #4CAF50; color: white; padding: 5px; border-radius: 3px;');
      resolve();
    }).catch(error => {
      console.error('Erreur lors du changement de langue:', error);
      reject(error);
    });
  });
};

/**
 * Sélecteur de langue pour l'application
 * @param {Object} props - Propriétés du composant
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.showText - Afficher le nom de la langue en plus du drapeau
 * @param {string} props.dropdownAlign - Alignement du menu déroulant ('left' ou 'right')
 * @returns {JSX.Element} - Composant de sélection de langue
 */
const LanguageSelector = ({ className = '', showText = true, dropdownAlign = 'right' }) => {
  const { i18n } = useTranslation();
  
  // Obtenir la langue actuelle
  const currentLanguage = i18n.language;
  
  // Obtenir les détails de la langue actuelle
  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || 
                      SUPPORTED_LANGUAGES.find(lang => lang.code === 'en');

  // Fonction pour formater le code de langue
  const formatLangCode = (code) => {
    return code.toUpperCase();
  };

  return (
    <Menu as="div" className={clsx("relative inline-block text-left", className)}>
      <div>
        <Menu.Button className="inline-flex items-center justify-center gap-x-2 py-2 hover:opacity-75 transition-opacity focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLang.code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx("h-5 w-5 text-gray-600", !showText && "mr-0")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </motion.div>
          </AnimatePresence>
          
          {showText && (
            <AnimatePresence mode="wait">
              <motion.span
                key={currentLang.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium tracking-wider"
              >
                {formatLangCode(currentLang.code)}
              </motion.span>
            </AnimatePresence>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={clsx(
            "absolute z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            dropdownAlign === 'left' ? 'left-0' : 'right-0'
          )}
        >
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    type="button"
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                      currentLanguage === language.code && 'font-medium bg-blue-50'
                    )}
                    onClick={() => changeAppLanguage(language.code)}
                  >
                    <div className="flex items-center">
                      <div className="h-5 w-5 text-gray-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium tracking-wider">{formatLangCode(language.code)}</span>
                    </div>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSelector;