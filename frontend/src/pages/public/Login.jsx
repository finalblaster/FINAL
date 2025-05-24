import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import FormField from '@/components/FormField';
import PasswordField from '@/components/PasswordField';
import Logo from '@/components/Logo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@/components/Spinner';
import { login, reset, getProfile, resendVerification } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';
import GeneralMessage from '@/components/GeneralMessage';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const location = useLocation();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showActivationSent, setShowActivationSent] = useState(false);

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message, userInfo } = useSelector((state) => state.auth);
  const currentLanguage = i18n.language;

  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Appliquer la langue stockée ou celle par défaut
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    
    if (savedLanguage) {
      console.log('Restauration de la langue sauvegardée:', savedLanguage);
      changeLanguage(savedLanguage);
    } else {
      console.log('Aucune langue sauvegardée, utilisation de la langue par défaut:', DEFAULT_LANGUAGE);
      changeLanguage(DEFAULT_LANGUAGE);
    }
  }, [changeLanguage]);

  useEffect(() => {
    if (isError) {
      if (message === 'INACTIVE_ACCOUNT') {
        // Compte inactif, montrer l'alerte de vérification avec bouton de renvoi
        setShowVerificationAlert(true);
        setVerificationEmail(email);
        setShowActivationSent(false);
      } else if (message === 'INVALID_CREDENTIALS' || 
          message.includes('401') || 
          message.includes('no refresh token available') || 
          message.includes('unauthorized') || 
          message.includes('invalid') ||
          message.includes('Aucun compte') ||
          message.includes('not found')) {
        setErrors({
          email: t('login.errors.invalidCredentials'),
          password: t('login.errors.invalidCredentials')
        });
        setGeneralError('');
      } else if (message === 'MISSING_FIELDS') {
        const errorMessage = t('login.errors.allFieldsRequired');
        setErrors({
          email: errorMessage,
          password: errorMessage
        });
        setGeneralError('');
      } else if (message === 'SERVER_ERROR') {
        const errorMessage = t('login.errors.serverError');
        setErrors({
          email: errorMessage,
          password: errorMessage
        });
        setGeneralError('');
      } else if (message === 'NETWORK_ERROR') {
        setGeneralError(t('login.errors.networkError'));
        setErrors({});
      } else {
        // Message d'erreur générique pour tous les autres cas
        const errorMessage = t('login.errors.invalidCredentials');
        setErrors({
          email: errorMessage,
          password: errorMessage
        });
        setGeneralError('');
      }
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(t('login.successMessage'));
      setFormData({ email: '', password: '' });
      setGeneralError('');
    }
  }, [isError, isSuccess, message, dispatch, t]);

  // Vérifier si l'utilisateur vient de s'inscrire
  useEffect(() => {
    if (location.state?.fromRegister) {
      if (location.state.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
      
      setShowActivationSent(true);
      setShowVerificationAlert(false);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, t]);

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: valueWithoutSpaces,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleClick = (e, to) => {
    if (to && to.startsWith('#')) {
      e.preventDefault();
      
      const targetId = to.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const yOffset = -80; 
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset + 90;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        email: email.replace(/\s/g, ''),
        password: password.trim(),
      };
      try {
        console.log('Tentative de login, userData:', userData);
        // 1. Vérifier l'état du compte
        const response = await fetch(`${API_BASE}/api/v1/auth/users/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': currentLanguage
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        console.log('Réponse /users/login/', response.status, data);

        if (data.status === 'INACTIVE_ACCOUNT') {
          setShowVerificationAlert(true);
          setVerificationEmail(userData.email);
          return;
        }

        // 2. Si le compte est actif, procéder à l'authentification JWT
        if (response.ok || data.detail === "Veuillez utiliser l'endpoint JWT pour l'authentification.") {
          const jwtResp = await dispatch(login(userData)).unwrap();
          console.log('Réponse /jwt/create/', jwtResp);
          await dispatch(getProfile()).unwrap();
          setGeneralError('');
        } else {
          // Gérer l'erreur d'authentification
          setErrors({
            email: t('login.errors.invalidCredentials'),
            password: t('login.errors.invalidCredentials')
          });
        }
      } catch (error) {
        console.error('Erreur lors du login:', error);
        setErrors({
          email: t('login.errors.invalidCredentials'),
          password: t('login.errors.invalidCredentials')
        });
      }
    }
  };

  const handleResendVerification = async () => {
    if (verificationEmail && !isResendingEmail) {
      setIsResendingEmail(true);
      try {
        await dispatch(resendVerification({ 
          email: verificationEmail,
          language: currentLanguage
        })).unwrap();
        toast.success(t('login.verificationEmailResent'), {
          position: "top-center",
          autoClose: 5000
        });
        setShowVerificationAlert(false);
        setShowActivationSent(true);
      } catch (error) {
        toast.error(t('login.errors.resendFailed'), {
          position: "top-center",
          autoClose: 5000
        });
        console.error('Error resending verification:', error);
      } finally {
        setIsResendingEmail(false);
      }
    }
  };

  // Redirige dès que userInfo est bien chargé
  useEffect(() => {
    if (user && userInfo && userInfo.email) {
      navigate('/home');
    }
  }, [user, userInfo, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const cleanEmail = email.replace(/\s/g, '');
    if (!cleanEmail) {
      newErrors.email = t('login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      newErrors.email = t('login.errors.emailInvalid');
    }
    if (!password.trim()) {
      newErrors.password = t('login.errors.passwordRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const CustomLink = ({ to, children, className }) => (
    <Link 
      to={to} 
      className={className}
      onClick={(e) => handleClick(e, to)}
    >
      {children}
    </Link>
  );

  const getSubmitButtonLabel = () => {
    if (currentLanguage === 'fr') {
      return t('login.loginButton');
    }
    return t('login.submitButton');
  };

  return (
    <>
      <Helmet>
        <title>{t('login.pageTitle')}</title>
      </Helmet>
      <AuthLayout>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <motion.div variants={itemVariants}>
            <CustomLink to="/" aria-label="Home">
              <Logo className="h-10 w-auto hover-scale" />
            </CustomLink>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">{t('login.title')}</h2>
            <p className="mt-2 text-sm text-gray-700">
              {currentLanguage === 'fr' ? t('login.subtitle') : t('login.noAccount')}{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                {currentLanguage === 'fr' ? t('login.createAccount') : t('login.registerLink')}
              </Link>{' '}
              {t('login.forTrial')}
            </p>
          </motion.div>
          {generalError && (
            <GeneralMessage type="error" message={generalError} />
          )}
          {showVerificationAlert && (
            <div className="mt-6">
              <GeneralMessage
                type="info"
                onClose={() => setShowVerificationAlert(false)}
                message={
                  <>
                    {t('login.accountNotVerified')}{' '}
                    <span
                      onClick={!isResendingEmail ? handleResendVerification : undefined}
                      style={{
                        color: '#fff',
                        textDecoration: 'underline',
                        cursor: isResendingEmail ? 'not-allowed' : 'pointer',
                        opacity: isResendingEmail ? 0.6 : 1,
                        marginLeft: 4,
                      }}
                      tabIndex={0}
                      role="button"
                      aria-disabled={isResendingEmail}
                    >
                      {t('login.resendVerificationEmail')}
                    </span>
                  </>
                }
              />
            </div>
          )}
          {showActivationSent && (
            <GeneralMessage
              type="success"
              onClose={() => setShowActivationSent(false)}
              message={t('login.verificationEmailSentWithSpam')}
            />
          )}
        </motion.div>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
              <Spinner loading={isLoading} />
            </div>
          )}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 grid grid-cols-1 gap-y-8" 
            onSubmit={handleSubmit}
          >
            <FormField
              label={t('login.emailLabel')}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              value={email}
              error={errors.email}
              placeholder=""
            />
            <div>
              <PasswordField
                label={t('login.passwordLabel')}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                error={errors.password || errors.general}
                autoComplete="current-password"
                showStrengthMeter={false}
              />
            </div>
            <div>
              <Button type="submit" variant="solid" color="blue" className="w-full hover-scale tap-effect">
                {getSubmitButtonLabel()}
              </Button>
            </div>
          </motion.form>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-center"
        >
          <CustomLink to="/reset-password" className="font-medium text-blue-600 hover:underline">
            {t('login.forgotPassword')}
          </CustomLink>
        </motion.div>
      </AuthLayout>
    </>
  );
};

export default Login;