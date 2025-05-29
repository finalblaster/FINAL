import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Sélectionner...' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Fermer le select quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full 
          flex 
          items-center 
          justify-between 
          px-4 
          py-3 
          bg-white 
          border-2 
          ${isOpen ? 'border-indigo-300' : 'border-slate-200'} 
          rounded-xl 
          text-sm 
          font-medium 
          text-slate-700 
          hover:bg-indigo-50 
          transition-all 
          duration-200
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-indigo-200 rounded-xl">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full 
                  px-4 
                  py-2 
                  text-left 
                  text-sm 
                  font-medium 
                  transition-colors
                  ${value === option.value 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-slate-700 hover:bg-slate-50'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 