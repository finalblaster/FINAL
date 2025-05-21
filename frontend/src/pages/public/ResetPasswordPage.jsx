import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import { TextField } from '@/components/Fields';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@/components/Spinner';
import { resetPassword, reset } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { commonTranslations } from '@/translations/common';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';
import { motion } from 'framer-motion';

// Nom de la page dans différentes langues
const pageNames = {
  en: "Reset Password Page",
  fr: "Page de Réinitialisation de Mot de Passe",
  es: "Página de Restablecimiento de Contraseña",
  de: "Passwort-Zurücksetzungsseite"
};

// Textes spécifiques pour l'espagnol
const esTranslations = {
  pageTitle: 'Restablecer Contraseña - Sputnik',
  title: 'Restablecer su contraseña',
  subtitle: 'Ingrese la dirección de correo electrónico asociada con su cuenta. Le enviaremos un enlace para restablecer su contraseña.',
  emailLabel: 'Dirección de correo electrónico',
  submitButton: 'Enviar enlace de restablecimiento',
  successMessage: 'Se ha enviado un correo electrónico para restablecer la contraseña.',
  errors: {
    emailRequired: 'Se requiere dirección de correo electrónico',
    emailInvalid: 'La dirección de correo electrónico no es válida',
  },
};

// Textes spécifiques pour le français
const frTranslations = {
  pageTitle: 'Réinitialiser le mot de passe - Sputnik',
  title: 'Réinitialiser votre mot de passe',
  subtitle: 'Entrez l\'adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.',
  emailLabel: 'Adresse email',
  submitButton: 'Envoyer le lien de réinitialisation',
  successMessage: 'Un e-mail de réinitialisation de mot de passe a été envoyé.',
  errors: {
    emailRequired: 'L\'adresse email est requise',
    emailInvalid: 'L\'adresse email n\'est pas valide',
  },
};

// Textes spécifiques pour l'anglais
const enTranslations = {
  pageTitle: 'Reset Password - Sputnik',
  title: 'Reset your password',
  subtitle: 'Enter the email address associated with your account. We will send you a link to reset your password.',
  emailLabel: 'Email address',
  submitButton: 'Send reset link',
  successMessage: 'A password reset email has been sent.',
  errors: {
    emailRequired: 'Email address is required',
    emailInvalid: 'Email address is invalid',
  },
};

// Textes spécifiques pour l'allemand
const deTranslations = {
  pageTitle: 'Passwort zurücksetzen - Sputnik',
  title: 'Setzen Sie Ihr Passwort zurück',
  subtitle: 'Geben Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.',
  emailLabel: 'E-Mail-Adresse',
  submitButton: 'Link zum Zurücksetzen senden',
  successMessage: 'Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.',
  errors: {
    emailRequired: 'E-Mail-Adresse ist erforderlich',
    emailInvalid: 'E-Mail-Adresse ist ungültig',
  },
};

const ResetPasswordPage = () => {
  const { i18n } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [translations, setTranslations] = useState(frTranslations);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Appliquer la langue stockée ou celle par défaut au chargement de la page
  useEffect(() => {
    // Récupérer la langue stockée dans localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    
    // Si une langue est déjà enregistrée, l'utiliser
    if (savedLanguage) {
      console.log('Restauration de la langue sauvegardée:', savedLanguage);
      changeLanguage(savedLanguage);
      
      // Sélectionner les traductions en fonction de la langue
      switch(savedLanguage) {
        case 'es':
          setTranslations(esTranslations);
          break;
        case 'en':
          setTranslations(enTranslations);
          break;
        case 'de':
          setTranslations(deTranslations);
          break;
        default:
          setTranslations(frTranslations);
      }
    } 
    // Sinon, utiliser la langue par défaut
    else {
      console.log('Aucune langue sauvegardée, utilisation de la langue par défaut:', DEFAULT_LANGUAGE);
      changeLanguage(DEFAULT_LANGUAGE);
      
      // Définir les traductions par défaut
      switch(DEFAULT_LANGUAGE) {
        case 'es':
          setTranslations(esTranslations);
          break;
        case 'en':
          setTranslations(enTranslations);
          break;
        case 'de':
          setTranslations(deTranslations);
          break;
        default:
          setTranslations(frTranslations);
      }
    }
  }, [changeLanguage]);
  
  // Mettre à jour les traductions quand la langue change
  useEffect(() => {
    const currentLang = i18n.language || DEFAULT_LANGUAGE;
    switch(currentLang) {
      case 'es':
        setTranslations(esTranslations);
        break;
      case 'en':
        setTranslations(enTranslations);
        break;
      case 'de':
        setTranslations(deTranslations);
        break;
      default:
        setTranslations(frTranslations);
    }
  }, [i18n.language]);

  const handleChange = (e) => {
    // Supprime tous les espaces pour l'email immédiatement
    const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
    setEmail(valueWithoutSpaces);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanEmail = email.replace(/\s/g, '');
    if (cleanEmail === "") {
      toast.error(translations.errors.emailRequired);
      return;
    }

    // Récupérer la langue actuelle
    const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
    
    // Inclure la langue dans les données utilisateur
    const userData = {
      email: cleanEmail,
      language: currentLanguage
    };

    console.log(`Envoi de demande de réinitialisation pour ${cleanEmail} en langue ${currentLanguage}`);

    // Déclenche l'action pour réinitialiser le mot de passe
    dispatch(resetPassword(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);  // Affichage de l'erreur si l'API retourne une erreur
      setShowConfirmation(false);
    }
    if (isSuccess) {
      toast.success(translations.successMessage);  // Message de succès
      setEmail(''); // Réinitialiser le champ email
      setShowConfirmation(true); // Afficher le message de confirmation
    }

    // Réinitialiser l'état de l'authentification pour éviter la persistance d'anciens états
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, translations]);

  return (
    <>
      <Helmet>
        <title>{translations.pageTitle}</title>
        <meta name="description" content={translations.title} />
      </Helmet>

      <AuthLayout>
        <div className="flex flex-col">
          <Link to="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-gray-900">
              {translations.title}
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              {translations.subtitle}
            </p>
          </div>
        </div>

        {/* Affichage conditionnel du Spinner ou du formulaire */}
        {isLoading ? (
          <div className="flex justify-center items-center mt-10">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
            <TextField
              label={translations.emailLabel}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              value={email}
              required
            />
            <div>
              <Button
                type="submit"
                variant="solid"
                color="blue"
                className="w-full"
              >
                <span>
                  {translations.submitButton} <span aria-hidden="true"></span>
                </span>
              </Button>
            </div>
            {showConfirmation && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-600 text-white rounded-lg shadow-md"
              >
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">{translations.successMessage}</p>
                    <button 
                      onClick={() => setShowConfirmation(false)} 
                      className="absolute top-3 right-3 text-white"
                      aria-label="Fermer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;
