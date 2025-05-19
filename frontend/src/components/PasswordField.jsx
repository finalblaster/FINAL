import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * Composant de champ de mot de passe avec indicateur de force et visibilité
 */
const PasswordField = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete = 'new-password',
  showStrengthMeter = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Calcule la force du mot de passe
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Longueur minimale
    if (password.length >= 8) strength += 25;
    
    // Présence de lettres minuscules
    if (/[a-z]/.test(password)) strength += 25;
    
    // Présence de lettres majuscules
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Présence de chiffres
    if (/\d/.test(password)) strength += 12.5;
    
    // Présence de caractères spéciaux
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    
    return Math.min(strength, 100);
  };

  const strength = calculatePasswordStrength(value);
  
  // Détermine la couleur de l'indicateur de force
  const getStrengthColor = () => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Détermine le label de force du mot de passe
  const getStrengthLabel = () => {
    if (strength < 25) return 'Très faible';
    if (strength < 50) return 'Faible';
    if (strength < 75) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      
      {showStrengthMeter && value && (
        <div className="mt-2">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStrengthColor()} transition-all duration-300`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 flex justify-between">
            <span>Force: {getStrengthLabel()}</span>
            <span>{Math.round(strength)}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

PasswordField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  autoComplete: PropTypes.string,
  showStrengthMeter: PropTypes.bool,
};

export default PasswordField;
