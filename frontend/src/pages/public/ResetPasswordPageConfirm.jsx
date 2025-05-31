import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import { TextField } from '@/components/Fields';
import PasswordField from '@/components/PasswordField';
import GeneralMessage from '@/components/GeneralMessage';
import Logo from '@/components/Logo';
import Spinner from '@/components/Spinner';
import { resetPasswordConfirm, reset } from '@/features/auth/authSlice';
import { useTranslation } from 'react-i18next';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

// Nom de la page dans différentes langues
const pageNames = {
  en: "Reset Password Confirmation Page",
  fr: "Page de Confirmation de Réinitialisation de Mot de Passe",
  es: "Página de Confirmación de Restablecimiento de Contraseña",
  de: "Passwort-Zurücksetzungsbestätigungsseite"
};

// Textes spécifiques pour l'espagnol
const esTranslations = {
  pageTitle: 'Restablecer Contraseña - Zoopok',
  title: 'Restablecer su contraseña',
  subtitle: 'Ingrese su nueva contraseña a continuación.',
  newPasswordLabel: 'Nueva contraseña',
  confirmPasswordLabel: 'Confirme su contraseña',
  submitButton: 'Confirmar contraseña',
  successMessage: 'Su contraseña ha sido restablecida con éxito.',
  errors: {
    passwordRequired: 'La contraseña es requerida',
    passwordLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordComplexity: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
    confirmPasswordRequired: 'La confirmación de la contraseña es requerida',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    genericError: 'Ha ocurrido un error. Por favor, inténtelo de nuevo.',
  },
};

// Textes spécifiques pour le français
const frTranslations = {
  pageTitle: 'Réinitialiser le mot de passe - Zoopok',
  title: 'Réinitialiser votre mot de passe',
  subtitle: 'Entrez votre nouveau mot de passe ci-dessous.',
  newPasswordLabel: 'Nouveau mot de passe',
  confirmPasswordLabel: 'Confirmez votre mot de passe',
  submitButton: 'Confirmer le mot de passe',
  successMessage: 'Votre mot de passe a été réinitialisé avec succès.',
  errors: {
    passwordRequired: 'Le mot de passe est requis',
    passwordLength: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordComplexity: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    confirmPasswordRequired: 'La confirmation du mot de passe est requise',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    genericError: 'Une erreur est survenue. Veuillez réessayer.',
  },
};

// Textes spécifiques pour l'anglais
const enTranslations = {
  pageTitle: 'Reset Password - Zoopok',
  title: 'Reset your password',
  subtitle: 'Enter your new password below.',
  newPasswordLabel: 'New password',
  confirmPasswordLabel: 'Confirm your password',
  submitButton: 'Confirm password',
  successMessage: 'Your password has been successfully reset.',
  errors: {
    passwordRequired: 'Password is required',
    passwordLength: 'Password must be at least 8 characters',
    passwordComplexity: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    confirmPasswordRequired: 'Password confirmation is required',
    passwordsDoNotMatch: 'Passwords do not match',
    genericError: 'An error occurred. Please try again.',
  },
};

// Textes spécifiques pour l'allemand
const deTranslations = {
  pageTitle: 'Passwort zurücksetzen - Zoopok',
  title: 'Setzen Sie Ihr Passwort zurück',
  subtitle: 'Geben Sie unten Ihr neues Passwort ein.',
  newPasswordLabel: 'Neues Passwort',
  confirmPasswordLabel: 'Bestätigen Sie Ihr Passwort',
  submitButton: 'Passwort bestätigen',
  successMessage: 'Ihr Passwort wurde erfolgreich zurückgesetzt.',
  errors: {
    passwordRequired: 'Passwort ist erforderlich',
    passwordLength: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    passwordComplexity: 'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
    confirmPasswordRequired: 'Passwortbestätigung ist erforderlich',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    genericError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  },
};

const ResetPasswordConfirmPage = () => {
  const { uid, token } = useParams(); // UID et token récupérés depuis l'URL
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const [errors, setErrors] = useState({
    new_password: '',
    re_new_password: '',
    general: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newPassword = formData.new_password.trim();
    const reNewPassword = formData.re_new_password.trim();

    if (!newPassword) {
      newErrors.new_password = t('resetPasswordConfirm.errors.passwordRequired');
    } else if (newPassword.length < 8) {
      newErrors.new_password = t('resetPasswordConfirm.errors.passwordLength');
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.new_password = t('resetPasswordConfirm.errors.passwordComplexity');
    }

    if (!reNewPassword) {
      newErrors.re_new_password = t('resetPasswordConfirm.errors.confirmPasswordRequired');
    } else if (newPassword !== reNewPassword) {
      newErrors.re_new_password = t('resetPasswordConfirm.errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm() || isLoading) {
      return; // Stop si le formulaire est invalide ou si une requête est déjà en cours
    }

    // Récupérer la langue actuelle
    const currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;

    // Appliquer trim() aux mots de passe avant de les envoyer
    const userData = {
      uid,
      token,
      new_password: formData.new_password.trim(),
      re_new_password: formData.re_new_password.trim(),
      language: currentLanguage // Ajouter la langue aux données
    };

    console.log(`Envoi de demande de confirmation de réinitialisation avec uid=${uid} en langue ${currentLanguage}`);

    dispatch(resetPasswordConfirm(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message); // Affiche une erreur générique avec le message de l'API
      setErrors((prev) => ({ ...prev, general: message })); // Stocke l'erreur générale retournée par l'API
      dispatch(reset());
    }

    if (isSuccess) {
      toast.success(t('resetPasswordConfirm.successMessage'));
      navigate('/login'); // Redirige vers la page de connexion après succès
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch, t]);

  return (
    <>
      <Helmet>
        <title>{t('resetPasswordConfirm.pageTitle')}</title>
      </Helmet>
      <AuthLayout>
        <div className="flex flex-col">
          <Link to="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">{t('resetPasswordConfirm.title')}</h2>
            <p className="mt-2 text-sm text-gray-700">
              {t('resetPasswordConfirm.subtitle')}
            </p>
          </div>
        </div>

        {/* Affichage conditionnel du Spinner et formulaire */}
        <div className="relative">
          {/* Overlay Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
              <Spinner loading={isLoading} />
            </div>
          )}

          {/* Formulaire de réinitialisation du mot de passe */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 grid grid-cols-1 gap-y-8"
          >
            {/* Message d'erreur général en haut */}
            {errors.general && (
              <GeneralMessage type="error" message={errors.general} />
            )}

            <PasswordField
              label={t('resetPasswordConfirm.newPasswordLabel')}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              error={errors.new_password}
              autoComplete="new-password"
              showStrengthMeter={true}
            />

            <PasswordField
              label={t('resetPasswordConfirm.confirmPasswordLabel')}
              id="re_new_password"
              name="re_new_password"
              value={formData.re_new_password}
              onChange={handleChange}
              error={errors.re_new_password}
              autoComplete="new-password"
              showStrengthMeter={false}
            />

            <div className="col-span-full">
              <Button
                type="submit"
                variant="solid"
                color="blue"
                className="w-full"
                disabled={isLoading}
              >
                <span>{t('resetPasswordConfirm.submitButton')}</span>
              </Button>
            </div>

            {/* Message de confirmation en bas */}
            {isSuccess && (
              <GeneralMessage type="success" message={t('resetPasswordConfirm.successMessage')} />
            )}
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default ResetPasswordConfirmPage;
