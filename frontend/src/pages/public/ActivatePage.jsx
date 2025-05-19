import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { activate, reset } from '@/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

const ActivatePage = () => {
  const { uid, token } = useParams();
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
    
    console.log(`Activation du compte avec uid=${uid} en langue ${currentLanguage}`);

    const userData = {
      uid,
      token,
      language: currentLanguage // Ajouter la langue actuelle
    };
    
    dispatch(activate(userData));
    toast.success(t('accountActivation.successMessage'));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  
    if (isSuccess) {
      navigate("/login");
    }

    dispatch(reset());
  }, [isError, isSuccess, navigate, dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('accountActivation.pageTitle')}</title>
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
                  {t('accountActivation.title')}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  {t('accountActivation.subtitle')}
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
                  disabled={isLoading}
                >
                  <span>
                    {t('accountActivation.activateButton')}
                    <span aria-hidden="true"></span>
                  </span>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-600">
                {t('accountActivation.alreadyHaveAccount')}{' '}
              </span>
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                {t('accountActivation.loginLink')}
              </Link>
            </div>
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default ActivatePage;
