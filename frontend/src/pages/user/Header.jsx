import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { Menu } from 'lucide-react'
import UserMenu from './UserMenu'

export const Header = ({ setSidebarOpen, userInfo, userNavigation, isCollapsed, setIsCollapsed }) => {
 return (
    <header className="sticky top-0 z-30 w-full">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
        {/* Bouton pour mobile */}
       <button
         type="button"
         className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
         onClick={() => setSidebarOpen(true)}
       >
          <span className="sr-only">Ouvrir la barre latérale</span>
         <Bars3Icon className="h-6 w-6" aria-hidden="true" />
       </button>

        {/* Bouton pour desktop */}
        {isCollapsed && (
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hidden lg:block hover:text-blue-600 transition-colors duration-200"
            onClick={() => setIsCollapsed(false)}
          >
            <span className="sr-only">Ouvrir la barre latérale</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        )}

       <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

       <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Espace central */}
          <div className="flex flex-1"></div>
          
          <div className="flex items-center justify-end">
           <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Voir les notifications</span>
             <BellIcon className="h-6 w-6" aria-hidden="true" />
           </button>
           <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 lg:mx-3" aria-hidden="true" />
           <UserMenu userInfo={userInfo} userNavigation={userNavigation} />
         </div>
       </div>
     </div>
    </header>
 )
}