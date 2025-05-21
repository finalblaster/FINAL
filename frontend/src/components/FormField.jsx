import React from 'react';
import { motion } from 'framer-motion';
import { TextField } from '@/components/Fields';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Composant de champ de formulaire réutilisable avec gestion d'erreurs
 * @param {string} label - Libellé du champ
 * @param {string} type - Type de champ (text, email, password, etc.)
 * @param {string} name - Nom du champ
 * @param {string} value - Valeur du champ
 * @param {function} onChange - Gestionnaire de changement
 * @param {string} error - Message d'erreur
 * @param {boolean} disabled - Si le champ est désactivé
 * @param {string} placeholder - Placeholder du champ
 * @param {boolean} required - Si le champ est requis
 * @param {string} helpText - Texte d'aide sous le champ
 * @param {boolean} showPasswordToggle - Afficher le toggle de mot de passe
 * @param {boolean} showPassword - État de visibilité du mot de passe
 * @param {function} onTogglePassword - Gestionnaire du toggle de mot de passe
 * @param {string} className - Classes CSS additionnelles
 */
const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
  required = false,
  helpText,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  className = '',
  readOnly = false,
  ...props
}) => {
  // Déterminer si le champ est en erreur
  const hasError = !!error;

  // Classes de base pour l'input
  const inputClasses = `
    w-full 
    border 
    ${hasError ? 'border-red-500' : 'border-gray-300'} 
    rounded-lg 
    px-3 
    py-2 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500
    ${disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}
    ${readOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}
    ${showPasswordToggle ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 pl-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="h-4">
        {hasError && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
              {error}
            </span>
          </motion.div>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField; 