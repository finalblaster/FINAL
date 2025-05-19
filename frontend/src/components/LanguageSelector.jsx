import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES, STORAGE_KEYS } from '@/utils/config';
import Flag from 'react-world-flags';
import axiosInstance from '../api/axiosConfig';
import i18next from 'i18next';  // Import i18next directement, pas notre instance

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

  // Fonction pour obtenir le code ISO du pays à partir du code de langue
  const getCountryCode = (langCode) => {
    const countryMap = {
      en: 'US',
      fr: 'FR',
      es: 'ES',
      de: 'DE'
    };
    return countryMap[langCode] || langCode.toUpperCase();
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
              className={clsx("h-5 w-8 rounded-sm overflow-hidden shadow-sm relative", !showText && "mr-0")}
              style={{ 
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            >
              <Flag code={getCountryCode(currentLang.code)} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-20" 
                style={{ height: '40%', top: 0 }}
              />
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
                className="text-sm font-medium"
              >
                {currentLang.name}
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
            "absolute z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            dropdownAlign === 'left' ? 'left-0' : 'right-0'
          )}
        >
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((language) => {
              const countryCode = getCountryCode(language.code);
              
              return (
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
                        <div className="h-4 w-7 rounded-sm overflow-hidden shadow-sm mr-3 relative">
                          <Flag code={countryCode} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-20" 
                            style={{ height: '40%', top: 0 }}
                          />
                        </div>
                        <span className="text-sm">{language.name}</span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSelector;