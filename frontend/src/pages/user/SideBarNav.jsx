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
 import { useTranslation } from 'react-i18next';
 
 export const SidebarNav = ({ activeSection, setActiveSection, SECTIONS }) => {
  const { t } = useTranslation();
 
 const navigation = [
   { id: SECTIONS.DASHBOARD, name: t('dashboard'), icon: LayoutGrid },
   { id: SECTIONS.PROPERTIES, name: t('properties'), icon: Building },
   { id: SECTIONS.AI_ASSISTANT, name: t('aiAssistant'), icon: Bot },
   { id: SECTIONS.COMMUNICATIONS, name: t('communications'), icon: MessageSquare },
   { id: SECTIONS.DOCUMENTS, name: t('documents'), icon: FileText },
   { id: SECTIONS.REPORTS, name: t('reports'), icon: BarChart2 },
  ];
  
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full ${
                    activeSection === item.id 
                      ? 'bg-gray-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${
                      activeSection === item.id 
                        ? 'text-blue-600' 
                        : 'text-gray-400 group-hover:text-blue-600'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
        </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <button
            onClick={() => setActiveSection(SECTIONS.SETTINGS)}
            className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 w-full ${
              activeSection === SECTIONS.SETTINGS 
                ? 'bg-gray-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Settings
              className={`h-6 w-6 shrink-0 ${
                activeSection === SECTIONS.SETTINGS 
                  ? 'text-blue-600' 
                  : 'text-gray-400 group-hover:text-blue-600'
              }`}
              aria-hidden="true"
            />
            {t('settings')}
          </button>
        </li>
      </ul>
    </nav>
  )
 }