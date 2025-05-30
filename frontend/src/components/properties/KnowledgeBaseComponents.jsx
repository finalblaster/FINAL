import React, { useState } from 'react';
import { 
  BookMarked,
  Wifi,
  ShowerHead,
  Tv,
  Home,
  Lightbulb,
  Coffee,
  AlertTriangle,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag as TagIcon,
  Check,
  Calendar
} from 'lucide-react';
import SectionBlock from '../shared/SectionBlock';
import clsx from 'clsx';

/**
 * Barre de recherche pour la base de connaissances
 */
export const KnowledgeSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-grow mb-3">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Rechercher une instruction..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setSearchQuery('')}
        >
          <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
};

/**
 * Onglets de catégories
 */
export const CategoryTabs = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={clsx(
              "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center transition-colors",
              activeCategory === category.id
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {React.createElement(category.icon, { className: "h-4 w-4 mr-1.5" })}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Carte d'instruction (format compact)
 */
export const InstructionCard = ({ instruction, onClick, onEdit, onDelete }) => {
  const photoCount = instruction.photos?.length || 0;
  
  return (
    <div 
      className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start">
          {React.createElement(instruction.icon || BookMarked, { 
            className: "h-5 w-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0" 
          })}
          <h5 className="font-medium text-slate-800">{instruction.title}</h5>
        </div>
        
        <div className="flex items-center space-x-1">
          {photoCount > 0 && (
            <span className="flex items-center px-2 py-0.5 bg-purple-50 rounded-full text-xs text-purple-700 border border-purple-200">
              <ImageIcon className="h-3 w-3 mr-1" />
              {photoCount}
            </span>
          )}
          
          <div className="ml-1 flex space-x-1">
            <button
              className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-full shadow-sm border border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(instruction);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-full shadow-sm border border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(instruction.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 ml-7 line-clamp-2">{instruction.description}</p>
      
      {instruction.tags && instruction.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {instruction.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-xs text-blue-700 border border-blue-100"
            >
              {tag}
            </span>
          ))}
          {instruction.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-xs text-slate-600 border border-slate-200">
              +{instruction.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {instruction.updatedAt && (
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <Calendar className="h-3 w-3 mr-1" />
          Mis à jour le {new Date(instruction.updatedAt).toLocaleDateString('fr-FR')}
        </div>
      )}
    </div>
  );
};

/**
 * Détail d'une instruction
 */
export const InstructionDetail = ({ instruction, onClose, onEdit, onDelete }) => {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-xl shadow-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {React.createElement(instruction.icon || BookMarked, { 
            className: "h-6 w-6 mr-2 text-blue-600 flex-shrink-0" 
          })}
          <h3 className="text-lg font-medium text-slate-800">{instruction.title}</h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-full shadow-sm border border-slate-200"
            onClick={() => onEdit(instruction)}
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-full shadow-sm border border-slate-200"
            onClick={() => onDelete(instruction.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm border border-slate-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">{instruction.description}</p>
      
      {instruction.steps && instruction.steps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Étapes :</h4>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600">
            {instruction.steps.map((step, idx) => (
              <li key={idx} className="mb-1">{step}</li>
            ))}
          </ol>
        </div>
      )}
      
      {instruction.photos && instruction.photos.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Photos :</h4>
          <div className="grid grid-cols-2 gap-2">
            {instruction.photos.map((photo, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                <img src={photo.url} alt={photo.alt || 'Instruction'} className="w-full h-auto" />
                {photo.caption && (
                  <div className="p-2 bg-slate-50 text-xs text-slate-700">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {instruction.tags && instruction.tags.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center text-xs text-slate-600 mb-1">
            <TagIcon className="h-3 w-3 mr-1" />
            Tags:
          </div>
          <div className="flex flex-wrap gap-1">
            {instruction.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-xs text-blue-700 border border-blue-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {instruction.relatedInstructions && instruction.relatedInstructions.length > 0 && (
        <div>
          <div className="flex items-center text-xs text-slate-600 mb-1">
            <LinkIcon className="h-3 w-3 mr-1" />
            Voir aussi:
          </div>
          <div className="space-y-1">
            {instruction.relatedInstructions.map((related, idx) => (
              <div key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                {related.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {instruction.updatedAt && (
        <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Mis à jour le {new Date(instruction.updatedAt).toLocaleDateString('fr-FR')}
          </div>
          
          {instruction.status === 'complete' ? (
            <div className="flex items-center text-emerald-600">
              <Check className="h-3 w-3 mr-1" />
              Information complète
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Information à compléter
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Composant principal de la base de connaissances
 * Version adaptée qui peut être utilisée directement ou comme contenu du SectionBlock
 */
export const KnowledgeBaseSection = ({ 
  property, 
  onAddInstruction,
  onUpdateInstruction,
  onDeleteInstruction,
  alreadyExpanded = false // Nouveau paramètre pour savoir si le contenu est déjà dans un SectionBlock
}) => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour la catégorie active
  const [activeCategory, setActiveCategory] = useState('all');
  
  // État pour l'instruction sélectionnée
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  
  // Liste des catégories disponibles
  const categories = [
    { id: 'all', name: 'Toutes', icon: BookMarked },
    { id: 'wifi', name: 'Internet & WiFi', icon: Wifi },
    { id: 'appliance', name: 'Électroménager', icon: Coffee },
    { id: 'bathroom', name: 'Salle de bain', icon: ShowerHead },
    { id: 'entertainment', name: 'Divertissement', icon: Tv },
    { id: 'rules', name: 'Règles & Accès', icon: Home },
    { id: 'utilities', name: 'Électricité & Eau', icon: Lightbulb },
    { id: 'emergency', name: 'Urgences', icon: AlertTriangle }
  ];
  
  // Fonction pour obtenir l'icône d'une catégorie
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookMarked;
  };
  
  // Filtrer les instructions
  const filteredInstructions = property.instructions?.filter(instruction => {
    // Filtrer par catégorie
    const matchesCategory = activeCategory === 'all' || instruction.category === activeCategory;
    
    // Filtrer par recherche
    const matchesSearch = searchQuery === '' || 
      instruction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instruction.description && instruction.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (instruction.tags && instruction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  }) || [];
  
  // Fonction pour ajouter une icône d'instruction
  const instructionsWithIcons = filteredInstructions.map(instruction => ({
    ...instruction,
    icon: getCategoryIcon(instruction.category)
  }));
  
  // Fonction pour gérer la sélection d'une instruction
  const handleSelectInstruction = (instruction) => {
    setSelectedInstruction(instruction);
  };
  
  // Fonction pour gérer l'édition d'une instruction
  const handleEditInstruction = (instruction) => {
    onUpdateInstruction && onUpdateInstruction(property.id, instruction.id, instruction);
  };
  
  // Fonction pour gérer la suppression d'une instruction
  const handleDeleteInstruction = (instructionId) => {
    onDeleteInstruction && onDeleteInstruction(property.id, instructionId);
    
    // Si l'instruction supprimée est celle actuellement sélectionnée, désélectionner
    if (selectedInstruction && selectedInstruction.id === instructionId) {
      setSelectedInstruction(null);
    }
  };
  
  // Fonction pour gérer l'ajout d'une nouvelle instruction
  const handleAddInstruction = () => {
    const newInstruction = { 
      title: 'Nouvelle instruction', 
      description: 'Description de la nouvelle instruction',
      content: '', 
      category: activeCategory === 'all' ? 'wifi' : activeCategory, 
      steps: [''], 
      tags: [],
      status: 'incomplete',
      updatedAt: new Date().toISOString()
    };
    
    onAddInstruction && onAddInstruction(property.id, newInstruction);
  };
  
  // Si le composant est déjà intégré dans un SectionBlock expandable, 
  // on affiche directement le contenu sans le SectionBlock
  if (alreadyExpanded) {
    return (
      <div>
        {/* Barre de recherche */}
        <KnowledgeSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Onglets de catégories */}
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
        />
        
        {selectedInstruction ? (
          /* Détail d'une instruction */
          <InstructionDetail 
            instruction={selectedInstruction}
            onClose={() => setSelectedInstruction(null)}
            onEdit={handleEditInstruction}
            onDelete={handleDeleteInstruction}
          />
        ) : (
          /* Liste des instructions */
          <div>
            {filteredInstructions.length > 0 ? (
              <div className="space-y-3 mb-4">
                {instructionsWithIcons.map((instruction, index) => (
                  <InstructionCard 
                    key={instruction.id || index}
                    instruction={instruction}
                    onClick={() => handleSelectInstruction(instruction)}
                    onEdit={handleEditInstruction}
                    onDelete={handleDeleteInstruction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
                <p className="text-slate-500">
                  {searchQuery 
                    ? "Aucune instruction ne correspond à votre recherche" 
                    : activeCategory !== 'all'
                      ? `Aucune instruction dans la catégorie "${categories.find(c => c.id === activeCategory)?.name}"`
                      : "Aucune instruction ajoutée"}
                </p>
              </div>
            )}
            
            {/* Bouton d'ajout */}
            <button 
              className="flex items-center justify-center w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={handleAddInstruction}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une instruction
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Si on n'est pas dans un SectionBlock, on utilise le SectionBlock directement
  return (
    <div className="mt-3">
      <SectionBlock 
        icon={BookMarked} 
        title="Base de connaissances" 
        subtitle={`${property.instructions ? property.instructions.length : 0} instructions`}
        theme="blue"
        expandable={true}
      >
        <div>
          {/* Barre de recherche */}
          <KnowledgeSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {/* Onglets de catégories */}
          <CategoryTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory}
          />
          
          {selectedInstruction ? (
            /* Détail d'une instruction */
            <InstructionDetail 
              instruction={selectedInstruction}
              onClose={() => setSelectedInstruction(null)}
              onEdit={handleEditInstruction}
              onDelete={handleDeleteInstruction}
            />
          ) : (
            /* Liste des instructions */
            <div>
              {filteredInstructions.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {instructionsWithIcons.map((instruction, index) => (
                    <InstructionCard 
                      key={instruction.id || index}
                      instruction={instruction}
                      onClick={() => handleSelectInstruction(instruction)}
                      onEdit={handleEditInstruction}
                      onDelete={handleDeleteInstruction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
                  <p className="text-slate-500">
                    {searchQuery 
                      ? "Aucune instruction ne correspond à votre recherche" 
                      : activeCategory !== 'all'
                        ? `Aucune instruction dans la catégorie "${categories.find(c => c.id === activeCategory)?.name}"`
                        : "Aucune instruction ajoutée"}
                  </p>
                </div>
              )}
              
              {/* Bouton d'ajout */}
              <button 
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={handleAddInstruction}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une instruction
              </button>
            </div>
          )}
        </div>
      </SectionBlock>
    </div>
  );
}; 