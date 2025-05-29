import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Composant PageHeader - En-tête élégant et simple pour les pages
 * 
 * @param {Object} props
 * @param {string} props.title - Titre principal ou clé de traduction
 * @param {string} props.subtitle - Texte secondaire ou clé de traduction (optionnel)
 * @param {React.ComponentType} props.icon - Icône Lucide pour l'en-tête
 * @param {React.ReactNode} props.action - Bouton d'action ou élément interactif (optionnel)
 */
const PageHeader = ({ title, subtitle, icon: Icon, action }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-4 bg-blue-600 p-2.5 rounded-lg shadow-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t(title)}</h1>
          {subtitle && <p className="text-sm text-slate-500">{t(subtitle)}</p>}
        </div>
      </div>
      
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader; 