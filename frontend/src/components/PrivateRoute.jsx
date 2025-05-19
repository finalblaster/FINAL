import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isAuthenticated } from '@/utils/auth';
import { refreshToken, logout } from '@/features/auth/authSlice';
import Spinner from '@/components/Spinner';

/**
 * Composant pour protéger les routes privées
 * Vérifie l'authentification et gère le rafraîchissement des tokens
 */
const PrivateRoute = () => {
  const { user, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(() => {
    // Si l'utilisateur est connecté mais que le token JWT est expiré
    if (user && !isAuthenticated()) {
      // Tente de rafraîchir le token
      dispatch(refreshToken())
        .unwrap()
        .catch(() => {
          // Si le rafraîchissement échoue, déconnecte l'utilisateur
          dispatch(logout());
        });
    }
  }, [user, dispatch]);
  
  // Affiche un spinner pendant le chargement
  if (status === 'loading') {
    return <Spinner />;
  }

  // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  // Stocke le chemin actuel pour rediriger l'utilisateur après connexion
  if (!user || !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si l'utilisateur est authentifié, affiche les routes enfants
  return <Outlet />;
};

export default PrivateRoute;
