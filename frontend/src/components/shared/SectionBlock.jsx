import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Composant SectionBlock - Bloc de section avec icône, titre et contenu extensible intégré
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Icône Lucide à afficher
 * @param {string} props.title - Titre principal du bloc
 * @param {string} props.subtitle - Texte secondaire (optionnel)
 * @param {string} props.theme - Thème de couleur (blue, indigo, purple, amber, green)
 * @param {React.ReactNode} props.rightContent - Contenu personnalisé à droite (optionnel)
 * @param {boolean} props.expandable - Indique si le bloc est extensible
 * @param {React.ReactNode} props.children - Contenu à afficher lorsque étendu
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.iconColorOverride - Couleur d'icône personnalisée qui remplace celle du thème
 */
const SectionBlock = ({
  icon: Icon,
  title,
  subtitle,
  theme = "blue",
  rightContent,
  expandable = false,
  children,
  className = "",
  iconColorOverride = null
}) => {
  // État pour suivre si le contenu est développé
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("0px");

  // Mise à jour de la hauteur lors de l'expansion
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded, children]);

  // Configuration des thèmes
  const themes = {
    blue: {
      gradient: "from-blue-50 to-white",
      contentBg: "bg-blue-50/30",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverBg: "hover:bg-blue-50/50"
    },
    indigo: {
      gradient: "from-indigo-50 to-white",
      contentBg: "bg-indigo-50/30",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverBg: "hover:bg-indigo-50/50"
    },
    purple: {
      gradient: "from-purple-50 to-white",
      contentBg: "bg-purple-50/30",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBg: "hover:bg-purple-50/50"
    },
    amber: {
      gradient: "from-amber-50 to-white",
      contentBg: "bg-amber-50/30",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBg: "hover:bg-amber-50/50"
    },
    green: {
      gradient: "from-emerald-50 to-white",
      contentBg: "bg-emerald-50/30",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      hoverBg: "hover:bg-emerald-50/50"
    },
    red: {
      gradient: "from-red-50 to-white",
      contentBg: "bg-red-50/30",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      hoverBg: "hover:bg-red-50/50"
    }
  };
  
  const themeStyle = themes[theme] || themes.blue;
  
  const toggleExpanded = () => {
    if (expandable) {
      setExpanded(!expanded);
    }
  };
  
  return (
    <div
      className={`
        bg-white
        rounded-xl
        shadow-md
        border
        ${themeStyle.borderColor}
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-lg
        ${className}
      `}
    >
      {/* En-tête du bloc */}
      <div
        className={`
          bg-gradient-to-r
          ${themeStyle.gradient}
          p-5
          flex
          justify-between
          items-center
          ${expandable ? `cursor-pointer ${themeStyle.hoverBg}` : ''}
          ${expanded ? '' : 'border-b border-slate-100'}
        `}
        onClick={expandable ? toggleExpanded : undefined}
      >
        <div className="flex items-center">
          {Icon && (
            <div className={`p-2.5 rounded-lg ${themeStyle.iconBg} mr-3 shadow-sm border ${themeStyle.borderColor}`}>
              <Icon className={`h-5 w-5 ${iconColorOverride || themeStyle.iconColor}`} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
          </div>
        </div>
        
        {rightContent ? (
          <div className="flex items-center">
            <div>{rightContent}</div>
            {expandable && (
              <div className="ml-3 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                {expanded ? (
                  <ChevronUp className={`h-4 w-4 ${themeStyle.iconColor}`} />
                ) : (
                  <ChevronDown className={`h-4 w-4 ${themeStyle.iconColor}`} />
                )}
              </div>
            )}
          </div>
        ) : expandable ? (
          <div className={`${themeStyle.iconColor} hover:bg-slate-100 p-2 rounded-lg transition-colors`}>
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        ) : null}
      </div>
      
      {/* Contenu extensible intégré */}
      {expandable && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: contentHeight }}
        >
          <div
            className={`${themeStyle.contentBg} px-5 py-4 border-t border-slate-100 transition-all`}
            ref={contentRef}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionBlock; 