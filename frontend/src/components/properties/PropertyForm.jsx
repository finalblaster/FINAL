import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { createProperty } from '../../features/properties/propertiesSlice';
import FormField from '../FormField';
import SubmitButton from '../SubmitButton';
import Modal from '../shared/Modal';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const PropertyType = {
  VILLA: 'villa',
  APARTMENT: 'apartment',
  STUDIO: 'studio',
  HOUSE: 'house',
  OTHER: 'other'
};

const PropertyForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: PropertyType.APARTMENT,
    address: '',
    surface_m2: '',
    floor: '',
    has_garden: false,
    has_balcony: false,
    is_accessible: false,
    description: '',
    wifi_name: '',
    access_code: ''
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setFormData(prev => ({
          ...prev,
          address: place.formatted_address
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(createProperty(formData)).unwrap();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <Modal isOpen={true} onClose={onSuccess} title={t('properties.addProperty')}>
        <div className="text-red-500">
          {t('errors.googleMapsLoadError')}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onSuccess}
      title={t('properties.addProperty')}
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
        onSubmit={handleSubmit}
      >
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Informations principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={t('properties.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white shadow-sm"
            />
            
            <FormField
              label={t('properties.type')}
              name="type"
              value={formData.type}
              onChange={handleChange}
              type="select"
              required
              className="bg-white shadow-sm"
              options={[
                { value: PropertyType.VILLA, label: t('properties.types.villa') },
                { value: PropertyType.APARTMENT, label: t('properties.types.apartment') },
                { value: PropertyType.STUDIO, label: t('properties.types.studio') },
                { value: PropertyType.HOUSE, label: t('properties.types.house') },
                { value: PropertyType.OTHER, label: t('properties.types.other') }
              ]}
            />
          </div>

          <div className="mt-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder={t('properties.addressPlaceholder')}
                />
              </Autocomplete>
            ) : (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={t('properties.surface')}
              name="surface_m2"
              value={formData.surface_m2}
              onChange={handleChange}
              type="number"
              required
              className="bg-white shadow-sm"
            />
            
            <FormField
              label={t('properties.floor')}
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              type="number"
              className="bg-white shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <FormField
              label={t('properties.hasGarden')}
              name="has_garden"
              type="checkbox"
              checked={formData.has_garden}
              onChange={handleChange}
              className="bg-white shadow-sm"
            />
            
            <FormField
              label={t('properties.hasBalcony')}
              name="has_balcony"
              type="checkbox"
              checked={formData.has_balcony}
              onChange={handleChange}
              className="bg-white shadow-sm"
            />
            
            <FormField
              label={t('properties.isAccessible')}
              name="is_accessible"
              type="checkbox"
              checked={formData.is_accessible}
              onChange={handleChange}
              className="bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Description</h3>
          <FormField
            label={t('properties.description')}
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            required
            className="bg-white shadow-sm"
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Informations pratiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={t('properties.wifiName')}
              name="wifi_name"
              value={formData.wifi_name}
              onChange={handleChange}
              className="bg-white shadow-sm"
            />
            
            <FormField
              label={t('properties.accessCode')}
              name="access_code"
              value={formData.access_code}
              onChange={handleChange}
              className="bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onSuccess}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <SubmitButton
            type="submit"
            isLoading={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            {t('common.save')}
          </SubmitButton>
        </div>
      </motion.form>
    </Modal>
  );
};

export default PropertyForm; 