/**
 * Utilitaires pour l'assainissement des données
 */

/**
 * Nettoie les chaînes de caractères des potentielles injections HTML et JS
 * @param {string} str - Chaîne à nettoyer
 * @returns {string} - Chaîne nettoyée
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  
  // Échappe les caractères spéciaux HTML
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Nettoie un objet entier en assainissant toutes les valeurs de type chaîne
 * @param {Object} obj - Objet à nettoyer
 * @returns {Object} - Objet nettoyé
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Nettoie les données de formulaire avant soumission
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Données nettoyées
 */
export const sanitizeFormData = (formData) => {
  return sanitizeObject(formData);
};

/**
 * Nettoie les données d'URL pour éviter les attaques XSS
 * @param {string} url - URL à nettoyer
 * @returns {string} - URL sécurisée
 */
export const sanitizeUrl = (url) => {
  if (!url) return '';
  
  // Vérifie si l'URL commence par http:// ou https://
  if (!/^(?:f|ht)tps?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  
  // S'assure que l'URL est bien formée
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    // Si URL invalide, retourne une chaîne vide
    return '';
  }
};

/**
 * Nettoie et tronque le HTML pour l'affichage sécurisé
 * @param {string} html - HTML à nettoyer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - HTML nettoyé et tronqué
 */
export const sanitizeHtml = (html, maxLength = null) => {
  if (!html) return '';
  
  // Supprime les balises script
  let cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Supprime les événements inline
  cleanHtml = cleanHtml.replace(/ on\w+="[^"]*"/g, '');
  
  // Tronque si nécessaire
  if (maxLength && cleanHtml.length > maxLength) {
    cleanHtml = cleanHtml.substring(0, maxLength) + '...';
  }
  
  return cleanHtml;
}; 