/**
 * Utilitaire de validation des formulaires et des données
 */

/**
 * Valide un email
 * @param {string} email - Adresse email à valider
 * @returns {boolean} - True si l'email est valide
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe (minimum 8 caractères, au moins 1 lettre, 1 chiffre et 1 caractère spécial)
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} - True si le mot de passe est valide
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Vérifie que la confirmation du mot de passe correspond
 * @param {string} password - Mot de passe
 * @param {string} confirmPassword - Confirmation du mot de passe
 * @returns {boolean} - True si les mots de passe correspondent
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valide un formulaire d'inscription
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Résultat de validation { isValid, errors }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = "Veuillez entrer une adresse email valide";
  }
  
  if (!formData.password || !isValidPassword(formData.password)) {
    errors.password = "Le mot de passe doit contenir au moins 8 caractères, incluant une lettre, un chiffre et un caractère spécial";
  }
  
  if (!passwordsMatch(formData.password, formData.re_password)) {
    errors.re_password = "Les mots de passe ne correspondent pas";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de connexion
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Résultat de validation { isValid, errors }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = "Veuillez entrer une adresse email valide";
  }
  
  if (!formData.password) {
    errors.password = "Veuillez entrer votre mot de passe";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de réinitialisation de mot de passe
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Résultat de validation { isValid, errors }
 */
export const validateResetPasswordForm = (formData) => {
  const errors = {};
  
  if (!formData.new_password || !isValidPassword(formData.new_password)) {
    errors.new_password = "Le mot de passe doit contenir au moins 8 caractères, incluant une lettre, un chiffre et un caractère spécial";
  }
  
  if (!passwordsMatch(formData.new_password, formData.re_new_password)) {
    errors.re_new_password = "Les mots de passe ne correspondent pas";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}; 