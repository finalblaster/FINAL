import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Fonction pour activer un compte
  const activateAccount = async (uid, token) => {
    try {
      setLoading(true);
      setError(null);
      await authService.activateAccount(uid, token);
      return true;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'activation du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se connecter
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      setCurrentUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      setError(err.message || 'Échec de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  // Fonction pour s'inscrire
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Échec de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    activateAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 