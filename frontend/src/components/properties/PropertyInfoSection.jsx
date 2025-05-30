import React, { useState } from 'react';
import { 
  AlertTriangle, 
  InfoIcon, 
  Plus, 
  Trash2, 
  Calendar, 
  X, 
  Check 
} from 'lucide-react';
import AlertInfo from '../shared/AlertInfo';

/**
 * Composant pour afficher et gérer les informations temporaires importantes
 * Avec un bouton simple pour supprimer et un formulaire d'ajout expansible
 */
const PropertyInfoSection = ({ infoItems = [], onAddInfo, onDeleteInfo, propertyId }) => {
  // État pour gérer l'affichage du formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  
  // États pour le formulaire
  const [newInfo, setNewInfo] = useState({
    title: '',
    content: '',
    type: 'info' // Par défaut: info (alternatives: warning, danger)
  });

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setNewInfo({
      title: '',
      content: '',
      type: 'info'
    });
    setShowAddForm(false);
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = () => {
    if (newInfo.title.trim() && newInfo.content.trim()) {
      onAddInfo(propertyId, newInfo);
      resetForm();
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aucune information présente
  if (!infoItems || infoItems.length === 0) {
    return (
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-medium text-slate-800 flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 mr-3 shadow-sm border border-blue-300">
              <InfoIcon className="h-4 w-4 text-blue-600" />
            </div>
            Informations temporaires
          </h4>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm text-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Ajouter
          </button>
        </div>

        {!showAddForm ? (
          <div className="text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <div className="bg-blue-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-200">
              <InfoIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Aucune information temporaire visible par les locataires
            </p>
          </div>
        ) : (
          <AddInfoForm 
            info={newInfo}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-5 border-b border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-medium text-slate-800 flex items-center">
          <div className="p-2 rounded-lg bg-amber-100 mr-3 shadow-sm border border-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          Informations temporaires
        </h4>
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-700">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">
              {infoItems.length} information{infoItems.length > 1 ? 's' : ''} visible{infoItems.length > 1 ? 's' : ''}
            </span>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm text-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Afficher le formulaire d'ajout si activé */}
      {showAddForm && (
        <div className="mb-4">
          <AddInfoForm 
            info={newInfo}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>
      )}

      <div className="space-y-3">
        {infoItems.map((info) => (
          <InfoItem 
            key={info.id} 
            info={info} 
            onDelete={() => onDeleteInfo && onDeleteInfo(propertyId, info.id)} 
          />
        ))}
      </div>
    </div>
  );
};

// Composant pour le formulaire d'ajout d'information
const AddInfoForm = ({ info, onChange, onSubmit, onCancel }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-md">
      <h5 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle information temporaire
      </h5>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Type d'information</label>
          <div className="flex space-x-2">
            <label className={`flex items-center px-3 py-2 rounded-lg border ${info.type === 'info' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'} cursor-pointer`}>
              <input
                type="radio"
                name="type"
                value="info"
                checked={info.type === 'info'}
                onChange={onChange}
                className="hidden"
              />
              <InfoIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">Information</span>
            </label>
            
            <label className={`flex items-center px-3 py-2 rounded-lg border ${info.type === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600'} cursor-pointer`}>
              <input
                type="radio"
                name="type"
                value="warning"
                checked={info.type === 'warning'}
                onChange={onChange}
                className="hidden"
              />
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">Alerte</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={info.title}
            onChange={onChange}
            placeholder="Ex: Travaux de maintenance"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
          <textarea
            name="content"
            value={info.content}
            onChange={onChange}
            placeholder="Décrivez l'information à partager avec les locataires..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 min-h-[80px]"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm"
        >
          <X className="h-4 w-4 mr-1.5 inline-block" />
          Annuler
        </button>
        <button
          onClick={onSubmit}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Check className="h-4 w-4 mr-1.5 inline-block" />
          Ajouter
        </button>
      </div>
    </div>
  );
};

// Composant pour un élément d'information
const InfoItem = ({ info, onDelete }) => {
  // Déterminer les styles basés sur le type
  const getTypeConfig = (type) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          variant: 'amber',
          label: 'Alerte'
        };
      case 'danger':
        return {
          icon: AlertTriangle,
          variant: 'red',
          label: 'Urgent'
        };
      case 'info':
      default:
        return {
          icon: InfoIcon,
          variant: 'blue',
          label: 'Information'
        };
    }
  };
  
  const typeConfig = getTypeConfig(info.type);
  const Icon = typeConfig.icon;

  return (
    <div className="relative transform hover:translate-y-[-2px] transition-all duration-300">
      <div className="absolute top-3 right-3 z-10">
        <button 
          className="p-1.5 bg-white rounded-full border border-slate-200 shadow-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
          onClick={onDelete}
          title="Supprimer cette information"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="absolute left-3 -top-2 z-10 px-2 py-0.5 bg-white rounded-full border border-slate-200 shadow-sm text-xs font-medium">
        <span className={`text-${typeConfig.variant}-600 flex items-center`}>
          <Icon className="h-3 w-3 mr-1" />
          {typeConfig.label}
        </span>
      </div>
      
      <AlertInfo
        icon={Icon}
        title={info.title}
        message={info.content}
        variant={typeConfig.variant}
      />
    </div>
  );
};

export default PropertyInfoSection; 