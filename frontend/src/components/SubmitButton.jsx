import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ClipLoader } from 'react-spinners';
import { HiCheck, HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * A button component that shows loading and success states for form submissions
 * @param {string} text - The button text in default state (overrides translation)
 * @param {string} errorText - Text to show on error (overrides translation)
 * @param {string} successText - Text to show on success (overrides translation)
 * @param {string} successMessage - Custom success message to display below button (overrides translation)
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler function
 * @param {boolean} isLoading - Control loading state from parent
 * @param {boolean} isSuccess - Control success state from parent
 * @param {boolean} isError - Control error state from parent
 * @param {string} errorMessage - Detailed error message to display below button on error
 * @param {string} variant - Button variant: 'solid' or 'outline' (default: 'solid')
 * @param {string} color - Button color theme (default: 'blue')
 * @param {boolean} useTranslations - Whether to use i18n translations (default: true)
 * @param {function} onResetRequest - Callback called after delay to notify parent to reset state
 * @param {number} resetDelay - Time in ms before button returns to default state (default: 3000)
 */
const SubmitButton = ({
  text,
  errorText,
  successText: customSuccessText,
  successMessage,
  className = '',
  onClick,
  isLoading: externalLoading,
  isSuccess: externalSuccess,
  isError: externalError,
  errorMessage,
  variant = 'solid',
  color = 'blue',
  useTranslations = true,
  onResetRequest,
  resetDelay = 3000,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  
  // Use translations or provided texts
  const defaultText = useTranslations ? t('submitButton.submit') : 'Submit';
  const defaultErrorText = useTranslations ? t('submitButton.error') : 'Error';
  const defaultSuccessText = useTranslations ? t('submitButton.success') : 'Success';
  
  // Final text values (custom props override translations)
  const finalText = text || defaultText;
  const finalErrorText = errorText || defaultErrorText;
  const finalSuccessText = customSuccessText || defaultSuccessText;
  
  // Internal state for standalone usage
  const [internalState, setInternalState] = useState('default');
  
  // State for error message display
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  
  // State for reset progress bar
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  
  // Determine actual state (using external if provided)
  const isControlled = externalLoading !== undefined || externalSuccess !== undefined || externalError !== undefined;
  const state = isControlled 
    ? (externalSuccess ? 'success' : (externalError ? 'error' : (externalLoading ? 'loading' : 'default')))
    : internalState;
  
  // Default click handler when not externally controlled
  const handleClick = async (e) => {
    if (!isControlled) {
      setInternalState('loading');
      
      try {
        // Execute the provided click handler if any
        if (onClick) {
          await onClick(e);
        }
        
        setInternalState('success');
        setShowProgressBar(true);
        setProgressWidth(100);
        
        // Reset after delay
        setTimeout(() => {
          setInternalState('default');
          setShowProgressBar(false);
          setProgressWidth(100);
        }, resetDelay);
      } catch (error) {
        setInternalState('error');
        console.error('SubmitButton error:', error);
        setShowProgressBar(true);
        setProgressWidth(100);
        
        // Reset after delay
        setTimeout(() => {
          setInternalState('default');
          setShowProgressBar(false);
          setProgressWidth(100);
        }, resetDelay);
      }
    } else if (onClick) {
      onClick(e);
    }
  };
  
  // Watch external state changes for controlled mode
  useEffect(() => {
    if (isControlled && (externalSuccess || externalError)) {
      setShowProgressBar(true);
      setProgressWidth(100);
    } else if (isControlled && !externalSuccess && !externalError) {
      setShowProgressBar(false);
      setProgressWidth(100);
    }
  }, [externalSuccess, externalError, isControlled]);
  
  // Animate progress bar
  useEffect(() => {
    let animationFrame;
    
    if (showProgressBar) {
      // Force browser to compute initial layout with width 100%
      animationFrame = requestAnimationFrame(() => {
        // Then schedule the width transition to 0
        setTimeout(() => {
          setProgressWidth(0);
        }, 10);
      });
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [showProgressBar]);
  
  // Manage error message display
  useEffect(() => {
    let timer;
    
    // Show error message when error state is active
    if (state === 'error') {
      setShowErrorMessage(true);
      
      // Hide error message after timeout
      timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, resetDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state, resetDelay]);
  
  // Base styles with original dimensions
  const baseStyles = 'group relative inline-flex items-center justify-between rounded-lg py-2 px-4 text-sm font-medium focus:outline-none transition-all duration-200 ease-in-out overflow-hidden';
  
  // Enhanced variant and color styles
  const variantStyles = {
    solid: {
      blue: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 active:text-blue-100',
      slate: 'bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-800 active:text-slate-200',
    },
    outline: {
      blue: 'ring-1 ring-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 bg-white',
      slate: 'ring-1 ring-slate-300 text-slate-700 hover:text-slate-900 hover:ring-slate-400 active:bg-slate-100 active:text-slate-600 bg-white',
    },
  };
  
  // Enhanced state styles - Keeping original colors for all states
  const stateStyles = {
    error: showErrorMessage ? variantStyles[variant][color] : variantStyles[variant][color],
    success: variantStyles[variant][color],
    loading: `${variantStyles[variant][color]} cursor-wait`
  };
  
  const buttonStyles = clsx(
    baseStyles,
    state === 'default' ? variantStyles[variant][color] : stateStyles[state] || variantStyles[variant][color],
    className
  );
  
  // Format error message
  const formatErrorMessage = (message) => {
    if (!message) return null;
    
    // Dictionnaire des codes d'erreur vers les messages traduits
    const errorCodeToTranslationKey = {
      // Erreurs de validation et de formulaire
      "MISSING_FIELDS": 'security.errors.allFieldsRequired',
      "VALIDATION_ERROR": 'security.errors.validationError',
      "PASSWORDS_DO_NOT_MATCH": 'security.errors.passwordsDoNotMatch',
      
      // Erreurs sur le mot de passe actuel
      "CURRENT_PASSWORD_INCORRECT": 'security.errors.currentPasswordIncorrect',
      
      // Erreurs sur le format du nouveau mot de passe
      "PASSWORD_TOO_SHORT": 'security.errors.passwordLength',
      "PASSWORD_INVALID": 'security.errors.passwordComplexity',
      
      // Erreurs d'autorisation
      "INVALID_CREDENTIALS": 'security.errors.invalidCredentials',
      "UNAUTHORIZED": 'security.errors.unauthorized',
      
      // Erreurs de serveur
      "SERVER_ERROR": 'security.errors.serverError',
      "NETWORK_ERROR": 'security.errors.networkError',
      
      // Email
      "EMAIL_ALREADY_EXISTS": 'security.errors.emailAlreadyExists',
      
      // Erreur par défaut
      "UNKNOWN_ERROR": 'security.errors.unknownError'
    };
    
    console.log("Formatage du message d'erreur:", message);
    
    // Première vérification: si c'est un code d'erreur directement reconnu
    if (typeof message === 'string' && errorCodeToTranslationKey[message]) {
      console.log(`Message d'erreur reconnu: ${message} -> ${errorCodeToTranslationKey[message]}`);
      return t(errorCodeToTranslationKey[message]);
    }
    
    // Si c'est une erreur de type "UNKNOWN_ERROR: ..." qui contient des informations JSON
    if (typeof message === 'string' && message.startsWith('UNKNOWN_ERROR:')) {
      // Extraire et analyser l'erreur JSON si possible
      try {
        const jsonPart = message.substring('UNKNOWN_ERROR:'.length).trim();
        if (jsonPart.startsWith('{')) {
          const errorData = JSON.parse(jsonPart);
          
          // Vérifier si current_password est présent, c'est probablement un mot de passe incorrect
          if (errorData.current_password) {
            console.log("Erreur de mot de passe incorrecte détectée dans l'objet JSON");
            return t('security.errors.currentPasswordIncorrect');
          }
        }
      } catch (e) {
        // Ignorer les erreurs de parsing
        console.log("Impossible de parser l'erreur JSON:", e);
      }
      
      // Par défaut pour les erreurs inconnues
      return t('security.errors.unknownError');
    }
    
    // Si c'est un objet directement, essayer de détecter des erreurs connues
    if (typeof message === 'object' && message !== null) {
      if (message.current_password) {
        console.log("Erreur de mot de passe incorrecte détectée dans l'objet d'erreur");
        return t('security.errors.currentPasswordIncorrect');
      }
    }
    
    // Dernier recours: erreur inconnue
    console.log("Message d'erreur non reconnu, utilisation du message par défaut");
    return t('security.errors.unknownError');
  };
  
  return (
    <div className="flex flex-col items-start w-full">
      <motion.button
        className={buttonStyles}
        onClick={handleClick}
        disabled={state === 'loading'}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        initial={{ opacity: 0.9 }}
        animate={
          showErrorMessage && state === 'error' 
            ? {
                opacity: 1,
                x: [0, -5, 5, -5, 5, 0],
                transition: { 
                  duration: 0.5, 
                  ease: "easeInOut",
                  opacity: { duration: 0.2 }
                }
              } 
            : {
                opacity: 1,
                transition: { duration: 0.2 }
              }
        }
        {...props}
      >
        <div className="flex w-full items-center justify-between px-2">
          <span className="font-medium text-left">
            {state === 'success' ? finalSuccessText : (showErrorMessage && state === 'error' ? finalErrorText : finalText)}
          </span>
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center ml-3">
            {state === 'loading' && (
              <ClipLoader
                size={16}
                color="currentColor"
              />
            )}
            
            {state === 'success' && (
              <motion.div 
                key="success"
                className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <HiCheck className="h-3 w-3 text-white" />
              </motion.div>
            )}
            
            {showErrorMessage && state === 'error' && (
              <motion.div 
                key="error"
                className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <HiX className="h-3 w-3 text-white" />
              </motion.div>
            )}
            
            {state === 'default' && (
              <ArrowRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2} />
            )}
          </div>
        </div>
        
        {/* Progress bar with dark blue color */}
        {showProgressBar && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-black bg-opacity-10">
            <motion.div 
              className="h-full bg-blue-700"
              style={{ 
                width: `${progressWidth}%`,
                transition: `width ${resetDelay}ms linear`
              }}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </motion.button>
      
      <AnimatePresence>
        {state === 'success' && (
          <motion.div 
            className="text-sm text-green-600 w-full flex items-center mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-green-600"
              viewBox="0 0 20 20" 
              fill="currentColor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </motion.svg>
            <span>{successMessage || t('security.passwordUpdatedSuccess')}</span>
          </motion.div>
        )}
        
        {showErrorMessage && state === 'error' && errorMessage && (
          <motion.div 
            className="text-sm text-red-600 w-full flex items-center mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-red-600"
              viewBox="0 0 20 20" 
              fill="currentColor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </motion.svg>
            <span>{formatErrorMessage(errorMessage)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitButton; 