import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '@/utils/config'
import { useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react'

const classNames = (...classes) => classes.filter(Boolean).join(' ')

const UserMenu = ({ userInfo, userNavigation }) => {
  const { isLoading } = useSelector((state) => state.auth);
  const fullName = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-gray-50 transition-colors">
        <span className="sr-only">Open user menu</span>
        {userInfo?.profile_image ? (
          <img
            className="h-8 w-8 rounded-full bg-gray-50 object-cover border border-gray-100 shadow-sm"
            src={`${API_BASE_URL}${userInfo.profile_image}`}
            alt={fullName}
            onError={(e) => {
              e.target.src = null;
            }}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center border border-gray-100 shadow-sm">
            <UserCircle className="h-6 w-6 text-blue-400" />
          </div>
        )}
        <span className="hidden lg:flex lg:items-center">
          <span className="ml-3 text-sm font-medium leading-6 text-gray-900" aria-hidden="true">
            {fullName}
          </span>
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  to={item.to || '#'}
                  onClick={item.onClick}
                  className={classNames(
                    active ? 'bg-gray-50' : '',
                    'block px-4 py-2 text-sm leading-6 text-gray-700 hover:text-gray-900'
                  )}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu;