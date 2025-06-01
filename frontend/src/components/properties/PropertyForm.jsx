import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { createProperty } from '../../features/properties/propertiesSlice';
import FormField from '../FormField';
import SelectField from '../SelectField';
import SubmitButton from '../SubmitButton';
import Modal from '../shared/Modal';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import Spinner from '@/components/Spinner';
import GeneralMessage from '@/components/GeneralMessage';
import { FiHome, FiMapPin, FiLayout, FiXCircle } from 'react-icons/fi';

const libraries = ['places'];

const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
  { value: 'one_bedroom', label: '1 Bedroom' },
  { value: 'two_bedrooms', label: '2 Bedrooms' },
  { value: 'three_bedrooms', label: '3 Bedrooms' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'other', label: 'Other' }
];

const LIVING_SPACE_TYPES = [
  { value: 'entire_property', label: 'Entire Property' },
  { value: 'private_room', label: 'Private Room' },
  { value: 'shared_room', label: 'Shared Room' }
];

const PropertyForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'studio',
    description: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    neighborhood: '',
    living_space_type: 'entire_property',
    bedroom_count: 1,
    bed_count: 1,
    bathroom_count: 1,
    max_guests: 2,
    has_private_bathroom: false,
    has_private_entrance: false
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('properties.errors.nameRequired');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('properties.errors.addressRequired');
    }
    
    if (!formData.city.trim()) {
      newErrors.city = t('properties.errors.cityRequired');
    }
    
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = t('properties.errors.postalCodeRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setFormData(prev => ({
          ...prev,
          address: place.formatted_address
        }));
      }
      
      // Extraire les informations détaillées
      const addressComponents = {
        city: '',
        postal_code: '',
        country: 'France',
        neighborhood: ''
      };
      
      place.address_components.forEach(component => {
        if (component.types.includes('locality')) {
          addressComponents.city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          addressComponents.postal_code = component.long_name;
        }
        if (component.types.includes('neighborhood')) {
          addressComponents.neighborhood = component.long_name;
        }
      });
      
      setFormData(prev => ({
        ...prev,
        ...addressComponents
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setGeneralError('');
    
    try {
      await dispatch(createProperty(formData)).unwrap();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create property:', error);
      setGeneralError(t('properties.errors.creationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (loadError) {
    return (
      <Modal isOpen={true} onClose={onSuccess} title={t('properties.addProperty')}>
        <GeneralMessage 
          type="error" 
          message={t('errors.googleMapsLoadError')} 
          onClose={onSuccess}
        />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onSuccess}
      title={t('properties.addProperty')}
      className="max-w-2xl"
    >
      <div className="relative">
        {/* Fond dégradé élégant */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-80 -z-10 rounded-xl"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {generalError && (
            <motion.div variants={itemVariants} className="mb-6">
              <GeneralMessage type="error" message={generalError} />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FiHome className="mr-2 text-blue-600" />
              {t('properties.addProperty')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('properties.addPropertyDescription')}
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            className="space-y-8"
            onSubmit={handleSubmit}
          >
            {/* Section Informations de base */}
            <motion.div 
              variants={sectionVariants}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiHome className="mr-2 text-blue-500" />
                {t('properties.mainInfo')}
              </h3>
              
              <div className="space-y-5">
                <FormField
                  label={t('properties.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={errors.name}
                  icon={<FiHome />}
                />
                
                <SelectField
                  label={t('properties.type')}
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={PROPERTY_TYPES}
                  required
                />

                <FormField
                  label={t('properties.description')}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  type="textarea"
                  rows={4}
                  placeholder={t('properties.descriptionPlaceholder')}
                />
              </div>
            </motion.div>

            {/* Section Localisation */}
            <motion.div 
              variants={sectionVariants}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2 text-blue-500" />
                {t('properties.location')}
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('properties.address')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={setAutocomplete}
                      onPlaceChanged={onPlaceSelected}
                      restrictions={{ country: 'fr' }}
                    >
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2.5 border ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}
                        placeholder={t('properties.addressPlaceholder')}
                      />
                    </Autocomplete>
                  ) : (
                    <div className="animate-pulse bg-gray-200 h-11 rounded-lg"></div>
                  )}
                  
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label={t('properties.city')}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    error={errors.city}
                  />

                  <FormField
                    label={t('properties.postalCode')}
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    error={errors.postal_code}
                  />
                </div>

                <FormField
                  label={t('properties.neighborhood')}
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder={t('properties.neighborhoodPlaceholder')}
                />
              </div>
            </motion.div>

            {/* Section Espace de vie */}
            <motion.div 
              variants={sectionVariants}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiLayout className="mr-2 text-blue-500" />
                {t('properties.livingSpace')}
              </h3>
              
              <div className="space-y-5">
                <SelectField
                  label={t('properties.livingSpaceType')}
                  name="living_space_type"
                  value={formData.living_space_type}
                  onChange={handleChange}
                  options={LIVING_SPACE_TYPES}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label={t('properties.bedroomCount')}
                    name="bedroom_count"
                    type="number"
                    min="1"
                    value={formData.bedroom_count}
                    onChange={handleChange}
                    required
                  />

                  <FormField
                    label={t('properties.bedCount')}
                    name="bed_count"
                    type="number"
                    min="1"
                    value={formData.bed_count}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label={t('properties.bathroomCount')}
                    name="bathroom_count"
                    type="number"
                    min="1"
                    value={formData.bathroom_count}
                    onChange={handleChange}
                    required
                  />

                  <FormField
                    label={t('properties.maxGuests')}
                    name="max_guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="flex items-center">
                    <input
                      id="private-bathroom"
                      name="has_private_bathroom"
                      type="checkbox"
                      checked={formData.has_private_bathroom}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="private-bathroom" className="ml-2 block text-sm text-gray-700">
                      {t('properties.hasPrivateBathroom')}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="private-entrance"
                      name="has_private_entrance"
                      type="checkbox"
                      checked={formData.has_private_entrance}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="private-entrance" className="ml-2 block text-sm text-gray-700">
                      {t('properties.hasPrivateEntrance')}
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={sectionVariants}
              className="flex justify-end space-x-3 pt-4"
            >
              <button
                type="button"
                onClick={onSuccess}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
              >
                <FiXCircle className="mr-2" />
                {t('common.cancel')}
              </button>
              
              <SubmitButton
                type="submit"
                isLoading={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {t('common.save')}
              </SubmitButton>
            </motion.div>
          </motion.form>
        </motion.div>
        
        {/* Overlay de chargement */}
        {isSubmitting && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 rounded-xl z-10">
            <Spinner loading={true} size="lg" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PropertyForm;