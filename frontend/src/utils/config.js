// Configuration centralisée de l'application
export const API_CONFIG = {
  BACKEND_DOMAIN: import.meta.env.VITE_BACKEND_DOMAIN || "http://127.0.0.1:8000",
  API_TIMEOUT: 30000, // 30 secondes
};

// API Base URL
export const API_BASE_URL = 'http://localhost:8000';

// Endpoints de l'API
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/users/",
    LOGIN: "/api/v1/auth/jwt/create/",
    ACTIVATE: "/api/v1/auth/users/activation/",
    ACTIVATION_EMAIL: "/api/v1/auth/users/activation_email/",
    RESET_PASSWORD: "/api/v1/auth/users/reset_password/",
    RESET_PASSWORD_CONFIRM: "/api/v1/auth/users/reset_password_confirm/",
    USER_INFO: "/api/v1/auth/users/me/",
    RESEND_ACTIVATION: "/api/v1/auth/users/resend_activation/",
    CHANGE_PASSWORD: "/api/v1/auth/users/set_password/",
    SET_EMAIL: "/api/v1/auth/users/set_email/",
    ACTIVATE_EMAIL_CHANGE: "/api/v1/auth/activate_email_change/",
    CHECK_PENDING_EMAIL: "/api/v1/auth/users/check_pending_email/",
    PROFILE: "/api/v1/auth/users/profile/",
  }
};

// Configuration du stockage local
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  LANGUAGE: 'selected_language',
};

// Configuration des langues supportées
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
];

// Langue par défaut
export const DEFAULT_LANGUAGE = 'en';

// Configuration des toasts
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  POSITION: "top-right",
  THEME: {
    SUCCESS: {
      className: 'border-l-4 border-green-500 bg-green-50',
    },
    ERROR: {
      className: 'border-l-4 border-red-500 bg-red-50',
    },
    INFO: {
      className: 'border-l-4 border-blue-500 bg-blue-50',
    },
    WARNING: {
      className: 'border-l-4 border-yellow-500 bg-yellow-50',
    }
  }
}; 