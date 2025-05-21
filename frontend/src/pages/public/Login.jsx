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
import { login, reset, getProfile } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

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

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message, userInfo } = useSelector((state) => state.auth);
  const currentLanguage = i18n.language;

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
      if (message === 'INVALID_CREDENTIALS' || 
          message.includes('401') || 
          message.includes('no refresh token available') || 
          message.includes('unauthorized') || 
          message.includes('invalid')) {
        const errorMessage = t('login.errors.invalidCredentials');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
        setGeneralError('');
      } else if (message === 'MISSING_FIELDS') {
        const errorMessage = t('login.errors.allFieldsRequired');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
        setGeneralError('');
      } else if (message === 'SERVER_ERROR') {
        const errorMessage = t('login.errors.serverError');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
        setGeneralError('');
      } else if (message === 'NETWORK_ERROR') {
        setGeneralError(t('login.errors.networkError'));
        setErrors({});
      } else {
        toast.error(message);
        setErrors({
          general: message,
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
      
      setShowVerificationAlert(true);
      
      toast.info(t('login.verificationEmailSent'), {
        autoClose: 8000,
        position: "top-center"
      });
      
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
        await dispatch(login(userData)).unwrap();
        await dispatch(getProfile()).unwrap();
        // NE PAS naviguer ici
      } catch (error) {
        console.error('Login error:', error);
        toast.error(t('login.errors.loginFailed'));
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
              <CustomLink to="/register" className="font-medium text-blue-600 hover:underline">
                {currentLanguage === 'fr' ? t('login.createAccount') : t('login.registerLink')}
              </CustomLink>{' '}
              {t('login.forTrial')}
            </p>
          </motion.div>
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 mb-6 p-4 bg-red-600 text-white rounded-lg shadow-md relative"
            >
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
                <div>
                  <p className="font-medium">
                    {generalError}
                  </p>
                </div>
              </div>
            </motion.div>
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
        {showVerificationAlert && (
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
                <p className="font-medium">{t('login.verificationEmailSent')}</p>
                <button 
                  onClick={() => setShowVerificationAlert(false)} 
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
      </AuthLayout>
    </>
  );
};

export default Login;