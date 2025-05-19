import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from '@/components/FormField';
import useForm from '@/hooks/useForm';
import Button from '@/components/Button';
import { login, reset, getUserInfo } from '@/features/auth/authSlice';
import Spinner from '@/components/Spinner';

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Sélectionne l'état global d'authentification
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  
  // Effet pour rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (user && user.access) {
      localStorage.setItem('userActiveSection', 'dashboard');
      dispatch(getUserInfo());
      navigate('/home');
    }
  }, [user, dispatch, navigate]);
  
  // Gestion des messages d'erreur et de succès
  useEffect(() => {
    if (isError) {
      if (message === 'INVALID_CREDENTIALS' || 
          message.includes('401') || 
          message.includes('unauthorized')) {
        toast.error(t('login.errors.invalidCredentials'));
        formMethods.setError('general', t('login.errors.invalidCredentials'));
      } else if (message === 'MISSING_FIELDS') {
        toast.error(t('login.errors.allFieldsRequired'));
        formMethods.setError('general', t('login.errors.allFieldsRequired'));
      } else {
        toast.error(message);
        formMethods.setError('general', message);
      }
      dispatch(reset());
    }
    
    if (isSuccess) {
      toast.success(t('login.successMessage'));
      formMethods.resetForm();
    }
  }, [isError, isSuccess, message, dispatch, t]);
  
  // Fonction de validation du formulaire
  const validateLoginForm = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = t('login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t('login.errors.emailInvalid');
    }
    
    if (!values.password || values.password.trim() === '') {
      errors.password = t('login.errors.passwordRequired');
    }
    
    return errors;
  };
  
  // Fonction de soumission du formulaire
  const handleLoginSubmit = async (values) => {
    const userData = {
      email: values.email,
      password: values.password.trim()
    };
    
    await dispatch(login(userData)).unwrap();
  };
  
  // Initialisation du hook useForm
  const formMethods = useForm(
    { email: '', password: '' },
    validateLoginForm,
    handleLoginSubmit
  );
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  // Obtenir le label correct du bouton en fonction de la langue
  const getSubmitButtonLabel = () => {
    return i18n.language === 'fr' 
      ? t('login.loginButton') 
      : t('login.submitButton');
  };
  
  return (
    <div className="relative">
      {/* Affichage du Spinner en cas de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
          <Spinner loading={isLoading} />
        </div>
      )}
      
      {/* Formulaire de connexion */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 grid grid-cols-1 gap-y-8" 
        onSubmit={formMethods.handleSubmit}
      >
        <FormField
          label={t('login.emailLabel')}
          name="email"
          type="email"
          autoComplete="email"
          value={formMethods.values.email}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.email}
          required
        />
        
        <FormField
          label={t('login.passwordLabel')}
          name="password"
          type="password"
          autoComplete="current-password"
          value={formMethods.values.password}
          onChange={formMethods.handleChange}
          onBlur={formMethods.handleBlur}
          error={formMethods.errors.password || formMethods.errors.general}
          showPasswordToggle
          required
        />
        
        <div>
          <Button 
            type="submit" 
            variant="solid" 
            color="blue" 
            className="w-full hover-scale tap-effect"
            disabled={isLoading}
          >
            {getSubmitButtonLabel()}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default LoginForm; 