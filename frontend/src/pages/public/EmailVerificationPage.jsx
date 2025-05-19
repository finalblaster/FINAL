import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Logo from '@/components/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { resendVerification, reset } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

const EmailVerificationPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const email = location.state?.email;
    const languageFromState = location.state?.language;
    const { isLoading } = useSelector((state) => state.auth);
    const { t, i18n } = useTranslation();
    const { changeLanguage } = useLanguage();
    const [languageApplied, setLanguageApplied] = useState(false);

    // Appliquer la langue stockée, celle passée en paramètre, ou celle par défaut
    useEffect(() => {
        if (!languageApplied) {
            // Priorité 1: Langue passée dans le state
            if (languageFromState) {
                console.log(`Utilisation de la langue passée en paramètre: ${languageFromState}`);
                changeLanguage(languageFromState);
                setLanguageApplied(true);
            } 
            // Priorité 2: Langue stockée dans localStorage
            else {
                const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
                if (savedLanguage) {
                    console.log('Restauration de la langue sauvegardée:', savedLanguage);
                    changeLanguage(savedLanguage);
                } 
                // Priorité 3: Langue par défaut
                else {
                    console.log('Aucune langue sauvegardée, utilisation de la langue par défaut:', DEFAULT_LANGUAGE);
                    changeLanguage(DEFAULT_LANGUAGE);
                }
                setLanguageApplied(true);
            }
        }
    }, [changeLanguage, languageFromState, languageApplied]);

    const handleResendVerification = async () => {
        if (!email) {
            toast.error(t('emailVerification.resendError'));
            return;
        }
        
        // Récupérer la langue actuelle
        const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
        
        console.log(`Renvoi de l'email de vérification pour ${email} en langue ${currentLanguage}`);
        
        // Passer l'email et la langue lors du renvoi de l'email
        await dispatch(resendVerification({
            email,
            language: currentLanguage
        }));
        
        toast.success(t('emailVerification.resendSuccess'));
        dispatch(reset());
    };

    return (
        <>
            <Helmet>
                <title>{t('emailVerification.pageTitle')}</title>
            </Helmet>
            <AuthLayout>
                <div className="flex flex-col relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
                            <Spinner loading={isLoading} />
                        </div>
                    )}
                    <Link to="/" aria-label="Home">
                        <Logo className="h-10 w-auto" />
                    </Link>
                    <div className="mt-20">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {t('emailVerification.title')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-700">
                            {t('emailVerification.subtitle')}
                        </p>

                    </div>
                </div>
                <div className="mt-10">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {t('emailVerification.checkSpam')}{' '}
                            <button 
                                onClick={handleResendVerification}
                                className="text-blue-600 hover:text-blue-500"
                                disabled={isLoading}
                            >
                                {t('emailVerification.resendLink')}
                            </button>.
                        </p>
                        <div className="mt-6">
                            <Button
                                to="/"
                                variant="solid"
                                color="blue"
                                className="w-full"
                            >
                                {t('emailVerification.backToHome')}
                            </Button>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export default EmailVerificationPage; 