import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Composant ReportsHeader - En-tête pour les pages de rapports et tableaux de bord
 * 
 * @param {Object} props
 * @param {string} props.title - Titre principal
 * @param {string} props.subtitle - Texte secondaire (souvent un compteur d'éléments)
 * @param {React.ComponentType} props.icon - Icône Lucide pour l'en-tête
 * @param {string} props.timeFilter - Filtre temporel sélectionné (optionnel)
 * @param {React.ReactNode} props.additionalInfo - Information supplémentaire à afficher
 * @param {React.ReactNode} props.actionButton - Bouton d'action personnalisé
 */
const ReportsHeader = ({
  title,
  subtitle,
  icon: Icon,
  timeFilter,
  additionalInfo,
  actionButton
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center">
        <div className="mr-4 bg-blue-600 p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <div className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-2">
            <span>{subtitle}</span>
            {timeFilter && (
              <div className="flex items-center text-blue-600 font-medium">
                <Calendar className="h-4 w-4 mr-1" />
                {timeFilter}
              </div>
            )}
            {additionalInfo && (
              <div className="text-slate-600">
                {additionalInfo}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {actionButton && (
        <div className="w-full sm:w-auto">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default ReportsHeader; 