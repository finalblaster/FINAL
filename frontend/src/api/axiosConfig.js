import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

// Intercepteur pour ajouter la langue à chaque requête
axiosInstance.interceptors.request.use(config => {
  // Récupérer la langue depuis le localStorage ou un state global
  const currentLanguage = localStorage.getItem('language') || 'fr';
  
  // Ajouter l'en-tête Accept-Language
  config.headers['Accept-Language'] = currentLanguage;
  
  return config;
});

export default axiosInstance; 