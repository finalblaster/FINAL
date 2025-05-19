import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import { TextField } from '@/components/Fields';
import Logo from '@/components/Logo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '@/components/Spinner';
import { login, reset, getUserInfo } from '@/features/auth/authSlice';
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
  const location = useLocation();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const currentLanguage = i18n.language;

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

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user && user.access) {
      // Définir dashboard comme section active lors de la connexion, peu importe la section précédente
      localStorage.setItem('userActiveSection', 'dashboard');
      dispatch(getUserInfo());
      navigate('/home');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      // Gérer toutes les erreurs d'authentification
      if (message === 'INVALID_CREDENTIALS' || 
          message.includes('401') || 
          message.includes('no refresh token available') || 
          message.includes('unauthorized') || 
          message.includes('invalid')) {
        // Utiliser la clé de traduction pour le message d'erreur
        const errorMessage = t('login.errors.invalidCredentials');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
      } else if (message === 'MISSING_FIELDS') {
        const errorMessage = t('login.errors.allFieldsRequired');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
      } else if (message === 'SERVER_ERROR') {
        const errorMessage = t('login.errors.serverError');
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
      } else {
        // Autres types d'erreurs
        toast.error(message);
        setErrors({
          general: message,
        });
      }
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(t('login.successMessage'));
      setFormData({ email: '', password: '' });
    }
  }, [isError, isSuccess, message, dispatch, t]);

  // Vérifier si l'utilisateur vient de s'inscrire
  useEffect(() => {
    if (location.state?.fromRegister) {
      // Préremplir l'email si disponible
      if (location.state.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
      
      // Afficher l'alerte visuelle
      setShowVerificationAlert(true);
      
      // Afficher également un toast
      toast.info(t('login.verificationEmailSent'), {
        autoClose: 8000,
        position: "top-center"
      });
      
      // Nettoyer l'état de localisation pour éviter d'afficher le message à nouveau lors d'un rafraîchissement
      window.history.replaceState({}, document.title);
    }
  }, [location.state, t]);

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      // Supprime tous les espaces pour l'email immédiatement
      const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: valueWithoutSpaces,
      }));
    } else {
      // Pour le mot de passe, conserve la valeur telle quelle
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleClick = (e, to) => {
    // Ne traiter que les liens internes (ancres)
    if (to && to.startsWith('#')) {
      e.preventDefault();
      
      const targetId = to.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Position de l'élément avec offset
        const yOffset = -80; 
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset + 90;
        
        // Défilement
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        email: email, // Déjà sans espaces grâce au handleChange
        password: password.trim(), // On applique trim au mot de passe au moment de l'envoi
      };
      dispatch(login(userData));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = t('login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
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

  // Custom Link component that uses our handleClick function
  const CustomLink = ({ to, children, className }) => (
    <Link 
      to={to} 
      className={className}
      onClick={(e) => handleClick(e, to)}
    >
      {children}
    </Link>
  );

  // Get the correct button label based on the language
  const getSubmitButtonLabel = () => {
    // For French, use loginButton key
    if (currentLanguage === 'fr') {
      return t('login.loginButton');
    }
    // For other languages, use submitButton key
    return t('login.submitButton');
  };

  return (
    <>
      <Helmet>
        <title>{t('login.pageTitle')}</title>
      </Helmet>
      {/* Formulaire de connexion */}
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
          
          {/* Alerte de vérification d'email */}

          
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
        </motion.div>
        {/* Formulaire avec Overlay Spinner */}
        <div className="relative">
          {/* Affichage du Spinner si isLoading est vrai */}
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
              <Spinner loading={isLoading} />
            </div>
          )}
          {/* Formulaire qui sera masqué par le Spinner */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 grid grid-cols-1 gap-y-8" 
            onSubmit={handleSubmit}
          >
            <TextField
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
            <TextField
              label={t('login.passwordLabel')}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={password}
              error={errors.password || errors.general}
              showPasswordToggle
              placeholder=""
            />
            <div>
              <Button type="submit" variant="solid" color="blue" className="w-full hover-scale tap-effect">
                {getSubmitButtonLabel()}
              </Button>
            </div>
          </motion.form>
        </div>
        {/* Lien mot de passe oublié */}
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