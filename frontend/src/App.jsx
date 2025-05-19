// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import router from '@/routes/AppRouter';
import { TOAST_CONFIG } from '@/utils/config';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Composant principal de l'application
 * Gère la configuration globale et le routing
 */
const App = () => (
  <>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
    <ToastContainer
      position={TOAST_CONFIG.POSITION}
      autoClose={TOAST_CONFIG.DEFAULT_DURATION}
      closeOnClick
      pauseOnHover
      className="mt-4"
      toastClassName="bg-white rounded-lg shadow-lg"
      bodyClassName="text-gray-800"
    />
  </>
);

export default App;

// src/utils/toast.jsx
export const toastConfig = {
  success: {
    className: 'border-l-4 border-green-500 bg-green-50',
  },
  error: {
    className: 'border-l-4 border-red-500 bg-red-50',
  }
};

