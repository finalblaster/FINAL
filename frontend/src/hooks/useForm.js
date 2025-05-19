import { useState, useCallback } from 'react';
import { sanitizeFormData } from '@/utils/sanitize';

/**
 * Hook personnalisé pour la gestion des formulaires avec validation et assainissement
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Function} validateFunction - Fonction de validation
 * @param {Function} onSubmit - Fonction appelée lors de la soumission
 * @returns {Object} - Méthodes et propriétés pour gérer le formulaire
 */
const useForm = (initialValues = {}, validateFunction = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Gère les changements de valeurs dans le formulaire
   * @param {Event} e - Événement de changement
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));
    
    // Marque le champ comme touché
    if (!touched[name]) {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    }
    
    // Validation à la volée si une fonction de validation est fournie
    if (validateFunction) {
      const validationResult = validateFunction({
        ...values,
        [name]: fieldValue,
      });
      
      if (validationResult.errors && validationResult.errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validationResult.errors[name],
        }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [values, touched, validateFunction]);

  /**
   * Gère la perte de focus d'un champ
   * @param {Event} e - Événement blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    
    // Validation au blur si une fonction de validation est fournie
    if (validateFunction) {
      const validationResult = validateFunction(values);
      
      if (validationResult.errors && validationResult.errors[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validationResult.errors[name],
        }));
      }
    }
  }, [values, validateFunction]);

  /**
   * Réinitialise le formulaire à ses valeurs initiales
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = useCallback(async (e) => {
    e && e.preventDefault();
    
    // Marque tous les champs comme touchés
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validation
    let isValid = true;
    let validationErrors = {};
    
    if (validateFunction) {
      const validationResult = validateFunction(values);
      isValid = validationResult.isValid;
      validationErrors = validationResult.errors || {};
      setErrors(validationErrors);
    }
    
    if (isValid && onSubmit) {
      setIsSubmitting(true);
      
      try {
        // Assainit les données avant soumission
        const sanitizedValues = sanitizeFormData(values);
        await onSubmit(sanitizedValues);
      } catch (error) {
        console.error('Form submission error:', error);
        // Potentiellement, ajoutez l'erreur dans un état
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateFunction, onSubmit]);

  /**
   * Définit une valeur spécifique dans le formulaire
   * @param {string} name - Nom du champ
   * @param {any} value - Nouvelle valeur
   */
  const setValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValue,
    setValues,
  };
};

export default useForm; 