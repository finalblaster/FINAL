import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToast = ({ type, message }) => {
  // Définir les couleurs en fonction du type de toast
  let bgColor, iconColor, icon;
  if (type === 'success') {
    bgColor = 'bg-green-600';
    iconColor = 'text-white';
    icon = '✔️';
  } else if (type === 'error') {
    bgColor = 'bg-red-600';
    iconColor = 'text-white';
    icon = '❌';
  }

  const handleButtonClick = () => {
    toast.dismiss(); // Ferme la notification quand le bouton est cliqué
  };

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg ${bgColor}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-6 h-6 flex justify-center items-center ${iconColor}`}>
          {icon}
        </div>
        <div className="flex-1 text-white">
          <p className="font-semibold">{message}</p>
        </div>
        <button
          onClick={handleButtonClick}
          className="ml-4 text-white font-semibold bg-transparent hover:bg-white hover:text-gray-800 py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </div>
      <div className="w-full mt-2 h-1 bg-white">
        <div className="h-full bg-blue-400 animate-pulse" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export const showCustomToast = (type, message) => {
  toast(<CustomToast type={type} message={message} />, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000, // Durée avant de se fermer
    hideProgressBar: true,
    closeOnClick: false, // Empêche de fermer en cliquant
    pauseOnHover: true,
    draggable: true,
    className: 'shadow-lg rounded-xl', // Applique un style à la notification
  });
};
