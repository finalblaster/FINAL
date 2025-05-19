import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import FormField from '@/components/FormField';
import useForm from '@/hooks/useForm';
import { updateProfile } from '@/features/auth/authSlice';
import SubmitButton from '@/components/SubmitButton';

const SettingsProfileForm = ({ userInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Fonction de validation du formulaire
  const validateForm = (values) => {
    const errors = {};

    // Validation du prénom
    if (!values.firstName || values.firstName.trim().length < 2) {
      errors.firstName = t('profile.errors.firstNameRequired');
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(values.firstName)) {
      errors.firstName = t('profile.errors.firstNameInvalid');
    }
    
    // Validation du nom
    if (!values.lastName || values.lastName.trim().length < 2) {
      errors.lastName = t('profile.errors.lastNameRequired');
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(values.lastName)) {
      errors.lastName = t('profile.errors.lastNameInvalid');
    }
    
    // Validation de l'email
    if (!values.email || values.email.trim() === '') {
      errors.email = t('profile.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t('profile.errors.emailInvalid');
    }
    
    // Validation du téléphone
    if (!values.phone || values.phone.trim().length < 6) {
      errors.phone = t('profile.errors.phoneRequired');
    }

    return errors;
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (values) => {
    try {
      // Préparer les données à envoyer à l'API
      const profilePayload = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone
      };
      
      await dispatch(updateProfile(profilePayload)).unwrap();
      toast.success(t('profile.successMessage'));
      return true;
    } catch (error) {
      toast.error(t('profile.errorMessage'));
      throw error;
    }
  };

  // Initialiser le hook useForm avec les valeurs de l'utilisateur
  const initialValues = {
    firstName: userInfo?.first_name || '',
    lastName: userInfo?.last_name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || ''
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    isSubmitting
  } = useForm(initialValues, validateForm, handleSubmit);

  return (
    <motion.form 
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          label={t('profile.firstName')}
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          required
        />
        <FormField
          label={t('profile.lastName')}
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          required
        />
      </div>
      
      <FormField
        label={t('profile.email')}
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        disabled={true}
        readOnly={true}
        className="bg-gray-100"
        helperText={t('profile.emailChangeInSecurity')}
      />
      
      <FormField
        label={t('profile.phone')}
        name="phone"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        isPhone={true}
        required
      />
      
      <div>
        <SubmitButton 
          text={t('profile.saveChanges')}
          isLoading={isSubmitting}
          onClick={submitForm}
          useTranslations={true}
          className="w-auto rounded-md py-2 px-8 transition-all duration-200 shadow-sm hover:shadow font-medium"
          variant="solid"
          color="blue"
          resetDelay={5000}
        />
        <div className="h-6"></div> {/* Extra space to prevent layout shifts */}
      </div>
    </motion.form>
  );
};

export default SettingsProfileForm; 