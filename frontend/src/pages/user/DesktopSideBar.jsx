import { useState } from 'react';
import clsx from 'clsx';
import {
  LayoutGrid,
  Building,
  Bot,
  MessageSquare,
  FileText,
  BarChart2,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useTranslation } from 'react-i18next';

export const DesktopSidebar = ({ activeSection, setActiveSection, SECTIONS, isCollapsed = false, setIsCollapsed }) => {
  const { t } = useTranslation();
  
  if (!setIsCollapsed) {
    // Si setIsCollapsed n'est pas fourni, on utilise un state local
    [isCollapsed, setIsCollapsed] = useState(false);
  }

const navigation = [
    { id: SECTIONS.DASHBOARD, name: t('dashboard'), icon: LayoutGrid },
    { id: SECTIONS.PROPERTIES, name: t('properties'), icon: Building },
    { id: SECTIONS.AI_ASSISTANT, name: t('aiAssistant'), icon: Bot },
    { id: SECTIONS.COMMUNICATIONS, name: t('communications'), icon: MessageSquare },
    { id: SECTIONS.DOCUMENTS, name: t('documents'), icon: FileText },
    { id: SECTIONS.REPORTS, name: t('reports'), icon: BarChart2 },
  ];

  return (
    <div className="hidden lg:block">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white bg-white',
          'transition-transform duration-300 ease-in-out transform',
          isCollapsed ? '-translate-x-full' : 'translate-x-0',
          'w-56'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 shadow-sm">
          <Link to="/">
            <AnimatedLogo isCollapsed={false} />
          </Link>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            aria-label={t('closeSidebar')}
          >
            <ChevronRight className="h-5 w-5 transform rotate-180" />
          </button>
        </div>

        <div className="flex flex-col flex-grow px-3 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={clsx(
                  'group flex items-center p-2.5 rounded-lg w-full',
                  activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                )}
              >
                  <item.icon
                  className={clsx(
                    'h-5 w-5 mr-3',
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                  )}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={() => setActiveSection(SECTIONS.SETTINGS)}
              className={clsx(
                'group flex items-center p-2.5 rounded-lg w-full',
                activeSection === SECTIONS.SETTINGS ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              )}
            >
              <Settings 
                className={clsx(
                  'h-5 w-5 mr-3',
                  activeSection === SECTIONS.SETTINGS ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                )}
              />
              <span className="text-sm font-medium">{t('settings')}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};


