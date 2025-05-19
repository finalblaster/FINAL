import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormField from '@/components/FormField';
import useForm from '@/hooks/useForm';
import Button from '@/components/Button';
import { register, reset } from '@/features/auth/authSlice';
import Spinner from '@/components/Spinner';
import { STORAGE_KEYS, DEFAULT_LANGUAGE } from '@/utils/config';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Sélectionne l'état global d'authentification
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  // Fonction de validation du formulaire
  const validateRegisterForm = (values) => {
    const errors = {};
    
    // Validation du prénom
    if (!values.first_name || values.first_name.trim() === '') {
      errors.first_name = t('register.errors.nameRequired');
    }
    
    // Validation du nom
    if (!values.last_name || values.last_name.trim() === '') {
      errors.last_name = t('register.errors.nameRequired');
    }
    
    // Validation de l'email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email) {
      errors.email = t('register.errors.emailRequired');
    } else if (!emailRegex.test(values.email)) {
      errors.email = t('register.errors.emailInvalid');
    }
    
    // Validation du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!values.password || values.password.trim() === '') {
      errors.password = t('register.errors.passwordRequired');
    } else if (values.password.trim().length < 8) {
      errors.password = t('register.errors.passwordLength');
    } else if (!passwordRegex.test(values.password.trim())) {
      errors.password = t('register.errors.passwordComplexity');
    }
    
    // Validation de la confirmation du mot de passe
    if (values.password.trim() !== values.re_password.trim()) {
      errors.re_password = t('register.errors.passwordsDoNotMatch');
    }
    
    return errors;
  };
  
  // Fonction de soumission du formulaire
  const handleRegisterSubmit = async (values) => {
    // Récupérer la langue actuelle
    const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
    
    // Créer l'objet userData avec la langue actuelle
    const userData = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email,
      password: values.password.trim(),
      re_password: values.re_password.trim(),
      language: currentLanguage
    };
    
    await dispatch(register(userData)).unwrap();
  };
  
  // Initialisation du hook useForm
  const formMethods = useForm(
    {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      re_password: '',
    },
    validateRegisterForm,
    handleRegisterSubmit
  );
  
  // Gestion des erreurs et succès
  useEffect(() => {
    if (isError) {
      if (message.includes('email already exists') || message.includes('email')) {
        toast.error(t('register.errors.serverErrors.emailExists'));
        formMethods.setError('email', t('register.errors.serverErrors.emailExists'));
      } else if (message.includes('Network Error')) {
        toast.error(t('register.errors.serverErrors.networkError'));
        formMethods.setError('general', t('register.errors.serverErrors.networkError'));
      } else {
        toast.error(t('register.errors.serverErrors.serverError'));
        formMethods.setError('general', t('register.errors.serverErrors.serverError'));
      }
      dispatch(reset());
    }
    
    if (isSuccess && user && !message.includes('email-verification')) {
      // Utiliser la langue stockée dans l'objet user (celle utilisée lors de l'inscription)
      const userLanguage = user.language || i18n.language || 'fr';
      
      navigate('/email-verification', { 
        state: { 
          email: formMethods.values.email,
          language: userLanguage
        } 
      });
      toast.success(t('register.successMessage'));
      formMethods.resetForm();
      dispatch(reset());
    }
  }, [isError, isSuccess, user, message, navigate, dispatch, t, i18n.language]);
  
  return (
    <div className="relative">
      {/* Affichage du Spinner en cas de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
          <Spinner loading={isLoading} />
        </div>
      )}
      
      {/* Formulaire d'inscription */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
        onSubmit={formMethods.handleSubmit}
      >
        <FormField
          label={t('register.firstNameLabel')}
          name="first_name"
          type="text"
          autoComplete="given-name"
          value={formMethods.values.first_name}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.first_name}
          required
        />
        
        <FormField
          label={t('register.lastNameLabel')}
          name="last_name"
          type="text"
          autoComplete="family-name"
          value={formMethods.values.last_name}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.last_name}
          required
        />
        
        <FormField
          className="col-span-full"
          label={t('register.emailLabel')}
          name="email"
          type="email"
          autoComplete="email"
          value={formMethods.values.email}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.email}
          required
        />
        
        {formMethods.errors.email && formMethods.errors.email.includes(t('register.errors.serverErrors.emailExists')) && (
          <motion.div 
            className="col-span-full -mt-2 mb-1"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <p className="text-xs font-medium text-red-600">
              {t('register.errors.serverErrors.emailExists')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('youCan')}{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                {t('logIn')}
              </a>
              {' '}{t('or')}{' '}
              <a href="/reset-password" className="text-blue-600 hover:underline">
                {t('resetPassword')}
              </a>
            </p>
          </motion.div>
        )}
        
        <FormField
          className="col-span-full"
          label={t('register.passwordLabel')}
          name="password"
          type="password"
          autoComplete="new-password"
          value={formMethods.values.password}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.password}
          showPasswordToggle
          required
        />
        
        <FormField
          className="col-span-full"
          label={t('register.confirmPasswordLabel')}
          name="re_password"
          type="password"
          autoComplete="new-password"
          value={formMethods.values.re_password}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.re_password}
          showPasswordToggle
          required
        />
        
        <div className="col-span-full">
          <Button 
            type="submit" 
            variant="solid" 
            color="blue" 
            className="w-full hover-scale tap-effect"
            disabled={isLoading}
          >
            {t('register.submitButton')}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default RegisterForm; 