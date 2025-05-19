import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset, setActiveSection, getUserInfo } from '@/features/auth/authSlice';
import { Header } from '@/pages/user/Header';
import { MobileSidebar } from '@/pages/user/MobileSideBar';
import { DesktopSidebar } from '@/pages/user/DesktopSideBar';
import Dashboard from '@/pages/user/Dashboard';
import Properties from '@/pages/user/Properties';
import AIAssistant from '@/pages/user/AIAssistant';
import Communications from '@/pages/user/Communications';
import Documents from '@/pages/user/Documents';
import Reports from '@/pages/user/Reports';
import Settings from '../user/Settings';
import { useTranslation } from 'react-i18next';

// Définir des clés constantes pour les sections
export const SECTIONS = {
  DASHBOARD: 'dashboard',
  PROPERTIES: 'properties',
  AI_ASSISTANT: 'aiAssistant',
  COMMUNICATIONS: 'communications',
  DOCUMENTS: 'documents',
  REPORTS: 'reports',
  SETTINGS: 'settings'
};

// Clés pour stocker les états dans localStorage
const SIDEBAR_STATE_KEY = 'sidebarCollapsed';
const ACTIVE_SECTION_KEY = 'userActiveSection';

export default function HomeUser() {
  const { t } = useTranslation();
  const { user, userInfo, activeSection } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Utilisation d'une référence pour suivre si l'initialisation a été faite
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Récupérer l'état de la sidebar depuis localStorage ou par défaut déployée (false)
  const getSavedSidebarState = () => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
      // Si une valeur existe dans le localStorage, la convertir en booléen
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false; // Par défaut déployée si erreur
    }
  };
  
  const [isCollapsed, setIsCollapsed] = useState(getSavedSidebarState);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sauvegarder l'état de la sidebar dans localStorage quand il change
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isCollapsed));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  }, [isCollapsed]);

  // Récupérer les infos utilisateur au chargement
  useEffect(() => {
    if (user?.access) {
      dispatch(getUserInfo());
    }
  }, [dispatch, user?.access]);

  // Initialisation de la section active - UNE SEULE FOIS
  useEffect(() => {
    // Vérifier qu'on a un utilisateur connecté et que l'initialisation n'a pas encore été faite
    if (user?.access && !hasInitialized) {
      // Récupérer la section enregistrée
      const savedSection = localStorage.getItem(ACTIVE_SECTION_KEY);
      
      if (savedSection && Object.values(SECTIONS).includes(savedSection)) {
        console.log('Restauration de la section:', savedSection);
        dispatch(setActiveSection(savedSection));
      } else if (!activeSection) {
        // Utiliser dashboard uniquement si aucune section n'est définie
        console.log('Aucune section enregistrée ou active, utilisation de la section par défaut');
        dispatch(setActiveSection(SECTIONS.DASHBOARD));
      }
      
      // Marquer l'initialisation comme terminée
      setHasInitialized(true);
    }
  }, [user?.access, hasInitialized, dispatch, activeSection]);

  // Sauvegarder la section active dans localStorage UNIQUEMENT quand elle change ET après l'initialisation
  useEffect(() => {
    if (activeSection && user?.access && hasInitialized) {
      console.log('Sauvegarde de la section active:', activeSection);
      localStorage.setItem(ACTIVE_SECTION_KEY, activeSection);
    }
  }, [activeSection, user?.access, hasInitialized]);

  const handleLogout = () => {
    // Supprimer la section active du localStorage lors de la déconnexion
    localStorage.removeItem(ACTIVE_SECTION_KEY);
    
    dispatch(logout())
      .then(() => {
        dispatch(reset());
        navigate('/');
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const userNavigation = [
    { 
      name: t('userMenu.profile'), 
      to: '#', 
      onClick: () => dispatch(setActiveSection(SECTIONS.SETTINGS)) 
    },
    { name: t('userMenu.logout'), onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.DASHBOARD:
        return <Dashboard />;
      case SECTIONS.PROPERTIES:
        return <Properties />;
      case SECTIONS.AI_ASSISTANT:
        return <AIAssistant />;
      case SECTIONS.COMMUNICATIONS:
        return <Communications />;
      case SECTIONS.DOCUMENTS:
        return <Documents />;
      case SECTIONS.REPORTS:
        return <Reports />;
      case SECTIONS.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative flex bg-gray-50">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        SECTIONS={SECTIONS}
        setActiveSection={(section) => dispatch(setActiveSection(section))}
      />
      <DesktopSidebar
        activeSection={activeSection}
        SECTIONS={SECTIONS}
        setActiveSection={(section) => dispatch(setActiveSection(section))}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div 
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          !isCollapsed ? 'lg:ml-56' : ''
        }`}
      >
        <Header
          setSidebarOpen={setSidebarOpen}
          userInfo={userInfo}
          userNavigation={userNavigation}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeSection={activeSection}
          SECTIONS={SECTIONS}
        />
        <main className="p-6 transition-all duration-300">
          <div className="mx-auto max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}