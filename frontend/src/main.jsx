import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from '@/app/store'

// Importer notre configuration i18n
import './translations';

// Ajouter le provider si nécessaire (via React.Suspense)
// La Suspense est utile pour les chargements de traductions asynchrones
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
