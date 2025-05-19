import { 
  LayoutGrid,
  Building,
  Bot,
  MessageSquare,
  FileText,
  BarChart2,
  Settings
 } from 'lucide-react'
 import { Link } from 'react-router-dom'
 import { NavigationItem } from './NavigationItem'
 import { useTranslation } from 'react-i18next';
 
 export const SidebarNav = ({ isCollapsed }) => {
  const { t } = useTranslation();

  const navigation = [
   { name: t('dashboard'), to: '#', icon: LayoutGrid, current: true },
   { name: t('properties'), to: '#', icon: Building, current: false },
   { name: t('aiAssistant'), to: '#', icon: Bot, current: false },
   { name: t('communications'), to: '#', icon: MessageSquare, current: false },
   { name: t('documents'), to: '#', icon: FileText, current: false },
   { name: t('reports'), to: '#', icon: BarChart2, current: false },
  ];
  
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <NavigationItem key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}
          </ul>
        </li>
        {!isCollapsed && (
          <>
            <li className="mt-auto">
              <Link
                to="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <Settings
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                  aria-hidden="true"
                />
                {t('settings')}
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
 };