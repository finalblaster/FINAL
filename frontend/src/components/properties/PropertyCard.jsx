import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building, 
  Wifi, 
  Key, 
  Trees, 
  Home, 
  User,
  MapPin,
  Ruler,
  ArrowUp,
  Info,
  Edit,
  Bot,
  BookMarked,
  Image,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  LayoutGrid,
  List,
  Search
} from 'lucide-react';
import clsx from 'clsx';

// Importation des composants de base
import SectionBlock from '../shared/SectionBlock';
import PropertyInfoSection from './PropertyInfoSection';

// Importation des composants de la base de connaissances
import { KnowledgeBaseSection as OriginalKnowledgeBaseSection } from './KnowledgeBaseComponents';

// Importation des données de démonstration
import { mockInstructions } from './mockKnowledgeData';

/**
 * Wrapper pour KnowledgeBaseSection qui utilise le nouveau SectionBlock
 */
const KnowledgeBaseSection = ({ property, onAddInstruction, onUpdateInstruction, onDeleteInstruction }) => {
  return (
    <div className="mt-3">
      <SectionBlock 
        icon={BookMarked} 
        title="Base de connaissances" 
        subtitle={`${property.instructions ? property.instructions.length : 0} instructions`}
        theme="blue"
        expandable={true}
      >
        <OriginalKnowledgeBaseSection 
          property={property}
          onAddInstruction={onAddInstruction}
          onUpdateInstruction={onUpdateInstruction}
          onDeleteInstruction={onDeleteInstruction}
          alreadyExpanded={true}
        />
      </SectionBlock>
    </div>
  );
};

/**
 * Section Photos adaptée au nouveau SectionBlock
 */
const PhotosSection = ({ property, onAddPhoto, onDeletePhoto }) => {
  return (
    <div className="mt-3">
      <SectionBlock 
        icon={Image} 
        title="Galerie Photos" 
        subtitle={`${property.photos ? property.photos.length : 0} photos`}
        theme="purple"
        expandable={true}
      >
        {property.photos && property.photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {property.photos.map((photo, index) => (
              <div key={photo.id || index} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-3px] border-2 border-slate-200">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium text-sm">{photo.title}</p>
                  {photo.description && (
                    <p className="text-white/80 text-xs mt-1">{photo.description}</p>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1.5 bg-white rounded-full border border-slate-200 shadow-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                    onClick={() => onDeletePhoto && onDeletePhoto(property.id, photo.id)}
                    title="Supprimer cette photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-xl border-2 border-slate-200 shadow-md">
            <p className="text-slate-500">Aucune photo ajoutée</p>
          </div>
        )}
        
        <button 
          className="mt-2 flex items-center justify-center w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-sm text-purple-600 hover:bg-purple-50 transition-colors"
          onClick={() => onAddPhoto && onAddPhoto(property.id, { title: 'Nouvelle photo', url: '/api/placeholder/800/600', description: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une photo
        </button>
      </SectionBlock>
    </div>
  );
};

/**
 * Composant principal PropertyCard
 */
const PropertyCard = ({ 
  property: propProperty, 
  onAddInstruction,
  onUpdateInstruction,
  onDeleteInstruction,
  onAddPhoto,
  onDeletePhoto,
  onAddPriorityInfo,
  onDeletePriorityInfo,
  onAccessAI,
  viewMode
}) => {
  const { t } = useTranslation();

  const {
    id,
    name,
    address,
    description,
    type,
    surface_m2,
    has_garden,
    has_balcony,
    is_accessible,
    practical_info,
    created_at,
    updated_at
  } = propProperty;

  // Enrichir la propriété avec des données de démonstration si nécessaire
  const [property, setProperty] = useState({
    ...propProperty,
    instructions: propProperty.instructions?.length > 0 ? propProperty.instructions : mockInstructions
  });
  
  // Gestion locale des instructions (pour la démonstration)
  const handleAddInstructionLocal = (propertyId, instruction) => {
    const newInstruction = {
      ...instruction,
      id: `inst-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    
    setProperty(prev => ({
      ...prev,
      instructions: [...prev.instructions, newInstruction]
    }));
    
    onAddInstruction && onAddInstruction(propertyId, instruction);
  };
  
  const handleUpdateInstructionLocal = (propertyId, instructionId, updatedInstruction) => {
    setProperty(prev => ({
      ...prev,
      instructions: prev.instructions.map(instruction => 
        instruction.id === instructionId ? { ...instruction, ...updatedInstruction, updatedAt: new Date().toISOString() } : instruction
      )
    }));
    
    onUpdateInstruction && onUpdateInstruction(propertyId, instructionId, updatedInstruction);
  };
  
  const handleDeleteInstructionLocal = (propertyId, instructionId) => {
    setProperty(prev => ({
      ...prev,
      instructions: prev.instructions.filter(instruction => instruction.id !== instructionId)
    }));
    
    onDeleteInstruction && onDeleteInstruction(propertyId, instructionId);
  };

  const cardClass = clsx(
    "bg-white rounded-xl shadow-xl border-3 border-slate-300 overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:translate-y-[-3px]",
    viewMode === 'list' && 'flex flex-col lg:flex-row'
  );

  return (
    <div className={cardClass}>
      {/* En-tête avec fond dégradé */}
      <div className={clsx(
        "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-4 sm:p-5 border-b-4 border-indigo-700",
        viewMode === 'list' && 'lg:w-1/3 lg:border-b-0 lg:border-r-4'
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white rounded-xl flex items-center justify-center mr-4 shadow-lg border-2 border-blue-300">
              <Home className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2 sm:gap-3">
                <p className="text-sm text-white/90 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-white/70" />
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={clsx("flex-1", viewMode === 'list' && 'lg:w-2/3')}>
        {/* Description */}
        {description && (
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 text-slate-700 text-sm leading-relaxed bg-slate-50">
            {description}
          </div>
        )}
        
        {/* Informations Temporaires */}
        <PropertyInfoSection
          infoItems={property.priorityInfos || []}
          onAddInfo={onAddPriorityInfo}
          onDeleteInfo={onDeletePriorityInfo}
          propertyId={id}
        />
        
        {/* Sections */}
        <div className="px-4 sm:px-5 py-2">
          {/* Base de connaissances améliorée */}
          <KnowledgeBaseSection 
            property={property}
            onAddInstruction={handleAddInstructionLocal}
            onUpdateInstruction={handleUpdateInstructionLocal}
            onDeleteInstruction={handleDeleteInstructionLocal}
          />
          
          {/* Photos */}
          <PhotosSection
            property={property}
            onAddPhoto={onAddPhoto}
            onDeletePhoto={onDeletePhoto}
          />
        </div>

        {/* Actions rapides */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex justify-end items-center">
          <button 
            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-500 hover:to-indigo-500 shadow-md border border-blue-700 transition-all duration-200"
            onClick={() => onAccessAI && onAccessAI(id)}
          >
            <Bot className="h-3.5 w-3.5 mr-1" />
            Consulter l'assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 