import React from 'react';
import { Building, Bot, MessageSquare, Star } from 'lucide-react';

/**
 * Composant StatisticsGrid - Grille de statistiques avec cartes modernes
 *
 * @param {Object} props
 * @param {Array} props.stats - Tableau de statistiques à afficher
 * @param {string} props.stats[].title - Titre de la statistique
 * @param {string} props.stats[].value - Valeur principale de la statistique
 * @param {string} props.stats[].description - Description ou tendance de la statistique
 * @param {React.ComponentType} props.stats[].icon - Icône Lucide à afficher
 * @param {string} props.stats[].color - Couleur de la carte (blue, indigo, emerald, purple, amber)
 * @param {number} props.columns - Nombre de colonnes (2-4, par défaut responsive)
 */
const StatisticsGrid = ({ stats, columns }) => {
  // Définir les classes de grille en fonction du nombre de colonnes
  const getGridClasses = () => {
    if (!columns) return 'grid-cols-2 lg:grid-cols-4';
    switch(columns) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-2 lg:grid-cols-4';
    }
  };
  
  // Configuration des couleurs par type
  const colorConfig = {
    blue: {
      gradientStart: 'from-blue-50',
      gradientEnd: 'to-white',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700'
    },
    indigo: {
      gradientStart: 'from-indigo-50',
      gradientEnd: 'to-white',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-700'
    },
    emerald: {
      gradientStart: 'from-emerald-50',
      gradientEnd: 'to-white',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700'
    },
    purple: {
      gradientStart: 'from-purple-50',
      gradientEnd: 'to-white',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-700'
    },
    amber: {
      gradientStart: 'from-amber-50',
      gradientEnd: 'to-white',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700'
    }
  };
  
  return (
    <div className={`grid ${getGridClasses()} gap-3 mb-6`}>
      {stats.map((stat, index) => {
        // Obtenir la configuration de couleur
        const colors = colorConfig[stat.color] || colorConfig.blue;
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`
              bg-gradient-to-br ${colors.gradientStart} ${colors.gradientEnd}
              rounded-lg
              shadow-sm
              border
              ${colors.borderColor}
              hover:shadow-md
              transition-all
              duration-200
              overflow-hidden
            `}
          >
            <div className="p-3 flex items-center gap-3">
              <div className={`
                p-2
                rounded-lg
                ${colors.iconBg}
                shadow-sm
                border
                ${colors.borderColor}
              `}>
                <Icon className={`h-6 w-6 ${colors.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-slate-600">{stat.title}</p>
                <p className={`mt-0.5 text-xl font-bold ${colors.valueColor}`}>{stat.value}</p>
                {stat.description && (
                  <p className="mt-0.5 text-[9px] text-slate-500">{stat.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsGrid; 