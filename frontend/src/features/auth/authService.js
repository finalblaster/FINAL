import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from '@/utils/config';
import { secureApi } from '@/utils/api';
import { setUserData, clearUserData, getUserData } from '@/utils/auth';

/**
 * Service d'authentification avec des fonctions sécurisées
 */
class AuthService {
  /**
   * Enregistre un nouvel utilisateur
   * @param {Object} userData - Données d'enregistrement utilisateur
   * @returns {Promise} - Réponse API
   */
  async register(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.REGISTER, userData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Connecte un utilisateur
   * @param {Object} userData - Identifiants de connexion
   * @returns {Promise} - Réponse API incluant les tokens
   */
  async login(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.LOGIN, userData, { headers });
      
      if (response.data) {
        setUserData(response.data);
      }
      
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    clearUserData();
  }

  /**
   * Active un compte utilisateur
   * @param {Object} userData - Données d'activation (uid, token)
   * @returns {Promise} - Réponse API
   */
  async activate(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.ACTIVATE, userData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Active une nouvelle adresse email
   * @param {Object} userData - Données d'activation (uid, token)
   * @returns {Promise} - Réponse API
   */
  async activateEmail(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage ou utiliser celle fournie
      const currentLanguage = userData.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      // Créer un objet de données ne contenant que ce dont nous avons besoin
      const activationData = {
        uid: userData.uid,
        token: userData.token
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.ACTIVATION_EMAIL, activationData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param {Object} userData - Email utilisateur
   * @returns {Promise} - Réponse API
   */
  async resetPassword(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, userData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Confirme la réinitialisation de mot de passe
   * @param {Object} userData - Données de confirmation (uid, token, password)
   * @returns {Promise} - Réponse API
   */
  async resetPasswordConfirm(userData) {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM, userData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Obtient les informations utilisateur
   * @returns {Promise} - Réponse API avec les données utilisateur
   */
  async getUserInfo() {
    try {
      // Déterminer la langue actuelle depuis le localStorage
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      // Ajouter l'en-tête Accept-Language avec la langue actuelle
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.get(API_ENDPOINTS.AUTH.USER_INFO, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Renvoie l'email de vérification
   * @param {Object|string} emailData - Email utilisateur ou objet {email, language}
   * @returns {Promise} - Réponse API
   */
  async resendVerification(emailData) {
    try {
      let requestData;

      // Vérifier si emailData est une chaîne ou un objet
      if (typeof emailData === 'string') {
        requestData = { email: emailData };
      } else {
        // emailData est un objet contenant email et potentiellement language
        requestData = { ...emailData };
      }

      console.log('Renvoi de vérification avec données:', requestData);

      // Définir l'en-tête Accept-Language si une langue est spécifiée
      const headers = {};
      if (requestData.language) {
        headers['Accept-Language'] = requestData.language;
      }

      const response = await secureApi.post(
        API_ENDPOINTS.AUTH.RESEND_ACTIVATION, 
        requestData,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Change le mot de passe utilisateur
   * @param {Object} passwordData - Données de changement de mot de passe (current_password, new_password)
   * @param {string} token - Token d'accès
   * @returns {Promise} - Réponse API
   */
  async changePassword(passwordData, token) {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      const headers = {
        'Authorization': `JWT ${token}`,
        'Accept-Language': currentLanguage
      };
      
      // Ajouter la langue actuelle aux données envoyées au serveur
      const dataWithLanguage = {
        ...passwordData,
        language: currentLanguage
      };
      
      console.log("Envoi des données de changement de mot de passe:", JSON.stringify(dataWithLanguage));
      
      const response = await secureApi.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, dataWithLanguage, { headers });
      return response.data;
    } catch (error) {
      // Afficher les détails exacts de l'erreur
      console.error("### DÉTAILS ERREUR BRUTE ###");
      console.error("Status:", error.response?.status);
      console.error("Message d'erreur:", error.message);
      
      // Afficher le corps de réponse de façon plus lisible
      if (error.response?.data) {
        console.error("Response body:");
        if (typeof error.response.data === 'object') {
          // Afficher chaque champ d'erreur séparément pour plus de clarté
          Object.keys(error.response.data).forEach(key => {
            console.error(`  ${key}:`, error.response.data[key]);
          });
        } else {
          console.error("  ", error.response.data);
        }
      }
      
      console.error("Headers:", JSON.stringify(error.response?.headers, null, 2));
      console.error("### FIN DÉTAILS ERREUR ###");
      
      // Pas de connexion internet
      if (!navigator.onLine || error.message === 'Network Error') {
        throw new Error("NETWORK_ERROR");
      }
      
      // Approche simplifiée pour détecter les erreurs de mot de passe
      // Si l'erreur est un 400 Bad Request et concerne current_password, on suppose que c'est un mot de passe incorrect
      if (error.response && error.response.status === 400 && error.response.data) {
        const data = error.response.data;
        
        // Vérifier si l'erreur concerne le champ current_password
        if (data.current_password) {
          console.log("Erreur sur current_password détectée:", data.current_password);
          throw new Error("CURRENT_PASSWORD_INCORRECT");
        }
        
        // Fonction d'aide pour vérifier si un message contient un texte donné (insensible à la casse)
        const containsText = (message, ...searchTerms) => {
          if (!message) return false;
          
          // Si c'est un tableau, vérifier chaque élément
          if (Array.isArray(message)) {
            return message.some(msg => {
              if (typeof msg !== 'string') return false;
              const lowerMsg = msg.toLowerCase();
              return searchTerms.some(term => lowerMsg.includes(term.toLowerCase()));
            });
          }
          
          // Si c'est une chaîne, vérifier directement
          if (typeof message === 'string') {
            const lowerMsg = message.toLowerCase();
            return searchTerms.some(term => lowerMsg.includes(term.toLowerCase()));
          }
          
          return false;
        };
        
        // Vérifier spécifiquement pour les erreurs de mot de passe incorrects dans différentes langues
        if (data.current_password && Array.isArray(data.current_password)) {
          // Termes de recherche pour "mot de passe incorrect" dans différentes langues
          const invalidPasswordTerms = [
            // Français
            "mot de passe invalide", "mot de passe incorrect", "mauvais mot de passe",
            // Anglais
            "invalid password", "incorrect password", "wrong password", 
            // Espagnol
            "contraseña inválida", "contraseña incorrecta", "contraseña no válida", 
            // Allemand
            "ungültiges passwort", "falsches passwort", "passwort falsch"
          ];
          
          // Pour toute chaîne dans current_password, vérifier si elle contient l'un des termes
          for (const msg of data.current_password) {
            if (typeof msg === 'string') {
              for (const term of invalidPasswordTerms) {
                if (msg.toLowerCase().includes(term.toLowerCase())) {
                  console.log(`Détecté terme "${term}" dans message "${msg}"`);
                  throw new Error("CURRENT_PASSWORD_INCORRECT");
                }
              }
            }
          }
          
          // Si on arrive ici mais qu'il y a toujours une erreur sur current_password,
          // on peut supposer que c'est un problème de mot de passe (indépendamment de la langue)
          throw new Error("CURRENT_PASSWORD_INCORRECT");
        }
        
        // Vérifier également dans non_field_errors et les erreurs génériques
        if (data.non_field_errors) {
          if (containsText(data.non_field_errors, 
              "mot de passe", "password", "contraseña", "passwort", 
              "invalide", "incorrect", "invalid", "incorrecta", "falsch")) {
            console.log("Détecté: mot de passe actuel incorrect (erreur générique)");
            throw new Error("CURRENT_PASSWORD_INCORRECT");
          }
        }
        
        // Vérifier dans detail ou autres champs génériques
        if (data.detail && containsText(data.detail, 
            "mot de passe", "password", "contraseña", "passwort", 
            "invalide", "incorrect", "invalid", "incorrecta", "falsch")) {
          console.log("Détecté: mot de passe actuel incorrect (dans detail)");
          throw new Error("CURRENT_PASSWORD_INCORRECT");
        }
        
        // Autres erreurs spécifiques aux champs
        if (data.new_password) {
          if (containsText(data.new_password, "court", "short", "kurz", "corta")) {
            throw new Error("PASSWORD_TOO_SHORT");
          } else if (containsText(data.new_password, "complexité", "complexity", "komplex", "complejidad")) {
            throw new Error("PASSWORD_INVALID");
          }
        }
        
        if (data.non_field_errors && containsText(data.non_field_errors, 
            "correspond", "match", "coinciden", "übereinstimmen")) {
          throw new Error("PASSWORDS_DO_NOT_MATCH");
        }
        
        // Erreurs basées sur le code HTTP
        throw new Error("VALIDATION_ERROR");
      }
      
      // Autres codes d'erreur HTTP
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 401:
            throw new Error("INVALID_CREDENTIALS");
          case 403:
            throw new Error("UNAUTHORIZED");
          case 500:
            throw new Error("SERVER_ERROR");
        }
      }
      
      // Erreur par défaut avec le message brut si disponible
      const rawMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`UNKNOWN_ERROR: ${rawMessage}`);
    }
  }

  /**
   * Obtient le profil utilisateur (Djoser standard)
   * @returns {Promise} - Réponse API avec les données de profil
   */
  async getProfile() {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      const headers = {
        'Accept-Language': currentLanguage
      };
      // Utilise l'endpoint Djoser standard
      const response = await secureApi.get('/api/v1/auth/users/me/', { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Met à jour le profil utilisateur
   * @param {Object} profileData - Données du profil à mettre à jour
   * @returns {Promise} - Réponse API avec les données de profil mises à jour
   */
  async updateProfile(profileData) {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      if (!profileData.first_name || !profileData.last_name) {
        throw new Error('VALIDATION_ERROR');
      }
      const cleanedData = {
        first_name: profileData.first_name.trim(),
        last_name: profileData.last_name.trim(),
        phone: profileData.phone ? profileData.phone.trim() : '',
        language: currentLanguage
      };
      console.log('[updateProfile] Payload envoyé :', cleanedData);
      const headers = {
        'Accept-Language': currentLanguage
      };
      const response = await secureApi.put('/api/v1/auth/users/me/', cleanedData, { headers });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Télécharge une image de profil et met à jour les infos du profil
   * @param {Object} data - { imageFile, first_name, last_name, phone }
   * @returns {Promise} - Réponse API avec les données de profil mises à jour
   */
  async uploadProfileImage({ imageFile, first_name, last_name, phone }) {
    try {
      console.log('[uploadProfileImage] imageFile:', imageFile, 'type:', typeof imageFile, 'instanceof File:', imageFile instanceof File);
      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('INVALID_FILE');
      }
      if (!first_name || !last_name) {
        throw new Error('VALIDATION_ERROR');
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        throw new Error('FILE_TOO_LARGE');
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('INVALID_FILE_TYPE');
      }
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('phone', phone || '');
      formData.append('language', currentLanguage);
      console.log('[uploadProfileImage] FormData envoyé :', {
        first_name,
        last_name,
        phone: phone || '',
        imageFile,
        language: currentLanguage
      });
      const headers = {
        'Accept-Language': currentLanguage,
        'Content-Type': 'multipart/form-data'
      };
      const response = await secureApi.put('/api/v1/auth/users/me/', formData, {
        headers,
        transformRequest: (data) => data
      });
      return response.data;
    } catch (error) {
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Supprime l'image de profil actuelle
   * @param {Object} data - { first_name, last_name, phone }
   * @returns {Promise} - Réponse API avec les données de profil mises à jour
   */
  async removeProfileImage(data) {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      // Merge les champs du payload avec profile_image: null
      const requestData = {
        ...data,
        profile_image: null,
        language: currentLanguage
      };
      const headers = {
        'Accept-Language': currentLanguage,
        'Content-Type': 'application/json'
      };
      const response = await secureApi.patch('/api/v1/auth/users/me/', requestData, { headers });
      return response.data;
    } catch (error) {
      // Log détaillé de l'erreur
      console.error('removeProfileImage - error:', error);
      if (error && error.response) {
        console.error('removeProfileImage - error.response:', error.response);
        if (error.response.data) {
          console.error('removeProfileImage - error.response.data:', error.response.data);
        }
      }
      const message = this._handleError(error);
      throw new Error(message);
    }
  }

  /**
   * Change l'adresse email de l'utilisateur (le USERNAME_FIELD)
   * Cette opération initie une demande de changement qui nécessite une confirmation
   * via un email envoyé à la nouvelle adresse
   * @param {Object} emailData - Données de changement d'email (new_email, re_new_email, current_password)
   * @param {string} token - Token d'accès
   * @returns {Promise} - Réponse API
   */
  async changeEmail(emailData, token) {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      const headers = {
        'Authorization': `JWT ${token}`,
        'Accept-Language': currentLanguage
      };
      
      // Ajouter la langue actuelle aux données envoyées au serveur
      const dataWithLanguage = {
        ...emailData,
        language: currentLanguage
      };
      
      console.log("Initiation du processus de changement d'email:", JSON.stringify({
        ...dataWithLanguage,
        current_password: '[MASQUÉ]'
      }));
      
      // Vérifier que les champs requis sont présents
      if (!emailData.new_email || !emailData.re_new_email || !emailData.current_password) {
        console.error("Données manquantes:", {
          ...emailData,
          current_password: emailData.current_password ? '[PRÉSENT]' : '[MANQUANT]'
        });
        throw new Error("VALIDATION_ERROR");
      }
      
      // Cette requête n'effectue pas immédiatement le changement d'email
      // Elle envoie un email de confirmation à la nouvelle adresse
      const response = await secureApi.post(API_ENDPOINTS.AUTH.SET_EMAIL, dataWithLanguage, { headers });
      
      console.log("Réponse de la demande de changement d'email:", response.data);
      
      return {
        ...response.data,
        status: 'EMAIL_VERIFICATION_SENT',
        pendingEmail: emailData.new_email
      };
    } catch (error) {
      // Afficher les détails de l'erreur
      console.error("### DÉTAILS ERREUR CHANGEMENT EMAIL ###");
      console.error("Status:", error.response?.status);
      console.error("Message d'erreur:", error.message);
      
      if (error.response?.data) {
        console.error("Response body:", error.response.data);
        if (typeof error.response.data === 'object') {
          Object.keys(error.response.data).forEach(key => {
            console.error(`  ${key}:`, error.response.data[key]);
          });
        } else {
          console.error("  ", error.response.data);
        }
      }
      
      // Pas de connexion internet
      if (!navigator.onLine || error.message === 'Network Error') {
        throw new Error("NETWORK_ERROR");
      }
      
      // Vérification spécifique pour "Mot de passe invalide"
      if (error.response && error.response.data) {
        const data = error.response.data;
        
        if (data.current_password) {
          if (data.current_password.some(msg => 
              typeof msg === 'string' && 
              (msg.toLowerCase().includes('mot de passe invalide') || 
               msg.toLowerCase().includes('invalid password')))) {
            throw new Error("CURRENT_PASSWORD_INCORRECT");
          }
        }
        
        // Vérifier pour email déjà existant
        if (data.new_email) {
          if (data.new_email.some(msg => 
              typeof msg === 'string' && 
              (msg.toLowerCase().includes('existe déjà') || 
               msg.toLowerCase().includes('already exists')))) {
            throw new Error("EMAIL_ALREADY_EXISTS");
          }
        }
        
        // Si le message d'erreur est un objet avec une propriété "detail"
        if (data.detail) {
          const detailMessage = data.detail;
          if (typeof detailMessage === 'string') {
            if (detailMessage.toLowerCase().includes('mot de passe') && 
                detailMessage.toLowerCase().includes('incorrect')) {
              throw new Error("CURRENT_PASSWORD_INCORRECT");
            }
            if (detailMessage.toLowerCase().includes('déjà utilisée') || 
                detailMessage.toLowerCase().includes('already exists')) {
              throw new Error("EMAIL_ALREADY_EXISTS");
            }
          }
        }
        
        // Erreurs basées sur le code HTTP
        const status = error.response.status;
        switch (status) {
          case 400:
            throw new Error("VALIDATION_ERROR");
          case 401:
            throw new Error("INVALID_CREDENTIALS");
          case 403:
            throw new Error("UNAUTHORIZED");
          case 500:
            throw new Error("SERVER_ERROR");
        }
      }
      
      // Erreur par défaut
      const rawMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`UNKNOWN_ERROR: ${rawMessage}`);
    }
  }

  /**
   * Active le changement d'email après clic sur le lien de confirmation
   * Cette méthode finalise le changement d'email qui était en attente
   * @param {Object} activationData - Données d'activation (uid, token, encoded_email, language)
   * @returns {Promise} - Réponse API
   */
  async activateEmailChange(activationData) {
    try {
      // Récupérer ou utiliser la langue fournie
      const currentLanguage = activationData.language || 
                            localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 
                            'fr';
      
      // Préparer les en-têtes avec la langue
      const headers = {
        'Accept-Language': currentLanguage
      };
      
      // Construire l'URL avec les paramètres au lieu d'utiliser le body
      const url = `${API_ENDPOINTS.AUTH.ACTIVATE_EMAIL_CHANGE}?uid=${activationData.uid}&token=${activationData.token}&encoded_email=${activationData.encoded_email}&language=${currentLanguage}`;
      
      console.log("Activation du changement d'email avec:", {
        uid: activationData.uid,
        token: activationData.token,
        encoded_email: activationData.encoded_email,
        language: currentLanguage
      });
      
      // Appel API pour activer le changement d'email (en utilisant GET au lieu de POST)
      const response = await secureApi.get(
        url,
        { headers }
      );
      
      console.log("Réponse de l'activation du changement d'email:", response.data);
      
      return {
        ...response.data,
        status: 'EMAIL_CHANGE_ACTIVATED'
      };
    } catch (error) {
      console.error("### DÉTAILS ERREUR ACTIVATION CHANGEMENT EMAIL ###");
      console.error("Status:", error.response?.status);
      console.error("Message d'erreur:", error.message);
      
      if (error.response?.data) {
        console.error("Response body:", error.response.data);
      }
      
      // Déterminer le type d'erreur
      let errorCode = "ACTIVATION_FAILED";
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400 && data.detail) {
          if (data.detail.includes('expiré')) {
            errorCode = "TOKEN_EXPIRED";
          } else if (data.detail.includes('invalide')) {
            errorCode = "TOKEN_INVALID";
          }
        }
      }
      
      throw new Error(errorCode);
    }
  }
  
  /**
   * Vérifie si un changement d'email est en attente d'activation
   * @returns {Promise} - Réponse API avec les détails du changement en attente
   */
  async checkPendingEmailChange(token) {
    try {
      const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
      
      const headers = {
        'Authorization': `JWT ${token}`,
        'Accept-Language': currentLanguage
      };
      
      const response = await secureApi.get(API_ENDPOINTS.AUTH.CHECK_PENDING_EMAIL, { headers });
      
      return response.data;
    } catch (error) {
      // Une erreur ici n'est pas critique, on peut la logger mais ne pas la propager
      console.error("Erreur lors de la vérification des changements d'email en attente:", error);
      return { pending: false };
    }
  }

  /**
   * Gère les erreurs API et extrait les messages d'erreur
   * @private
   * @param {Error} error - Erreur Axios
   * @returns {string} - Message d'erreur formaté
   */
  _handleError(error) {
    // Afficher les détails de l'erreur pour le debugging
    console.error("### DÉTAILS ERREUR ###");
    console.error("Status:", error.response?.status);
    console.error("Message d'erreur:", error.message);
    
    if (error.response?.data) {
      console.error("Response body:", error.response.data);
    }

    // Si l'erreur est déjà un message d'erreur formaté, le retourner tel quel
    if (typeof error.message === 'string' && [
      'INVALID_CREDENTIALS',
      'EMAIL_ALREADY_EXISTS',
      'CURRENT_PASSWORD_INCORRECT',
      'VALIDATION_ERROR',
      'TOO_MANY_ATTEMPTS',
      'SERVER_ERROR',
      'NETWORK_ERROR',
      'UNKNOWN_ERROR'
    ].includes(error.message)) {
      return error.message;
    }

    // Gestion des erreurs réseau et CORS
    if (!navigator.onLine || 
        error.message === 'Network Error' || 
        error.message === 'NetworkError when attempting to fetch resource' ||
        error.message.includes('CORS') ||
        error.message.includes('Cross-Origin') ||
        error.message.includes('Failed to fetch')) {
      console.error("Erreur réseau détectée:", error.message);
      return "NETWORK_ERROR";
    }

    // Gestion des erreurs HTTP
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Vérifier les erreurs spécifiques dans la réponse
      if (data) {
        // Vérifier si l'email existe déjà
        if (data.email && Array.isArray(data.email)) {
          for (const msg of data.email) {
            if (typeof msg === 'string' && 
                (msg.toLowerCase().includes('existe déjà') || 
                 msg.toLowerCase().includes('already exists') ||
                 msg.toLowerCase().includes('ya existe usuario con este email') ||
                 msg.toLowerCase().includes('existiert bereits') ||
                 msg.toLowerCase().includes('ist bereits vergeben'))) {
              return "EMAIL_ALREADY_EXISTS";
            }
          }
        }

        // Vérifier les erreurs de mot de passe
        if (data.current_password && Array.isArray(data.current_password)) {
          for (const msg of data.current_password) {
            if (typeof msg === 'string' && 
                (msg.toLowerCase().includes('mot de passe invalide') || 
                 msg.toLowerCase().includes('invalid password') ||
                 msg.toLowerCase().includes('contraseña inválida') ||
                 msg.toLowerCase().includes('ungültiges passwort') ||
                 msg.toLowerCase().includes('falsches passwort'))) {
              return "CURRENT_PASSWORD_INCORRECT";
            }
          }
        }

        // Vérifier dans detail ou autres champs génériques
        if (data.detail && typeof data.detail === 'string') {
          const detail = data.detail.toLowerCase();
          if (detail.includes('existe déjà') || 
              detail.includes('already exists') ||
              detail.includes('ya existe usuario con este email') ||
              detail.includes('existiert bereits') ||
              detail.includes('ist bereits vergeben')) {
            return "EMAIL_ALREADY_EXISTS";
          }
          if (detail.includes('mot de passe invalide') || 
              detail.includes('invalid password') ||
              detail.includes('contraseña inválida') ||
              detail.includes('ungültiges passwort') ||
              detail.includes('falsches passwort')) {
            return "CURRENT_PASSWORD_INCORRECT";
          }
          if (detail.includes('incorrect') || 
              detail.includes('invalid') ||
              detail.includes('incorrecto') ||
              detail.includes('inválido') ||
              detail.includes('ungültig') ||
              detail.includes('falsch')) {
            return "INVALID_CREDENTIALS";
          }
        }

        // Vérifier les erreurs non_field_errors
        if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          for (const msg of data.non_field_errors) {
            if (typeof msg === 'string') {
              const lowerMsg = msg.toLowerCase();
              if (lowerMsg.includes('incorrect') || 
                  lowerMsg.includes('invalid') || 
                  lowerMsg.includes('incorrecte') || 
                  lowerMsg.includes('invalide') ||
                  lowerMsg.includes('ungültig') ||
                  lowerMsg.includes('falsch')) {
                return "INVALID_CREDENTIALS";
              }
            }
          }
        }
      }

      // Gestion des codes HTTP
      switch (status) {
        case 401:
          return "INVALID_CREDENTIALS";
        case 400:
          // Si c'est une erreur 400 mais qu'on n'a pas trouvé de message spécifique
          return "VALIDATION_ERROR";
        case 429:
          return "TOO_MANY_ATTEMPTS";
        case 500:
          return "SERVER_ERROR";
        default:
          return "UNKNOWN_ERROR";
      }
    }

    // Si le message d'erreur contient des mots-clés spécifiques
    if (typeof error.message === 'string') {
      const lowerMsg = error.message.toLowerCase();
      if (lowerMsg.includes('incorrect') || 
          lowerMsg.includes('invalid') || 
          lowerMsg.includes('incorrecte') || 
          lowerMsg.includes('invalide')) {
        return "INVALID_CREDENTIALS";
      }
    }

    // Erreur par défaut
    console.error("Erreur non gérée:", error);
    return "NETWORK_ERROR";
  }
}

export default new AuthService();