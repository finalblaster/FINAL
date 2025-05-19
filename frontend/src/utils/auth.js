import { STORAGE_KEYS } from './config';
import * as jwtDecode from 'jwt-decode';

/**
 * Stocke les informations utilisateur et les tokens de manière sécurisée
 * @param {Object} userData - Données utilisateur contenant access et refresh tokens
 */
export const setUserData = (userData) => {
  if (!userData) return;
  
  // Sanitize data before storing
  const sanitizedUserData = {
    access: userData.access,
    refresh: userData.refresh,
  };
  
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sanitizedUserData));
};

/**
 * Récupère les informations utilisateur du stockage local
 * @returns {Object|null} - Les données utilisateur ou null si non connecté
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    clearUserData();
    return null;
  }
};

/**
 * Supprime les informations utilisateur du stockage local
 */
export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Vérifie si un utilisateur est connecté
 * @returns {boolean} - True si l'utilisateur est connecté
 */
export const isAuthenticated = () => {
  const userData = getUserData();
  if (!userData || !userData.access) return false;
  
  try {
    const decoded = jwtDecode.jwtDecode(userData.access);
    const currentTime = Date.now() / 1000;
    
    // Vérifie si le token n'est pas expiré
    return decoded.exp > currentTime;
  } catch (error) {
    clearUserData();
    return false;
  }
};

/**
 * Décode le token JWT pour extraire les informations utilisateur
 * @returns {Object|null} - Les données décodées du token ou null
 */
export const getDecodedToken = () => {
  try {
    const userData = getUserData();
    if (!userData || !userData.access) return null;
    
    return jwtDecode.jwtDecode(userData.access);
  } catch (error) {
    return null;
  }
};

/**
 * Obtient l'ID utilisateur à partir du token décodé
 * @returns {string|null} - L'ID utilisateur ou null
 */
export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded ? decoded.user_id : null;
}; 

// Fonction pour parser en toute sécurité la valeur de localStorage
function safeParseUser() {
  const userStr = localStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    // Optionnel : nettoyer le localStorage si corrompu
    localStorage.removeItem("user");
    return null;
  }
}

// Remplacer l'appel à JSON.parse
const userData = safeParseUser(); 