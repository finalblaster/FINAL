import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
};

export default AddButton; 