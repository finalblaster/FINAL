import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from './config';
import { getUserData, clearUserData } from '@/utils/auth';
import i18next from 'i18next';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_CONFIG.BACKEND_DOMAIN,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const user = safeParseUser();
    if (user && user.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse (ex: token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 401 (non autorisé) et que la requête n'a pas déjà été retentée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Logique pour rafraîchir le token (à implémenter selon l'API)
        const user = safeParseUser();
        if (user && user.refresh) {
          const refreshResponse = await axios.post(
            `${API_CONFIG.BACKEND_DOMAIN}/api/v1/auth/jwt/refresh/`,
            { refresh: user.refresh }
          );
          
          // Mise à jour du token dans le stockage local
          const updatedUser = { ...user, access: refreshResponse.data.access };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
          
          // Mise à jour du header Authorization pour la requête originale
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          
          // Retenter la requête originale avec le nouveau token
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // En cas d'échec de rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Configuration de l'API sécurisée avec intercepteurs
const secureApiInstance = axios.create({
  baseURL: API_CONFIG.BACKEND_DOMAIN,
  timeout: API_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout d'un intercepteur pour les requêtes
secureApiInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const userData = getUserData();
    const token = userData?.access;
    
    // Si un token existe, l'ajouter à l'en-tête d'autorisation
    if (token) {
      // Si l'en-tête d'autorisation est déjà défini dans config.headers, ne pas le remplacer
      if (!config.headers.Authorization) {
        config.headers.Authorization = `JWT ${token}`;
        console.log("Token ajouté automatiquement:", `JWT ${token}`);
      } else {
        console.log("En-tête d'autorisation déjà présent:", config.headers.Authorization);
      }
    } else {
      console.warn("Aucun token trouvé dans localStorage");
    }
    
    // Ajouter la langue courante à chaque requête si elle n'est pas déjà spécifiée
    if (!config.headers['Accept-Language'] && i18next) {
      const currentLanguage = i18next.language || 'fr';
      config.headers['Accept-Language'] = currentLanguage;
    }
    
    console.log("Configuration finale de la requête:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Erreur dans la configuration de la requête:', error);
    return Promise.reject(error);
  }
);

// Ajout d'un intercepteur pour les réponses
secureApiInstance.interceptors.response.use(
  (response) => {
    // Traitement de la réponse réussie
    return response;
  },
  async (error) => {
    // Gestion des erreurs de réponse
    const originalRequest = error.config;
    
    // Vérifier si l'erreur est due à un token expiré (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Tenter de rafraîchir le token
        const userData = getUserData();
        const refreshToken = userData?.refresh;
        
        if (!refreshToken) {
          // Si pas de refresh token, déconnecter l'utilisateur
          clearUserData();
          throw new Error('INVALID_CREDENTIALS');
        }
        
        // Appel à l'API pour obtenir un nouveau token
        const response = await axios.post(
          `${API_CONFIG.BACKEND_DOMAIN}/api/v1/auth/jwt/refresh/`,
          { refresh: refreshToken }
        );
        
        const newToken = response.data.access;
        
        if (newToken) {
          // Mettre à jour le token dans localStorage
          userData.access = newToken;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
          
          // Mettre à jour le header de la requête originale
          originalRequest.headers.Authorization = `JWT ${newToken}`;
          
          // Répéter la requête originale avec le nouveau token
          return secureApiInstance(originalRequest);
        } else {
          // Déconnecter l'utilisateur si le rafraîchissement échoue
          clearUserData();
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // En cas d'échec de rafraîchissement du token, déconnecter l'utilisateur
        clearUserData();
        console.error('Error refreshing token:', refreshError);
        
        // Remplacer l'erreur technique par un code d'erreur neutre
        const userError = new Error("INVALID_CREDENTIALS");
        return Promise.reject(userError);
      }
    }
    
    // Si ce n'est pas une erreur 401 ou si le rafraîchissement a échoué
    return Promise.reject(error);
  }
);

// Fonctions d'API sécurisées
export const secureApi = {
  get: (url, config = {}) => secureApiInstance.get(url, config),
  post: (url, data = {}, config = {}) => secureApiInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => secureApiInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => secureApiInstance.patch(url, data, config),
  delete: (url, config = {}) => secureApiInstance.delete(url, config),
};

export default secureApiInstance; 

// Fonction pour parser en toute sécurité la valeur de localStorage
function safeParseUser() {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    // Optionnel : nettoyer le localStorage si corrompu
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
} 