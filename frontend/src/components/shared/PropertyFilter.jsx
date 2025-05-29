import React, { useState } from 'react';
import { Sliders, Calendar } from 'lucide-react';
import CustomSelect from './CustomSelect';

const PropertyFilter = ({ 
  properties, 
  selectedProperty, 
  onPropertyChange, 
  timeFilters, 
  timeFilter, 
  onTimeFilterChange
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [localTimeFilter, setLocalTimeFilter] = useState(timeFilter);

  // Transformer les propriétés pour le CustomSelect
  const propertyOptions = [
    { value: 'all', label: 'Tous les logements' },
    ...properties.map(property => ({
      value: property.id,
      label: property.name
    }))
  ];

  const handleApplyFilters = () => {
    onTimeFilterChange(localTimeFilter);
    setFilterMenuOpen(false);
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
        {/* Custom Select pour les propriétés */}
        <div className="w-full sm:flex-1">
          <CustomSelect 
            options={propertyOptions}
            value={selectedProperty}
            onChange={onPropertyChange}
            placeholder="Tous les logements"
          />
        </div>
        
        {/* Bouton de filtres avancés */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={`
              w-full sm:w-[180px]
              flex items-center justify-center sm:justify-start
              px-4 py-3 
              bg-white 
              border-2 
              ${filterMenuOpen ? 'border-indigo-300' : 'border-slate-200'} 
              rounded-xl 
              text-sm 
              font-medium 
              text-slate-700 
              hover:bg-indigo-50 
              transition-all 
              duration-200
              active:scale-[0.98]
            `}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Filtres avancés
          </button>
          
          {filterMenuOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-80 bg-white border-2 border-indigo-200 rounded-xl z-10 p-4 animate-fadeIn">
              <div className="mb-4 space-y-3">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Période d'analyse</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeFilters.map((filter) => (
                    <button 
                      key={filter}
                      onClick={() => setLocalTimeFilter(filter)}
                      className={`
                        px-3 py-2 
                        rounded-lg 
                        text-sm 
                        font-medium 
                        transition-all
                        duration-200
                        border
                        ${localTimeFilter === filter 
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-800 scale-[1.02]' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'}
                      `}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setFilterMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-blue-500 border border-indigo-700 transition-all duration-200 active:scale-[0.98]"
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter; 