import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import { TextField } from '@/components/Fields';
import Logo from '@/components/Logo';
import { register, reset } from '@/features/auth/authSlice';
import Spinner from '@/components/Spinner';
import { motion } from 'framer-motion';
import useLanguage from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/utils/config';

const Register = () => {
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

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

  const { first_name, last_name, email, password, re_password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      // Supprime tous les espaces pour l'email immédiatement
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
    // Réinitialiser l'erreur du champ modifié
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
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

  // Custom Link component that uses our handleClick function
  const CustomLink = ({ to, children, className }) => {
    // Function to smoothly scroll to an element with custom easing
    const smoothScrollTo = (targetY, duration) => {
      const startY = window.pageYOffset;
      const difference = targetY - startY;
      const startTime = performance.now();
      
      // Easing function: easeInOutQuad
      const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }
      
      const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const eased = easeInOutQuad(progress);
        
        window.scrollTo(0, startY + difference * eased);
        
        if (elapsedTime < duration) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    };

    const handleCustomClick = (e) => {
      // Ne traiter que les liens internes (ancres)
      if (to && to.startsWith('#')) {
        e.preventDefault();
        
        const targetId = to.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Position de l'élément avec offset
          const yOffset = -80; 
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset + 90;
          
          // Animation plus longue et plus fluide
          smoothScrollTo(y, 900);
        }
      }
    };

    return (
      <Link 
        to={to} 
        className={className}
        onClick={handleCustomClick}
      >
        {children}
      </Link>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!first_name.trim()) {
      newErrors.first_name = t('register.errors.nameRequired');
    }

    if (!last_name.trim()) {
      newErrors.last_name = t('register.errors.nameRequired');
    }

    const cleanEmail = email.replace(/\s/g, '');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail) {
      newErrors.email = t('register.errors.emailRequired');
    } else if (!emailRegex.test(cleanEmail)) {
      newErrors.email = t('register.errors.emailInvalid');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.trim()) {
      newErrors.password = t('register.errors.passwordRequired');
    } else if (password.trim().length < 8) {
      newErrors.password = t('register.errors.passwordLength');
    } else if (!passwordRegex.test(password.trim())) {
      newErrors.password = t('register.errors.passwordComplexity');
    }

    if (password.trim() !== re_password.trim()) {
      newErrors.re_password = t('register.errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm() && !isLoading) {
      // Capturer la langue actuelle
      const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE;
      
      // Ajouter un log pour vérifier la langue utilisée
      console.log(`Envoi du formulaire d'inscription avec la langue: ${currentLanguage}`);
      
      // Créer un objet userData avec la langue actuelle
      const userData = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.replace(/\s/g, ''), // Supprime tous les espaces au moment de l'envoi
        password: password.trim(),
        re_password: re_password.trim(),
        language: currentLanguage // Ajout de la langue actuelle
      };
      
      dispatch(register(userData));
      setErrors({});
    }
  };

  useEffect(() => {
    if (isError) {
      console.log('Error in Register component:', message);
      
      // Gestion des erreurs spécifiques du serveur
      if (message.includes('email already exists') || message.includes('email')) {
        toast.error(t('register.errors.serverErrors.emailExists'));
        setErrors(prev => ({
          ...prev,
          email: t('register.errors.serverErrors.emailExists')
        }));
      } else if (message.includes('Network Error')) {
        toast.error(t('register.errors.serverErrors.networkError'));
      } else if (message.includes('validation error')) {
        toast.error(t('register.errors.serverErrors.validationError'));
      } else if (message.includes('too many attempts')) {
        toast.error(t('register.errors.serverErrors.tooManyAttempts'));
      } else {
        toast.error(t('register.errors.serverErrors.serverError'));
      }
      dispatch(reset());
    }

    if (isSuccess) {
      // Utiliser la langue stockée dans l'objet user (celle utilisée lors de l'inscription)
      // ou à défaut la langue actuelle de l'interface
      const userLanguage = (user && user.language) || i18n.language || 'fr';
      
      console.log(`Registration successful, redirecting to login page`);
      
      // Réinitialiser le formulaire
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: '',
      });
      
      // Rediriger vers la page de login avec un message de succès
      toast.success(t('register.successMessage'));
      navigate('/login', { 
        state: { 
          fromRegister: true,
          email: formData.email 
        } 
      });
      
      dispatch(reset());
    }
  }, [isError, isSuccess, user, message, navigate, dispatch, t, i18n.language, formData.email]);

  return (
    <>
      <Helmet>
        <title>{t('register.pageTitle')}</title>
      </Helmet>

      <AuthLayout>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <motion.div variants={itemVariants}>
            <CustomLink to="/" aria-label="Accueil">
              <Logo className="h-10 w-auto hover-scale" />
            </CustomLink>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">{t('register.title')}</h2>
            <p className="mt-2 text-sm text-gray-700">
              {t('register.alreadyAccount')}{' '}
              <CustomLink to="/login" className="font-medium text-blue-600 hover:underline">
                {t('register.loginLink')}
              </CustomLink>
            </p>
          </motion.div>
        </motion.div>

        {/* Affichage conditionnel du Spinner et formulaire */}
        <div className="relative">
          {/* Overlay Spinner */}
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
            onSubmit={handleSubmit}
          >
            <TextField
              label={t('register.firstNameLabel')}
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              onChange={handleChange}
              value={first_name}
              error={errors.first_name}
              required
            />
            <TextField
              label={t('register.lastNameLabel')}
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              onChange={handleChange}
              value={last_name}
              error={errors.last_name}
              required
            />
            <TextField
              className="col-span-full"
              label={t('register.emailLabel')}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              value={email}
              error={errors.email && !errors.email.includes(t('register.errors.serverErrors.emailExists')) ? errors.email : ''}
              required
            />
            {errors.email && errors.email.includes(t('register.errors.serverErrors.emailExists')) && (
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
                  <Link to="/login" className="text-blue-600 hover:underline">
                    {t('logIn')}
                  </Link>
                  {' '}{t('or')}{' '}
                  <Link to="/reset-password" className="text-blue-600 hover:underline">
                    {t('resetPassword')}
                  </Link>
                </p>
              </motion.div>
            )}
            <TextField
              className="col-span-full"
              label={t('register.passwordLabel')}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
              value={password}
              error={errors.password}
              showPasswordToggle
              required
            />
            <TextField
              className="col-span-full"
              label={t('register.confirmPasswordLabel')}
              id="re_password"
              name="re_password"
              type="password"
              autoComplete="new-password"
              onChange={handleChange}
              value={re_password}
              error={errors.re_password}
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
                <span>{t('register.submitButton')}</span>
              </Button>
            </div>
          </motion.form>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;