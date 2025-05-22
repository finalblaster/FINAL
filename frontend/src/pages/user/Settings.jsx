import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, CreditCard, Check, Eye, EyeOff, AlertCircle, Camera, Upload, Trash2, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection, changePassword, reset, getProfile, updateProfile, changeEmail, uploadProfileImage, removeProfileImage } from '@/features/auth/authSlice';
import { changeAppLanguage } from '@/components/LanguageSelector';
import { SUPPORTED_LANGUAGES, STORAGE_KEYS, API_BASE_URL, DEFAULT_LANGUAGE } from '@/utils/config';
import Flag from 'react-world-flags';
import PageHeader from '../../components/PageHeader';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/FormField';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [phone, setPhone] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Define tabs at the top
  const tabs = [
    { id: 'profile', name: t('tabs.profile'), icon: User },
    { id: 'security', name: t('tabs.security'), icon: Lock },
    { id: 'notifications', name: t('tabs.notifications'), icon: Bell },
    { id: 'billing', name: t('tabs.billing'), icon: CreditCard },
    { id: 'language', name: t('tabs.language'), icon: Globe },
  ];
  
  // Effet pour s'assurer que l'onglet commence toujours sur 'profile' quand le composant se monte
  useEffect(() => {
    setActiveTab('profile');
    
    // Réinitialiser tous les états liés au mot de passe
    setPasswordData({
      current_password: '',
      new_password: '',
      re_new_password: ''
    });
    
    // Réinitialiser les états liés à l'email
    setEmailData({
      new_email: '',
      re_new_email: '',
      current_password: ''
    });
    
    // Réinitialiser les erreurs du formulaire de mot de passe
    setPasswordErrors({
      current_password: '',
      new_password: '',
      re_new_password: '',
      general: ''
    });
    
    // Réinitialiser les erreurs du formulaire d'email
    setEmailErrors({
      new_email: '',
      re_new_email: '',
      current_password: '',
      general: ''
    });
    
    // Réinitialiser l'état de soumission du formulaire
    setFormState({
      submitted: false,
      hasError: false,
      errorMessage: ''
    });
    
    // Réinitialiser l'état du formulaire de mot de passe
    setPasswordFormState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    // Réinitialiser l'état du formulaire d'email
    setEmailFormState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    // Réinitialiser l'état Redux si nécessaire
    if (isSuccess || isError) {
      dispatch(reset());
    }
  }, []);
  
  // État pour le formulaire de profil
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // État pour les erreurs de validation du profil
  const [profileErrors, setProfileErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    general: ''
  });
  
  // État pour le formulaire de changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    re_new_password: ''
  });
  
  // État pour les erreurs de validation
  const [passwordErrors, setPasswordErrors] = useState({
    current_password: '',
    new_password: '',
    re_new_password: '',
    general: '',
  });
  
  // État pour afficher/masquer les mots de passe
  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false,
    re_new_password: false
  });
  
  // État pour suivre les résultats de soumission du formulaire
  const [formState, setFormState] = useState({
    submitted: false,
    hasError: false,
    errorMessage: ''
  });
  
  // État pour le formulaire de profil
  const [profileFormState, setProfileFormState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  });
  
  // État pour le formulaire de mot de passe (pour isoler le comportement du formulaire de sécurité)
  const [passwordFormState, setPasswordFormState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  });
  
  // État pour le formulaire de changement d'email
  const [emailData, setEmailData] = useState({
    new_email: '',
    re_new_email: '',
    current_password: ''
  });
  
  // État pour les erreurs de validation de l'email
  const [emailErrors, setEmailErrors] = useState({
    new_email: '',
    re_new_email: '',
    current_password: '',
    general: ''
  });
  
  // État pour le formulaire d'email
  const [emailFormState, setEmailFormState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  });
  
  // Récupération de l'état d'authentification
  const { isLoading, isError, isSuccess, message, userInfo, user } = useSelector(state => state.auth);
  
  // Effet pour charger les données utilisateur au chargement du composant
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  
  // Effet pour mettre à jour le formulaire avec les données utilisateur
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        firstName: userInfo.first_name || '',
        lastName: userInfo.last_name || '',
        email: userInfo.email || ''
      });
      setPhone(userInfo.phone || '');
    }
  }, [userInfo]);
  
  // Effet pour gérer les résultats de mise à jour du profil
  useEffect(() => {
    if (isSuccess && message === "PROFILE_UPDATED") {
      setProfileFormState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: 'PROFILE_UPDATED'
      });
      toast.success(t('profile.successMessage'));
      
      // Réinitialiser après un certain temps
      setTimeout(() => {
        dispatch(reset());
        setProfileFormState(prev => ({
          ...prev,
          isSuccess: false
        }));
      }, 5000);
    }
    
    // Gérer le succès de la demande de changement d'email
    if (isSuccess && message === "EMAIL_VERIFICATION_SENT") {
      setEmailFormState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: 'EMAIL_VERIFICATION_SENT'
      });
      
      // Réinitialiser le formulaire
      setEmailData({
        new_email: '',
        re_new_email: '',
        current_password: ''
      });
      
      // Toast avec les instructions à suivre
      toast.success(t('security.emailVerificationSent'));
      
      // Réinitialiser après un certain temps
      setTimeout(() => {
        dispatch(reset());
        setEmailFormState(prev => ({
          ...prev,
          isSuccess: false
        }));
      }, 5000);
    }
    
    // Gérer le succès de l'activation du changement d'email
    if (isSuccess && message === "EMAIL_CHANGE_ACTIVATED") {
      // Cet état ne sera jamais atteint dans ce composant
      // car l'activation se produit sur EmailActivatePage.jsx
      // Mais nous le gérons par précaution
      
      // Mettre à jour les informations utilisateur
      dispatch(getProfile());
      
      // Réinitialiser l'état Redux
      setTimeout(() => {
        dispatch(reset());
      }, 1000);
    }
    
    if (isError && activeTab === 'profile') {
      setProfileFormState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: message
      });
      toast.error(t('profile.errorMessage'));
    }
    
    // Gérer les erreurs du changement d'email
    if (isError && activeTab === 'security' && 
        (message === 'CURRENT_PASSWORD_INCORRECT' || 
         message === 'EMAIL_ALREADY_EXISTS' || 
         message === 'VALIDATION_ERROR')) {
      // Ces erreurs sont déjà traitées dans le catch du handleEmailSubmit
      // Réinitialiser simplement l'état Redux
      setTimeout(() => {
        dispatch(reset());
      }, 1000);
    }

    // Réinitialiser les états des formulaires lors d'une réinitialisation Redux
    if (message === "RESET") {
      setPasswordData({
        current_password: '',
        new_password: '',
        re_new_password: ''
      });
      
      setEmailData({
        new_email: '',
        re_new_email: '',
        current_password: ''
      });
      
      setPasswordErrors({
        current_password: '',
        new_password: '',
        re_new_password: '',
        general: ''
      });
      
      setEmailErrors({
        new_email: '',
        re_new_email: '',
        current_password: '',
        general: ''
      });
      
      setPasswordFormState({
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ''
      });
      
      setEmailFormState({
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ''
      });
    }
  }, [isSuccess, isError, message, activeTab, dispatch, t]);
  
  // État pour suivre si un changement d'email est en attente
  const [pendingEmailChange, setPendingEmailChange] = useState(null);
  
  // Récupérer l'état auth pour les changements d'email en attente
  const authState = useSelector(state => state.auth);
  
  // Effet pour vérifier si un changement d'email est en attente
  useEffect(() => {
    // Vérifier dans le state Redux s'il y a un changement en attente
    if (user && user.access && authState.pendingEmailChange) {
      setPendingEmailChange(authState.pendingEmailChange);
    } else {
      setPendingEmailChange(null);
    }
  }, [user, authState.pendingEmailChange]);
  
  // Fonction pour renvoyer l'email de vérification
  const handleResendVerification = async () => {
    if (!pendingEmailChange || !pendingEmailChange.email) return;
    
    try {
      // Afficher un toast de chargement
      const loadingToastId = toast.loading(t('security.resendingVerification'));
      
      // Appel à l'API pour renvoyer le lien de vérification
      const emailPayload = {
        new_email: pendingEmailChange.email,
        re_new_email: pendingEmailChange.email,
        current_password: '', // Mot de passe vide car il sera ignoré pour le renvoi
        resend: true // Indiquer qu'il s'agit d'un renvoi
      };
      
      await dispatch(changeEmail(emailPayload)).unwrap();
      
      // Fermer le toast de chargement et afficher un toast de succès
      toast.update(loadingToastId, {
        render: t('security.verificationResent'),
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error("Erreur lors du renvoi du lien de vérification:", error);
      toast.error(t('security.resendError'));
    }
  };
  
  // Liste des langues supportées
  const languages = SUPPORTED_LANGUAGES.map(lang => {
    // Obtenir le code ISO du pays à partir du code de langue
    const getCountryCode = (langCode) => {
      const countryMap = {
        en: 'US',
        fr: 'FR',
        es: 'ES',
        de: 'DE'
      };
      return countryMap[langCode] || langCode.toUpperCase();
    };

    return {
      ...lang,
      flag: getCountryCode(lang.code)
    };
  });

  // Met à jour selectedLanguage quand i18n.language change
  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    changeAppLanguage(langId);
  };
  
  // Basculer l'affichage du mot de passe
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Gestion du changement des champs de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Réinitialiser l'état du formulaire quand l'utilisateur commence à saisir
    setFormState({
      submitted: false,
      hasError: false,
      errorMessage: ''
    });
    
    // Effacer l'erreur lorsque l'utilisateur tape
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Gestion du changement des champs de profil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur tape
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Gestion du changement des champs d'email
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur tape
    if (emailErrors[name]) {
      setEmailErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validation du formulaire d'email
  const validateEmailForm = () => {
    const errors = {};
    let isValid = true;
    
    // Regex pour email plus strict
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Validation du nouvel email
    if (!emailData.new_email || emailData.new_email.trim() === '') {
      errors.new_email = t('security.errors.newEmailRequired');
      isValid = false;
    } else if (!emailRegex.test(emailData.new_email.trim())) {
      errors.new_email = t('security.errors.emailInvalid');
      isValid = false;
    } else if (emailData.new_email.trim().toLowerCase() === profileData.email.toLowerCase()) {
      errors.new_email = t('security.errors.emailSameAsCurrent');
      isValid = false;
    } else if (emailData.new_email.length > 255) {
      errors.new_email = t('security.errors.emailTooLong');
      isValid = false;
    }
    
    // Validation de la confirmation du nouvel email
    if (!emailData.re_new_email || emailData.re_new_email.trim() === '') {
      errors.re_new_email = t('security.errors.confirmEmailRequired');
      isValid = false;
    } else if (emailData.new_email !== emailData.re_new_email) {
      errors.re_new_email = t('security.errors.emailsDoNotMatch');
      isValid = false;
    }
    
    // Validation du mot de passe actuel
    if (!emailData.current_password || emailData.current_password.trim() === '') {
      errors.current_password = t('security.errors.currentPasswordRequired');
      isValid = false;
    }
    
    setEmailErrors(errors);
    return isValid;
  };
  
  // Gestion de la soumission du formulaire d'email
  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    
    console.log("Début de handleEmailSubmit");
    console.log("Données du formulaire:", emailData);
    
    // Indiquer que le formulaire est en cours de chargement
    setEmailFormState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    if (validateEmailForm()) {
      try {
        // Préparer les données pour l'API
        const emailPayload = {
          new_email: emailData.new_email.trim(),
          re_new_email: emailData.re_new_email.trim(),
          current_password: emailData.current_password,
          language: i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE
        };
        
        console.log("Envoi des données:", {
          ...emailPayload,
          current_password: "[MASQUÉ]"
        });
        
        // Vérifier si l'utilisateur est connecté et a un token
        if (!user || !user.access) {
          console.error("Utilisateur non connecté ou token manquant");
          toast.error(t('security.notAuthenticated'));
          setEmailFormState({
            isLoading: false,
            isSuccess: false,
            isError: true,
            message: 'NOT_AUTHENTICATED'
          });
          return;
        }
        
        // Dispatcher l'action Redux
        const result = await dispatch(changeEmail(emailPayload)).unwrap();
        
        console.log("Résultat de la demande de changement d'email:", result);
        
        // Mise à jour du formulaire en cas de succès
        // La réponse est différente maintenant car l'email n'est pas directement changé
        if (result && result.message === "EMAIL_VERIFICATION_SENT") {
          // Réinitialiser le formulaire
          setEmailData({
            new_email: '',
            re_new_email: '',
            current_password: ''
          });
          
          // Indiquer le succès de l'étape 1 (envoi d'email de vérification)
          setEmailFormState({
            isLoading: false,
            isSuccess: true,
            isError: false,
            message: 'EMAIL_VERIFICATION_SENT',
            pendingEmail: emailPayload.new_email
          });
          
          // Toast informant l'utilisateur de la prochaine étape
          toast.success(t('security.emailVerificationSent'));
        }
      } catch (error) {
        console.error("Erreur lors du changement d'email:", error);
        
        // Gestion spécifique des erreurs
        let errorMessage = 'UNKNOWN_ERROR';
        
        if (error === 'CURRENT_PASSWORD_INCORRECT') {
          setEmailErrors(prev => ({
            ...prev,
            current_password: t('security.errors.currentPasswordIncorrect')
          }));
          errorMessage = 'CURRENT_PASSWORD_INCORRECT';
        } else if (error === 'EMAIL_ALREADY_EXISTS') {
          setEmailErrors(prev => ({
            ...prev,
            new_email: t('security.errors.emailAlreadyExists')
          }));
          errorMessage = 'EMAIL_ALREADY_EXISTS';
        } else if (error === 'VALIDATION_ERROR') {
          errorMessage = 'VALIDATION_ERROR';
        } else if (error === 'NOT_AUTHENTICATED') {
          errorMessage = 'NOT_AUTHENTICATED';
        }
        
        setEmailFormState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: errorMessage
        });
        
        // Toast d'erreur
        toast.error(t('security.emailChangeError'));
      }
    } else {
      setEmailFormState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'VALIDATION_ERROR'
      });
    }
  };
  
  // Gestion du changement de téléphone
  const handlePhoneChange = (value) => {
    setPhone(value);
    
    // Effacer l'erreur de téléphone s'il y en a une
    if (profileErrors.phone) {
      setProfileErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };
  
  // Validation du formulaire de profil
  const validateProfileForm = () => {
    const errors = {};
    let isValid = true;
    
    // Validation du prénom
    if (!profileData.firstName || profileData.firstName.trim().length < 2) {
      errors.firstName = t('profile.errors.firstNameRequired');
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(profileData.firstName)) {
      errors.firstName = t('profile.errors.firstNameInvalid');
      isValid = false;
    }
    
    // Validation du nom
    if (!profileData.lastName || profileData.lastName.trim().length < 2) {
      errors.lastName = t('profile.errors.lastNameRequired');
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(profileData.lastName)) {
      errors.lastName = t('profile.errors.lastNameInvalid');
      isValid = false;
    }
    
    // Validation de l'email - Note: c'est le username_field donc on ne devrait pas permettre de le modifier facilement
    // Pour l'instant on garde la validation mais on pourrait désactiver ce champ
    if (!profileData.email || profileData.email.trim() === '') {
      errors.email = t('profile.errors.emailRequired');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = t('profile.errors.emailInvalid');
      isValid = false;
    }
    
    // Validation du téléphone
    if (!phone || phone.trim().length < 6) {
      errors.phone = t('profile.errors.phoneRequired');
      isValid = false;
    }
    
    setProfileErrors(errors);
    return isValid;
  };
  
  // Gestion de la soumission du formulaire de profil
  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Indiquer que le formulaire est en cours de chargement
    setProfileFormState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    if (validateProfileForm()) {
      // Préparer les données à envoyer à l'API
      const profilePayload = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: phone
      };
      
      // Dispatchez l'action Redux pour mettre à jour le profil
      try {
        await dispatch(updateProfile(profilePayload)).unwrap();
        // Le succès sera géré par l'useEffect qui surveille isSuccess et message
      } catch (error) {
        // En cas d'erreur non gérée par Redux
        setProfileFormState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: error.message || 'UNKNOWN_ERROR'
        });
        toast.error(t('profile.errorMessage'));
      }
    } else {
      // Validation échouée
      setProfileFormState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'VALIDATION_ERROR'
      });
    }
  };
  
  // Validation du formulaire de mot de passe
  const validatePasswordForm = () => {
    const errors = {};
    let isValid = true;
    
    // Vérification du mot de passe actuel
    if (!passwordData.current_password || passwordData.current_password.trim() === '') {
      errors.current_password = t('security.errors.currentPasswordRequired');
      isValid = false;
    }
    
    // Vérification du nouveau mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordData.new_password || passwordData.new_password.trim() === '') {
      errors.new_password = t('security.errors.newPasswordRequired');
      isValid = false;
    } else if (passwordData.new_password.trim().length < 8) {
      errors.new_password = t('security.errors.passwordLength');
      isValid = false;
    } else if (!passwordRegex.test(passwordData.new_password.trim())) {
      errors.new_password = t('security.errors.passwordComplexity');
      isValid = false;
    }
    
    // Vérification de la confirmation du mot de passe
    if (!passwordData.re_new_password || passwordData.re_new_password.trim() === '') {
      errors.re_new_password = t('security.errors.confirmPasswordRequired');
      isValid = false;
    } else if (passwordData.new_password !== passwordData.re_new_password) {
      errors.re_new_password = t('security.errors.passwordsDoNotMatch');
      isValid = false;
    }
    
    setPasswordErrors(errors);
    return isValid;
  };
  
  // Gestion de la soumission du formulaire de mot de passe
  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Mettre à jour l'état local du formulaire de mot de passe
    setPasswordFormState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    // Réinitialiser l'état du formulaire global
    setFormState({
      submitted: true,
      hasError: false,
      errorMessage: ''
    });
    
    // Récupérer la langue actuelle de l'utilisateur
    const currentLanguage = i18n.language || localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'fr';
    
    // Ajouter la langue aux données du formulaire
    const passwordDataWithLanguage = {
      ...passwordData,
      language: currentLanguage
    };
    
    // Debug - afficher les données du formulaire
    console.log("Données soumises:", passwordDataWithLanguage);
    console.log("Langue de l'utilisateur:", currentLanguage);
    
    if (validatePasswordForm()) {
      // Envoyer les données complètes, y compris re_new_password et language
      try {
        await dispatch(changePassword(passwordDataWithLanguage)).unwrap();
        setPasswordFormState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: ''
        });
        // Réinitialiser le formulaire
        setPasswordData({
          current_password: '',
          new_password: '',
          re_new_password: ''
        });
        setTimeout(() => {
          setPasswordFormState(prev => ({
            ...prev,
            isSuccess: false
          }));
        }, 10000);
      } catch (error) {
        console.log("Erreur capturée dans handlePasswordSubmit:", error);
        
        // Détection spécifique des erreurs liées au mot de passe incorrect
        let errorMessage = 'UNKNOWN_ERROR';
        
        // Pour les erreurs de type string simples
        if (typeof error === 'string') {
          errorMessage = error;
          
          // Vérifier spécifiquement pour le message de mot de passe incorrect
          if (error === 'CURRENT_PASSWORD_INCORRECT') {
            setPasswordErrors(prev => ({
              ...prev,
              current_password: t('security.errors.currentPasswordIncorrect')
            }));
          }
        } 
        // Pour les erreurs de type objet (comme celles renvoyées par l'API)
        else if (error && typeof error === 'object') {
          // Si l'erreur contient un message (format d'erreur standard)
          if (error.message) {
            errorMessage = error.message;
          }
          
          // Si l'erreur contient des données sur le mot de passe actuel
          if (error.current_password) {
            setPasswordErrors(prev => ({
              ...prev,
              current_password: t('security.errors.currentPasswordIncorrect')
            }));
            errorMessage = 'CURRENT_PASSWORD_INCORRECT';
          }
        }
        
        setPasswordFormState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: errorMessage
        });
        
        setFormState(prev => ({
          ...prev,
          hasError: true,
          errorMessage: errorMessage
        }));
      }
    } else {
      setPasswordFormState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        message: 'VALIDATION_ERROR'
      });
      setFormState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: 'VALIDATION_ERROR'
      }));
    }
  };
  
  // Effet pour gérer les réponses après le changement de mot de passe
  useEffect(() => {
    if (isError && message) {
      if (message === 'CURRENT_PASSWORD_INCORRECT') {
        setPasswordErrors(prev => ({
          ...prev,
          current_password: t('security.errors.currentPasswordIncorrect')
        }));
        setFormState({
          submitted: true,
          hasError: true,
          errorMessage: 'CURRENT_PASSWORD_INCORRECT'
        });
      } else if (message === 'VALIDATION_ERROR') {
        setFormState({
          submitted: true,
          hasError: true,
          errorMessage: 'VALIDATION_ERROR'
        });
      } else if (message === 'MISSING_FIELDS') {
        setFormState({
          submitted: true,
          hasError: true,
          errorMessage: 'MISSING_FIELDS'
        });
      } else {
        setFormState({
          submitted: true,
          hasError: true,
          errorMessage: message
        });
      }
      
      // Ne pas réinitialiser immédiatement l'état d'erreur pour que l'indicateur reste visible
      setTimeout(() => {
        dispatch(reset());
      }, 10000); // 10 secondes
    }
    
    if (isSuccess && activeTab === 'security') {
      // Mettre à jour l'état du formulaire pour afficher le succès
      setFormState({
        submitted: true,
        hasError: false,
        errorMessage: ''
      });
      
      // Réinitialiser le formulaire
      setPasswordData({
        current_password: '',
        new_password: '',
        re_new_password: ''
      });
      
      // Laisser l'état isSuccess actif pour l'indicateur visuel
      setTimeout(() => {
        dispatch(reset());
      }, 10000); // 10 secondes
    }
  }, [isError, isSuccess, message, dispatch, t, activeTab]);

  // Effet pour réinitialiser automatiquement l'état du formulaire après un certain temps
  useEffect(() => {
    if (formState.submitted) {
      const timer = setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          submitted: false
        }));
      }, 10000); // Réinitialiser après 10 secondes
      
      return () => clearTimeout(timer);
    }
  }, [formState.submitted]);

  // Fonction pour changer d'onglet
  const handleTabChange = (tabId) => {
    // Réinitialiser tous les états d'erreur lors du changement d'onglet
    setProfileErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      general: ''
    });
    
    setPasswordErrors({
      current_password: '',
      new_password: '',
      re_new_password: '',
      general: '',
    });
    
    setEmailErrors({
      new_email: '',
      re_new_email: '',
      current_password: '',
      general: ''
    });
    
    // Réinitialiser l'état du formulaire de mot de passe
    setPasswordFormState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: ''
    });

    // Réinitialiser l'état du formulaire d'email
    setEmailFormState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: ''
    });
    
    // Réinitialiser l'état du formulaire d'email
    setEmailData({
      new_email: '',
      re_new_email: '',
      current_password: ''
    });
    
    // Réinitialiser l'état du formulaire
    setFormState({
      submitted: false,
      hasError: false,
      errorMessage: ''
    });
    
    // Changer l'onglet
    setActiveTab(tabId);
  };

  // Function to toggle the delete account modal
  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
  };

  // Function to confirm account deletion
  const confirmDeleteAccount = () => {
    // This will be implemented later with the actual account deletion logic
    console.log("Account deletion confirmed");
    setShowDeleteModal(false);
    // Here you would add the actual API call to delete the account
  };

  // Function to cancel account deletion
  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };

  return (
    <div>
      <PageHeader 
        title={t('settings.title')} 
        subtitle={t('settings.subtitle')}
        icon={SettingsIcon}
      />
      
      <div className="bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar - Vertical on desktop */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
            {/* Horizontal tabs for mobile */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex flex-row p-2 whitespace-nowrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center p-3 rounded-lg mr-2 ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 mr-2 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Vertical tabs for desktop */}
            <nav className="hidden md:block p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center p-3 text-left rounded-lg mb-1 ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 mr-3 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('profile.title')}</h3>
                <motion.form 
                  className="space-y-2"
                  onSubmit={(e) => e.preventDefault()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Image Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.profileImage')}
                    </label>
                    <div className="flex items-end space-x-4">
                      <div className="relative group">
                        {userInfo?.profile_image && !imgError ? (
                          <img 
                            src={userInfo.profile_image.startsWith('http') ? userInfo.profile_image : `${API_BASE_URL}${userInfo.profile_image}`}
                            alt={`${userInfo.first_name} ${userInfo.last_name}`}
                            className="h-28 w-28 rounded-full object-cover border border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity"
                            onError={() => setImgError(true)}
                          />
                        ) : (
                          <div className="h-28 w-28 rounded-full bg-blue-50 flex items-center justify-center border border-gray-200 shadow-sm">
                            <UserCircle className="h-16 w-16 text-blue-400" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black bg-opacity-40 rounded-full h-28 w-28 flex items-center justify-center">
                            <label className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors">
                              <Camera className="h-5 w-5" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    // Check file size (2MB limit)
                                    if (file.size > 2 * 1024 * 1024) {
                                      toast.error(t('profile.imageSizeLimit'));
                                      return;
                                    }
                                    // Log pour debug
                                    console.log('UPLOAD IMAGE - file:', file, 'firstName:', profileData.firstName, 'lastName:', profileData.lastName, 'phone:', phone);
                                    console.log('profile_image:', userInfo?.profile_image, 'API_BASE_URL:', API_BASE_URL);
                                    dispatch(uploadProfileImage({
                                      imageFile: file,
                                      first_name: profileData.firstName,
                                      last_name: profileData.lastName,
                                      ...(phone && { phone })
                                    }))
                                      .unwrap()
                                      .then(() => {
                                        toast.success(t('profile.imageUploaded'));
                                        dispatch(getProfile());
                                      })
                                      .catch((error) => {
                                        toast.error(t('profile.imageUploadError'));
                                      });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-blue-600 mb-1">{t('profile.changeImage')}</p>
                          <p className="text-xs text-gray-500">{t('profile.imageSizeLimit')}</p>
                          <p className="text-xs text-gray-500">{t('profile.imageFormatSupport')}</p>
                        </div>
                        
                        {userInfo?.profile_image && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(t('profile.removeImage') + "?")) {
                                // Toujours utiliser userInfo pour les champs obligatoires
                                const first_name = userInfo?.first_name;
                                const last_name = userInfo?.last_name;
                                if (!first_name || !last_name) {
                                  toast.error('Impossible de supprimer l\'image : prénom ou nom manquant.');
                                  return;
                                }
                                const payload = {
                                  first_name,
                                  last_name,
                                  ...(phone && { phone })
                                };
                                console.log('Suppression image - payload:', payload);
                                dispatch(removeProfileImage(payload))
                                  .unwrap()
                                  .then(() => {
                                    toast.success(t('profile.imageRemoved'));
                                    setImgError(false);
                                    dispatch(getProfile());
                                  })
                                  .catch((error) => {
                                    console.error('Erreur suppression image (objet complet):', error);
                                    if (error.response && error.response.data) {
                                      const data = error.response.data;
                                      if (data.first_name) {
                                        data.first_name.forEach((msg, i) => {
                                          console.error(`Erreur backend first_name [${i}]:`, msg);
                                        });
                                      }
                                      if (data.last_name) {
                                        data.last_name.forEach((msg, i) => {
                                          console.error(`Erreur backend last_name [${i}]:`, msg);
                                        });
                                      }
                                    }
                                    toast.error(error);
                                  });
                              }
                            }}
                            className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('profile.removeImage')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormField
                      label={t('profile.firstName')}
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      error={profileErrors.firstName}
                      required
                    />
                    <FormField
                      label={t('profile.lastName')}
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      error={profileErrors.lastName}
                      required
                    />
                  </div>
                  <FormField
                    label={t('profile.email')}
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={profileErrors.email}
                    disabled={true}
                    readOnly={true}
                    helpText={t('profile.emailChangeInSecurity')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone')}</label>
                    <PhoneInput
                      country={'fr'}
                      value={phone}
                      onChange={handlePhoneChange}
                      inputStyle={{
                        width: '100%',
                        height: '42px',
                        fontSize: '16px',
                        borderRadius: '0.5rem',
                        borderColor: profileErrors.phone ? '#ef4444' : '#d1d5db'
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: '0.5rem',
                        borderBottomLeftRadius: '0.5rem',
                        borderColor: profileErrors.phone ? '#ef4444' : '#d1d5db'
                      }}
                      containerClass="phone-input-container"
                      dropdownStyle={{
                        width: '300px'
                      }}
                    />
                    <div className="h-4">
                      {profileErrors.phone && (
                        <motion.div 
                          className="w-full"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
                            {profileErrors.phone}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div>
                    <SubmitButton 
                      text={t('profile.saveChanges')}
                      isLoading={profileFormState.isLoading}
                      isSuccess={profileFormState.isSuccess}
                      isError={profileFormState.isError}
                      errorMessage={profileFormState.message}
                      errorText={t('submitButton.error')}
                      successText={t('profile.profileUpdated')}
                      successMessage={t('profile.profileUpdatedSuccess')}
                      onClick={handleProfileSubmit}
                      useTranslations={true}
                      className="w-auto rounded-md py-2 px-8 transition-all duration-200 shadow-sm hover:shadow font-medium"
                      variant="solid"
                      color="blue"
                      resetDelay={5000}
                    />
                    <div className="h-6"></div> {/* Extra space to prevent layout shifts */}
                  </div>
                </motion.form>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('security.title')}</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-2">{t('security.changePassword')}</h4>
                    <div className="relative">
                      <motion.form 
                        className="space-y-4 p-4 border border-gray-200 rounded-lg" 
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Ne pas appeler handlePasswordSubmit ici car il sera appelé par le SubmitButton
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormField
                          label={t('security.currentPassword')}
                          type="password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          error={passwordErrors.current_password}
                          showPasswordToggle
                          showPassword={showPasswords.current_password}
                          onTogglePassword={() => togglePasswordVisibility('current_password')}
                          required
                        />
                        <FormField
                          label={t('security.newPassword')}
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          error={passwordErrors.new_password}
                          showPasswordToggle
                          showPassword={showPasswords.new_password}
                          onTogglePassword={() => togglePasswordVisibility('new_password')}
                          required
                        />
                        <FormField
                          label={t('security.confirmPassword')}
                          type="password"
                          name="re_new_password"
                          value={passwordData.re_new_password}
                          onChange={handlePasswordChange}
                          error={passwordErrors.re_new_password}
                          showPasswordToggle
                          showPassword={showPasswords.re_new_password}
                          onTogglePassword={() => togglePasswordVisibility('re_new_password')}
                          required
                        />
                        <div>
                          {/* Bouton de soumission */}
                          <div className="flex justify-start">
                            <SubmitButton 
                              text={t('security.updatePassword')}
                              isLoading={passwordFormState.isLoading}
                              isSuccess={passwordFormState.isSuccess}
                              isError={passwordFormState.isError}
                              errorMessage={passwordFormState.message}
                              errorText={t('submitButton.passwordError')}
                              successText={t('security.passwordUpdated')}
                              successMessage={t('security.passwordUpdatedSuccess')}
                              onClick={handlePasswordSubmit}
                              useTranslations={true}
                              className="w-auto rounded-md py-2 px-8 transition-all duration-200 shadow-sm hover:shadow font-medium"
                              variant="solid"
                              color="blue"
                              resetDelay={10000}
                            />
                            <div className="h-6"></div> {/* Extra space to prevent layout shifts */}
                          </div>
                          
                          {/* Lien mot de passe oublié - visible uniquement quand le mot de passe actuel est incorrect */}
                          {(passwordErrors.current_password || (passwordFormState.isError && passwordFormState.message === 'CURRENT_PASSWORD_INCORRECT')) && (
                            <div className="mt-4 text-sm text-gray-600">
                              <a 
                                href="/reset-password" 
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {t('security.forgotPassword')} ?
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.form>
                    </div>
                  </div>

                  {/* Nouvelle section pour modifier l'adresse email */}
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-2">{t('security.changeEmail')}</h4>
                    <div className="relative">
                      <motion.form 
                        className="space-y-4 p-4 border border-gray-200 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <FormField
                          label={t('security.currentEmail')}
                          type="email"
                          value={profileData.email}
                          disabled={true}
                          readOnly={true}
                        />
                        
                        <FormField
                          label={t('security.newEmail')}
                          type="email"
                          name="new_email"
                          value={emailData.new_email}
                          onChange={handleEmailChange}
                          error={emailErrors.new_email}
                          required
                        />
                        
                        <FormField
                          label={t('security.confirmNewEmail')}
                          type="email"
                          name="re_new_email"
                          value={emailData.re_new_email}
                          onChange={handleEmailChange}
                          error={emailErrors.re_new_email}
                          required
                        />
                        
                        <FormField
                          label={t('security.currentPassword')}
                          type="password"
                          name="current_password"
                          value={emailData.current_password}
                          onChange={handleEmailChange}
                          error={emailErrors.current_password}
                          showPasswordToggle
                          showPassword={showPasswords.current_password}
                          onTogglePassword={() => togglePasswordVisibility('current_password')}
                          required
                        />
                        
                        <div className="flex justify-start">
                          <SubmitButton 
                            text={t('emailSubmitButton.submit')}
                            isLoading={emailFormState.isLoading}
                            isSuccess={emailFormState.isSuccess}
                            isError={emailFormState.isError}
                            errorMessage={emailFormState.message}
                            errorText={t('emailSubmitButton.error')}
                            successText={t('emailSubmitButton.success')}
                            successMessage={t('security.emailUpdatedSuccess')}
                            onClick={handleEmailSubmit}
                            useTranslations={true}
                            className="w-auto rounded-md py-2 px-8 transition-all duration-200 shadow-sm hover:shadow font-medium"
                            variant="solid"
                            color="blue"
                            resetDelay={5000}
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            }
                          />
                          <div className="h-6"></div> {/* Extra space to prevent layout shifts */}
                        </div>
                        
                        {/* Afficher le message de confirmation après le bouton */}
                        {pendingEmailChange && (
                          <div className="mt-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className="text-sm text-blue-700 font-medium">
                                  {t('security.pendingEmailChange')} - {pendingEmailChange.email}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {t('security.checkVerificationLink')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                          
                        {/* Lien mot de passe oublié - visible uniquement quand le mot de passe actuel est incorrect */}
                        {(emailErrors.current_password || (emailFormState.isError && emailFormState.message === 'CURRENT_PASSWORD_INCORRECT')) && (
                          <div className="mt-2 text-sm text-gray-600">
                            <a 
                              href="/reset-password" 
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {t('security.forgotPassword')} ?
                            </a>
                          </div>
                        )}
                      </motion.form>
                    </div>
                  </div>

                  {/* Section pour supprimer le compte - maintenant détachée et placée plus bas */}
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex justify-center">
                      <motion.div 
                        className="mt-4" 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button 
                          className="px-6 py-2.5 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm font-medium"
                          onClick={handleDeleteAccountClick}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('security.deleteAccountButton')}
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('language.title')}</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('language.chooseLang')}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between px-4 py-3 border rounded-lg ${
                          selectedLanguage === lang.code 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">
                            <Flag code={lang.flag} className="h-5 w-8 rounded-sm object-cover shadow-sm" />
                          </span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                        
                        {selectedLanguage === lang.code && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'profile' && activeTab !== 'security' && activeTab !== 'language' && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                {t('language.inDevelopment', { section: tabs.find(tab => tab.id === activeTab)?.name })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Styles personnalisés pour le sélecteur de téléphone */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .phone-input-container {
          width: 100%;
        }
        .phone-input-container .form-control {
          width: 100% !important;
          height: 42px !important;
          font-size: 16px !important;
          border-radius: 0.5rem !important;
        }
        .phone-input-container .selected-flag {
          border-top-left-radius: 0.5rem !important;
          border-bottom-left-radius: 0.5rem !important;
        }
        .phone-input-container .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25) !important;
        }
        `
      }} />
      
      {/* Modal de confirmation pour la suppression de compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-red-600 mb-4">{t('security.deleteAccount')}</h3>
              <p className="text-gray-700 mb-6">
                {t('security.deleteAccountWarning')}
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={cancelDeleteAccount}
                >
                  {t('common.cancel')}
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={confirmDeleteAccount}
                >
                  {t('security.deleteAccountButton')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings; 