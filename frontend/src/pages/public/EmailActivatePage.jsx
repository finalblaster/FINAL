import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { activateEmailChange, reset } from '@/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

const EmailActivatePage = () => {
  const { uid, token, encoded_email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguage();
  
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Appliquer la langue stockée ou celle par défaut
  useEffect(() => {
    // Récupérer la langue stockée dans localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    
    // Si une langue est déjà enregistrée, l'utiliser
    if (savedLanguage) {
      console.log('Restauration de la langue sauvegardée:', savedLanguage);
      changeLanguage(savedLanguage);
    } 
    // Sinon, utiliser la langue par défaut
    else {
      console.log('Aucune langue sauvegardée, utilisation de la langue par défaut:', DEFAULT_LANGUAGE);
      changeLanguage(DEFAULT_LANGUAGE);
    }
  }, [changeLanguage]);

  const handleActivate = (e) => {
    e.preventDefault();

    // Récupérer la langue actuelle
    const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
    
    console.log(`Activation du changement d'email avec uid=${uid}, token=${token}, encoded_email=${encoded_email} en langue ${currentLanguage}`);

    const userData = {
      uid,
      token,
      encoded_email,
      language: currentLanguage // Ajouter la langue actuelle
    };
    
    // Utiliser la nouvelle action d'activation de changement d'email
    dispatch(activateEmailChange(userData));
  };

  useEffect(() => {
    if (isError) {
      // Gérer les différents types d'erreurs
      if (message === "TOKEN_EXPIRED") {
        toast.error(t('emailActivation.errors.tokenExpired'));
      } else if (message === "TOKEN_INVALID") {
        toast.error(t('emailActivation.errors.tokenInvalid'));
      } else if (message === "ACTIVATION_FAILED") {
        toast.error(t('emailActivation.errors.activationFailed'));
      } else {
        toast.error(message || t('emailActivation.errors.generic'));
      }
    }
  
    if (isSuccess && message === "EMAIL_CHANGE_ACTIVATED") {
      toast.success(t('emailActivation.successMessage'));
      navigate("/");
    }

    // Réinitialiser le state après traitement
    if (isSuccess || isError) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }
  }, [isError, isSuccess, message, navigate, dispatch, t]);

  // Effectuer l'activation automatiquement au chargement si les paramètres sont présents
  useEffect(() => {
    if (uid && token && encoded_email && !isLoading && !isSuccess && !isError) {
      // Auto-activation (commentée pour permettre à l'utilisateur de confirmer avec le bouton)
      // handleActivate({ preventDefault: () => {} });
    }
  }, [uid, token, encoded_email, isLoading, isSuccess, isError]);

  return (
    <>
      <Helmet>
        <title>{t('emailActivation.pageTitle')}</title>
      </Helmet>

      <AuthLayout>
        {/* Logo toujours visible */}
        <div className="flex justify-center items-center mb-10">
          <Link to="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        {/* Affichage du spinner uniquement sur la partie où le contenu doit être chargé */}
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full absolute inset-0 bg-white bg-opacity-50 z-10">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <div className="mt-20">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('emailActivation.title')}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  {t('emailActivation.subtitle')}
                </p>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-y-8">
              <div>
                <Button
                  type="button"
                  variant="solid"
                  color="blue"
                  className="w-full"
                  onClick={handleActivate}
                  disabled={isLoading || isSuccess}
                >
                  <span>
                    {t('emailActivation.activateButton')}
                    <span aria-hidden="true"></span>
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default EmailActivatePage; 