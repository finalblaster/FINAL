import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SidebarNav } from '@/pages/user/SideBarNav'
import AnimatedLogo from '@/components/AnimatedLogo'
import { useTranslation } from 'react-i18next'

export const MobileSidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, SECTIONS }) => {
 const { t } = useTranslation();

 return (
   <Transition.Root show={sidebarOpen} as={Fragment}>
     <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
       <Transition.Child
         as={Fragment}
         enter="transition-opacity ease-linear duration-300"
         enterFrom="opacity-0"
         enterTo="opacity-100"
         leave="transition-opacity ease-linear duration-300"
         leaveFrom="opacity-100"
         leaveTo="opacity-0"
       >
         <div className="fixed inset-0 bg-gray-900/80" />
       </Transition.Child>

       <div className="fixed inset-0 flex">
         <Transition.Child
           as={Fragment}
           enter="transition ease-in-out duration-300 transform"
           enterFrom="-translate-x-full"
           enterTo="translate-x-0"
           leave="transition ease-in-out duration-300 transform"
           leaveFrom="translate-x-0"
           leaveTo="-translate-x-full"
         >
           <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
             <Transition.Child
               as={Fragment}
               enter="ease-in-out duration-300"
               enterFrom="opacity-0"
               enterTo="opacity-100"
               leave="ease-in-out duration-300"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
             >
               <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                 <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                   <span className="sr-only">{t('closeSidebar')}</span>
                   <X className="h-6 w-6 text-white" aria-hidden="true" />
                 </button>
               </div>
             </Transition.Child>
             <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
               <div className="flex h-16 shrink-0 items-center">
                 <Link to="/">
                   <AnimatedLogo />
                 </Link>
               </div>
               <SidebarNav 
                 activeSection={activeSection}
                 SECTIONS={SECTIONS}
                 setActiveSection={(section) => {
                   setActiveSection(section);
                   setSidebarOpen(false); // Fermer le menu mobile après sélection
                 }} 
               />
             </div>
           </Dialog.Panel>
         </Transition.Child>
       </div>
     </Dialog>
   </Transition.Root>
 )
}