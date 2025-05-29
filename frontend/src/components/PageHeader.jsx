import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

/**
 * Composant PageHeader - En-tête élégant et simple pour les pages
 * 
 * @param {Object} props
 * @param {string} props.title - Titre principal ou clé de traduction
 * @param {string} props.subtitle - Texte secondaire ou clé de traduction (optionnel)
 * @param {React.ComponentType} props.icon - Icône Lucide pour l'en-tête
 * @param {React.ReactNode} props.action - Bouton d'action ou élément interactif (optionnel)
 * @param {React.ReactNode} props.additionalInfo - Information supplémentaire à afficher (optionnel)
 */
const PageHeader = ({ title, subtitle, icon: Icon, action, additionalInfo }) => {
  const { t } = useTranslation();
  
  const AddButton = () => (
    <button 
      onClick={action.props.onClick}
      className="group flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-200"
    >
      <Plus className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">Ajouter propriété</span>
    </button>
  );
  
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="mr-4 bg-blue-600 p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t(title)}</h1>
            <div className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-2">
              {subtitle && <span>{t(subtitle)}</span>}
              {additionalInfo && (
                <div className="text-slate-600">
                  {additionalInfo}
                </div>
              )}
            </div>
          </div>
        </div>

        {action && (
          <>
            {/* Version mobile */}
            <div className="sm:hidden">
              <AddButton />
            </div>

            {/* Version desktop */}
            <div className="hidden sm:block">
              <AddButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 