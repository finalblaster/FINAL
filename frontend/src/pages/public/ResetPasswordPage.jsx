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
    setEmail(e.target.value);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Appliquer trim() à l'email pour enlever les espaces avant de soumettre
    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      toast.error(translations.errors.emailRequired);
      return;
    }

    // Récupérer la langue actuelle
    const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
    
    // Inclure la langue dans les données utilisateur
    const userData = {
      email: trimmedEmail,
      language: currentLanguage
    };

    console.log(`Envoi de demande de réinitialisation pour ${trimmedEmail} en langue ${currentLanguage}`);

    // Déclenche l'action pour réinitialiser le mot de passe
    dispatch(resetPassword(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);  // Affichage de l'erreur si l'API retourne une erreur
    }
    if (isSuccess) {
      toast.success(translations.successMessage);  // Message de succès
      navigate("/");  // Redirige vers la page d'accueil après succès
    }

    // Réinitialiser l'état de l'authentification pour éviter la persistance d'anciens états
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch, translations]);

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
                  {translations.submitButton} <span aria-hidden="true"> &rarr;</span>
                </span>
              </Button>
            </div>
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;
