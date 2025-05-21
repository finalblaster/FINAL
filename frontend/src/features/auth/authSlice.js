import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

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

// Tentative de récupérer l'utilisateur de localStorage
const user = safeParseUser();

const initialState = {
    user: user ? user : null,
    userInfo: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    activeSection: "dashboard",
};

// Action pour rafraîchir le token
export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, thunkAPI) => {
        try {
            const user = safeParseUser();
            if (!user || !user.refresh) {
                return thunkAPI.rejectWithValue("Token de rafraîchissement non disponible");
            }
            
            // Appel à l'API pour rafraîchir le token
            const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/jwt/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: user.refresh }),
            });
            
            if (!response.ok) {
                throw new Error('Échec du rafraîchissement du token');
            }
            
            const data = await response.json();
            
            // Mise à jour du token dans le localStorage
            const updatedUser = {
                ...user,
                access: data.access,
            };
            
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Échec du rafraîchissement du token");
        }
    }
);

// Action pour l'enregistrement
export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            // Extraire la langue pour pouvoir la conserver séparément
            const { language, ...userRegistrationData } = userData;
            
            // Appeler le service d'enregistrement
            const response = await authService.register(userData);
            
            // Stocker la langue dans les données de réponse
            return { ...response, language };
        } catch (error) {
            console.log('Registration error:', error);
            
            // Si l'erreur est déjà un message formaté, le retourner tel quel
            if (error.message && [
                'EMAIL_ALREADY_EXISTS',
                'VALIDATION_ERROR',
                'TOO_MANY_ATTEMPTS',
                'SERVER_ERROR',
                'NETWORK_ERROR',
                'UNKNOWN_ERROR'
            ].includes(error.message)) {
                console.log('Using formatted error message:', error.message);
                return thunkAPI.rejectWithValue(error.message);
            }

            // Gestion des erreurs de l'API
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                // Vérifier si l'email existe déjà
                if (data.email && Array.isArray(data.email)) {
                    for (const msg of data.email) {
                        if (typeof msg === 'string' && 
                            (msg.toLowerCase().includes('existe déjà') || 
                             msg.toLowerCase().includes('already exists'))) {
                            return thunkAPI.rejectWithValue('EMAIL_ALREADY_EXISTS');
                        }
                    }
                }

                // Vérifier dans detail ou autres champs génériques
                if (data.detail && typeof data.detail === 'string') {
                    const detail = data.detail.toLowerCase();
                    if (detail.includes('existe déjà') || detail.includes('already exists')) {
                        return thunkAPI.rejectWithValue('EMAIL_ALREADY_EXISTS');
                    }
                }

                // Gestion des codes HTTP
                switch (status) {
                    case 400:
                        return thunkAPI.rejectWithValue('VALIDATION_ERROR');
                    case 429:
                        return thunkAPI.rejectWithValue('TOO_MANY_ATTEMPTS');
                    case 500:
                        return thunkAPI.rejectWithValue('SERVER_ERROR');
                    default:
                        return thunkAPI.rejectWithValue('UNKNOWN_ERROR');
                }
            }

            // Gestion des erreurs réseau
            if (error.message === 'Network Error') {
                return thunkAPI.rejectWithValue('NETWORK_ERROR');
            }

            // Erreur par défaut
            console.log('Unknown error type:', error);
            return thunkAPI.rejectWithValue('UNKNOWN_ERROR');
        }
    }
);

// Action pour la connexion
export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.login(userData);
            return response;
        } catch (error) {
            // Si c'est un compte inactif, on propage l'erreur
            if (error.message === 'INACTIVE_ACCOUNT') {
                return thunkAPI.rejectWithValue('INACTIVE_ACCOUNT');
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Action pour la déconnexion
export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout();
    }
);

export const activate = createAsyncThunk(
    "auth/activate",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.activate(userData);
            return response;  // Retourne la réponse de l'API si tout se passe bien
        } catch (error) {
            let message = '';
            if (error.response) {
                const status = error.response.status;

                // Gestion des erreurs spécifiques basées sur le statut HTTP
                switch (status) {
                    case 401:
                        // 401 Unauthorized - Identifiants incorrects
                        message = 'Adresse email ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer.';
                        break;
                    case 400:
                        // 400 Bad Request - Erreur de validation (champ requis manquant)
                        message = 'Tous les champs sont obligatoires. Veuillez remplir tous les champs et réessayer.';
                        break;
                    case 500:
                        // 500 Internal Server Error - Erreur serveur
                        message = 'Une erreur est survenue. Veuillez réessayer plus tard.';
                        break;
                    default:
                        // Autres erreurs HTTP génériques
                        message = error.response.data?.detail || 'Une erreur est survenue';
                        break;
                }
            } else if (error.message) {
                // Autres erreurs réseau ou de connexion
                message = error.message;  // Par exemple : "Network Error"
            } else {
                // Erreur inconnue
                message = 'Une erreur inconnue est survenue';
            }

            // Retourner l'erreur à l'état Redux pour l'afficher
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const activateEmail = createAsyncThunk(
    "auth/activateEmail",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.activateEmail(userData);
            return response;  // Retourne la réponse de l'API si tout se passe bien
        } catch (error) {
            let message = '';
            if (error.response) {
                const status = error.response.status;

                // Gestion des erreurs spécifiques basées sur le statut HTTP
                switch (status) {
                    case 401:
                        // 401 Unauthorized - Identifiants incorrects
                        message = 'Identifiants incorrects. Veuillez vérifier le lien d\'activation.';
                        break;
                    case 400:
                        // 400 Bad Request - Erreur de validation (champ requis manquant)
                        message = 'Lien d\'activation invalide ou expiré.';
                        break;
                    case 500:
                        // 500 Internal Server Error - Erreur serveur
                        message = 'Une erreur est survenue. Veuillez réessayer plus tard.';
                        break;
                    default:
                        // Autres erreurs HTTP génériques
                        message = error.response.data?.detail || 'Une erreur est survenue';
                        break;
                }
            } else if (error.message) {
                // Autres erreurs réseau ou de connexion
                message = error.message;  // Par exemple : "Network Error"
            } else {
                // Erreur inconnue
                message = 'Une erreur inconnue est survenue';
            }

            // Retourner l'erreur à l'état Redux pour l'afficher
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPassword(userData);
        } catch (error) {
            let message = '';
            if (error.response) {
                const status = error.response.status;

                // Gestion des erreurs spécifiques basées sur le statut HTTP
                switch (status) {
                    case 400:
                        // 400 Bad Request - Erreur de validation (champ requis manquant)
                        message = 'Tous les champs sont obligatoires. Veuillez remplir tous les champs et réessayer.';
                        break;
                    case 404:
                        // 404 Not Found - L'email ou l'ID de l'utilisateur n'existe pas
                        message = 'Aucun compte trouvé pour cette adresse email.';
                        break;
                    case 500:
                        // 500 Internal Server Error - Erreur serveur
                        message = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
                        break;
                    default:
                        // Autres erreurs HTTP génériques
                        message = error.response.data?.detail || 'Une erreur est survenue';
                        break;
                }
            } else if (error.message) {
                // Autres erreurs réseau ou de connexion
                message = error.message;  // Par exemple : "Network Error"
            } else {
                // Erreur inconnue
                message = 'Une erreur inconnue est survenue';
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const resetPasswordConfirm = createAsyncThunk(
    "auth/resetPasswordConfirm",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPasswordConfirm(userData);
        } catch (error) {
            let message = '';
            if (error.response) {
                const status = error.response.status;

                // Gestion des erreurs spécifiques basées sur le statut HTTP
                switch (status) {
                    case 400:
                        // 400 Bad Request - Erreur de validation (champ requis manquant)
                        message = 'Tous les champs sont obligatoires. Veuillez remplir tous les champs et réessayer.';
                        break;
                    case 404:
                        // 404 Not Found - L'email ou le token de réinitialisation n'existe pas
                        message = 'Lien de réinitialisation invalide ou expiré.';
                        break;
                    case 500:
                        // 500 Internal Server Error - Erreur serveur
                        message = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
                        break;
                    default:
                        // Autres erreurs HTTP génériques
                        message = error.response.data?.detail || 'Une erreur est survenue';
                        break;
                }
            } else if (error.message) {
                // Autres erreurs réseau ou de connexion
                message = error.message;  // Par exemple : "Network Error"
            } else {
                // Erreur inconnue
                message = 'Une erreur inconnue est survenue';
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (_, thunkAPI) => {
        try {
            const accessToken = thunkAPI.getState().auth.user.access
            return await authService.getUserInfo(accessToken)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Dans authSlice.js
export const resendVerification = createAsyncThunk(
    "auth/resendVerification",
    async (emailOrData, thunkAPI) => {
        try {
            // Déterminer si on reçoit juste l'email ou un objet avec email + langue
            let email, language;
            
            if (typeof emailOrData === 'string') {
                email = emailOrData;
                // Utiliser la langue de l'application par défaut
                language = thunkAPI.getState().i18n?.language || 'fr';
            } else {
                // Si on reçoit un objet
                email = emailOrData.email;
                language = emailOrData.language || 'fr';
            }
            
            console.log(`Envoi de demande de vérification pour ${email} en langue ${language}`);
            
            // Envoyer à la fois l'email et la langue
            const response = await authService.resendVerification({ email, language });
            return response;
        } catch (error) {
            let message = '';
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case 400:
                        message = 'Adresse email invalide.';
                        break;
                    case 429:
                        message = 'Veuillez attendre avant de demander un nouveau lien.';
                        break;
                    default:
                        message = error.response.data?.detail || 'Une erreur est survenue';
                }
            } else if (error.message) {
                message = error.message;
            } else {
                message = 'Une erreur inconnue est survenue';
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Action pour changer le mot de passe
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (passwordData, thunkAPI) => {
        try {
            // Envoyer les données sans modification car re_new_password est déjà inclus 
            const token = thunkAPI.getState().auth.user.access;
            return await authService.changePassword(passwordData, token);
        } catch (error) {
            console.log("Redux changePassword thunk - erreur reçue:", error);
            let message = '';
            
            // Vérifier si nous avons une instance d'Error avec un message formaté
            if (error instanceof Error) {
                console.log("Redux changePassword thunk - message d'erreur:", error.message);
                
                // Vérifier les codes d'erreur spécifiques
                if (error.message === 'CURRENT_PASSWORD_INCORRECT' ||
                    error.message === 'PASSWORD_TOO_SHORT' ||
                    error.message === 'PASSWORD_INVALID' ||
                    error.message === 'PASSWORDS_DO_NOT_MATCH' ||
                    error.message === 'VALIDATION_ERROR' ||
                    error.message === 'INVALID_CREDENTIALS' ||
                    error.message === 'UNAUTHORIZED' ||
                    error.message === 'NETWORK_ERROR' ||
                    error.message === 'SERVER_ERROR') {
                    
                    console.log("Redux changePassword thunk - code d'erreur reconnu:", error.message);
                    return thunkAPI.rejectWithValue(error.message);
                }
                
                if (error.message.startsWith('UNKNOWN_ERROR:')) {
                    // Pour les erreurs inconnues, vérifier si c'est une erreur de mot de passe invalide
                    if (error.message.includes('Mot de passe invalide') || 
                        error.message.includes('invalid password') || 
                        error.message.includes('incorrect password')) {
                        
                        console.log("Redux changePassword thunk - détection de 'mot de passe invalide' dans UNKNOWN_ERROR");
                        return thunkAPI.rejectWithValue('CURRENT_PASSWORD_INCORRECT');
                    }
                    return thunkAPI.rejectWithValue('UNKNOWN_ERROR');
                }
                
                message = error.message;
            } else if (typeof error === 'string') {
                // Si l'erreur est directement une chaîne
                message = error;
            } else {
                // Si l'erreur est un autre type d'objet
                message = 'UNKNOWN_ERROR';
            }
            
            // Toujours vérifier la réponse de l'API si disponible
            if (error.response && error.response.data) {
                const data = error.response.data;
                
                // Détecter explicitement "Mot de passe invalide"
                if (data.current_password && Array.isArray(data.current_password)) {
                    for (const msg of data.current_password) {
                        if (typeof msg === 'string' && 
                            (msg.includes('Mot de passe invalide') || 
                             msg.toLowerCase().includes('invalid password') || 
                             msg.toLowerCase().includes('incorrect password'))) {
                            
                            console.log("Redux changePassword thunk - 'mot de passe invalide' détecté dans la réponse");
                            return thunkAPI.rejectWithValue('CURRENT_PASSWORD_INCORRECT');
                        }
                    }
                }
            }
            
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Action pour changer l'adresse email (USERNAME_FIELD) - Étape 1 : Demande de changement
export const changeEmail = createAsyncThunk(
    "auth/changeEmail",
    async (emailData, thunkAPI) => {
        try {
            // Récupérer le token d'accès
            const token = thunkAPI.getState().auth.user.access;
            const response = await authService.changeEmail(emailData, token);
            
            // La réponse contient maintenant les informations sur l'état de la vérification
            // Le changement d'email n'est pas encore effectif, un email de vérification a été envoyé
            return {
                ...response,
                pendingEmail: emailData.new_email,
                message: "EMAIL_VERIFICATION_SENT"
            };
        } catch (error) {
            console.log("Redux changeEmail thunk - erreur reçue:", error);
            let message = '';
            
            // Vérifier si nous avons une instance d'Error avec un message formaté
            if (error instanceof Error) {
                console.log("Redux changeEmail thunk - message d'erreur:", error.message);
                
                // Vérifier les codes d'erreur spécifiques
                if (error.message === 'CURRENT_PASSWORD_INCORRECT' ||
                    error.message === 'EMAIL_ALREADY_EXISTS' ||
                    error.message === 'VALIDATION_ERROR' ||
                    error.message === 'INVALID_CREDENTIALS' ||
                    error.message === 'UNAUTHORIZED' ||
                    error.message === 'NETWORK_ERROR' ||
                    error.message === 'SERVER_ERROR') {
                    
                    console.log("Redux changeEmail thunk - code d'erreur reconnu:", error.message);
                    return thunkAPI.rejectWithValue(error.message);
                }
                
                if (error.message.startsWith('UNKNOWN_ERROR:')) {
                    // Pour les erreurs inconnues, vérifier si c'est une erreur de mot de passe invalide
                    if (error.message.includes('Mot de passe invalide') || 
                        error.message.includes('invalid password')) {
                        return thunkAPI.rejectWithValue('CURRENT_PASSWORD_INCORRECT');
                    }
                    // Pour les erreurs d'email déjà existant
                    if (error.message.includes('existe déjà') || 
                        error.message.includes('already exists')) {
                        return thunkAPI.rejectWithValue('EMAIL_ALREADY_EXISTS');
                    }
                    return thunkAPI.rejectWithValue('UNKNOWN_ERROR');
                }
                
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            } else {
                message = 'UNKNOWN_ERROR';
            }
            
            // Vérifier la réponse de l'API si disponible
            if (error.response && error.response.data) {
                const data = error.response.data;
                
                // Détecter "Mot de passe invalide"
                if (data.current_password && Array.isArray(data.current_password)) {
                    for (const msg of data.current_password) {
                        if (typeof msg === 'string' && 
                            (msg.includes('Mot de passe invalide') || 
                             msg.toLowerCase().includes('invalid password'))) {
                            return thunkAPI.rejectWithValue('CURRENT_PASSWORD_INCORRECT');
                        }
                    }
                }
                
                // Détecter "Email existe déjà"
                if (data.new_email && Array.isArray(data.new_email)) {
                    for (const msg of data.new_email) {
                        if (typeof msg === 'string' && 
                            (msg.includes('existe déjà') || 
                             msg.toLowerCase().includes('already exists'))) {
                            return thunkAPI.rejectWithValue('EMAIL_ALREADY_EXISTS');
                        }
                    }
                }
            }
            
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Action pour activer le changement d'email - Étape 2 : Confirmation du changement
export const activateEmailChange = createAsyncThunk(
    "auth/activateEmailChange",
    async (activationData, thunkAPI) => {
        try {
            // Appeler le service d'activation d'email
            const response = await authService.activateEmailChange(activationData);
            
            // Si la demande réussit, le changement d'email est effectif
            return {
                ...response,
                message: "EMAIL_CHANGE_ACTIVATED"
            };
        } catch (error) {
            console.log("Redux activateEmailChange thunk - erreur reçue:", error);
            
            // Extraire le message d'erreur
            let errorMessage = "ACTIVATION_FAILED";
            
            if (error instanceof Error) {
                if (error.message === "TOKEN_EXPIRED" || 
                    error.message === "TOKEN_INVALID") {
                    errorMessage = error.message;
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // Extraire le message de détail de l'erreur
                    const detail = error.response.data.detail;
                    if (typeof detail === "string") {
                        if (detail.toLowerCase().includes("expiré")) {
                            errorMessage = "TOKEN_EXPIRED";
                        } else if (detail.toLowerCase().includes("invalide")) {
                            errorMessage = "TOKEN_INVALID";
                        }
                    }
                }
            }
            
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Action pour obtenir le profil utilisateur
export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
        try {
            return await authService.getProfile();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Action pour mettre à jour le profil utilisateur
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (profileData, thunkAPI) => {
        try {
            return await authService.updateProfile(profileData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Action pour télécharger une image de profil
export const uploadProfileImage = createAsyncThunk(
    "auth/uploadProfileImage",
    async (imageFile, thunkAPI) => {
        try {
            return await authService.uploadProfileImage(imageFile);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Action pour supprimer l'image de profil
export const removeProfileImage = createAsyncThunk(
    "auth/removeProfileImage",
    async (_, thunkAPI) => {
        try {
            return await authService.removeProfileImage();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Création du slice Redux
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        setActiveSection: (state, action) => {
            state.activeSection = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Gestion du rafraîchissement de token
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Gestion de l'enregistrement
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "registration_success";
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Gestion de la connexion
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Gestion de la déconnexion
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.userInfo = {};
            })
            // Gestion de l'activation
            .addCase(activate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(activate.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(activate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Gestion de l'activation d'email
            .addCase(activateEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(activateEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(activateEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Gestion de la réinitialisation du mot de passe
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                // Optionnellement, garder l'utilisateur intact
            })
            .addCase(resetPasswordConfirm.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPasswordConfirm.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                // Optionnellement, garder l'utilisateur intact
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resendVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendVerification.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resendVerification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cas pour getProfile
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userInfo = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cas pour updateProfile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userInfo = action.payload;
                state.message = "PROFILE_UPDATED";
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cas pour uploadProfileImage
            .addCase(uploadProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userInfo = action.payload;
                state.message = "PROFILE_IMAGE_UPLOADED";
            })
            .addCase(uploadProfileImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cas pour removeProfileImage
            .addCase(removeProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userInfo = action.payload;
                state.message = "PROFILE_IMAGE_REMOVED";
            })
            .addCase(removeProfileImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cas pour changeEmail
            .addCase(changeEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Utiliser le message de vérification d'email en attente
                state.message = "EMAIL_VERIFICATION_SENT";
                state.pendingEmailChange = {
                    email: action.payload.pendingEmail,
                    timestamp: new Date().toISOString()
                };
            })
            .addCase(changeEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(activateEmailChange.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(activateEmailChange.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "EMAIL_CHANGE_ACTIVATED";
            })
            .addCase(activateEmailChange.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, setActiveSection } = authSlice.actions;
export default authSlice.reducer;
