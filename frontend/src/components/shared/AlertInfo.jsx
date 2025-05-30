import React, { useState } from 'react';
import { InfoIcon, HelpCircle, AlertCircle, CheckCircle, BellRing, X } from 'lucide-react';

/**
 * Composant AlertInfo - Version améliorée avec indication subtile
 */
const AlertInfo = ({
  icon: Icon = InfoIcon,
  title,
  message,
  variant = 'info',
  dismissable = false,
  onDismiss = () => {},
  animated = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Configuration des variantes par niveau d'importance plutôt que par couleur
  const variantConfig = {
    info: {
      icon: InfoIcon,
      iconColor: 'text-blue-500',
      dotColor: 'bg-blue-500'
    },
    help: {
      icon: HelpCircle,
      iconColor: 'text-indigo-500',
      dotColor: 'bg-indigo-500'
    },
    warning: {
      icon: BellRing,
      iconColor: 'text-amber-500',
      dotColor: 'bg-amber-500'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      dotColor: 'bg-emerald-500'
    },
    alert: {
      icon: AlertCircle,
      iconColor: 'text-red-500', 
      dotColor: 'bg-red-500'
    }
  };
  
  // Utiliser la configuration ou celle par défaut
  const config = variantConfig[variant] || variantConfig.info;
  
  // Si une icône personnalisée est fournie, utiliser sa couleur de variante
  const IconComponent = Icon || config.icon;
  
  return (
    <div
      className={`
        p-4 
        rounded-lg
        bg-slate-50/90
        border border-slate-200
        transition-all duration-300
        ${isHovered ? 'bg-slate-100/90' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="relative mr-3 flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          
          {/* Point d'indication animé */}
          {animated && (
            <span className={`
              absolute -top-0.5 -right-0.5
              h-2 w-2
              rounded-full
              ${config.dotColor}
              animate-pulse
            `}></span>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          {title && (
            <div className="flex items-center">
              <h4 className="text-sm font-semibold text-slate-800 mr-2">
                {title}
              </h4>
              
              {/* Ligne horizontale subtile pour indiquer l'importance */}
              <div className={`h-0.5 flex-grow rounded-full bg-gradient-to-r from-${variant === 'alert' ? 'red' : 'slate'}-200 to-transparent opacity-60`}></div>
            </div>
          )}
          
          <p className="text-sm text-slate-700 mt-1">
            {message}
          </p>
        </div>
        
        {dismissable && (
          <button
            onClick={onDismiss}
            className="ml-3 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertInfo; 