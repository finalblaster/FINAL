import { Link } from 'react-router-dom'
import clsx from 'clsx'

export const NavigationItem = ({ item, isCollapsed }) => {
  return (
    <li>
      <Link
        to={item.to}
        className={clsx(
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
          item.current
            ? 'bg-gray-50 text-blue-600'
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
          isCollapsed ? 'justify-center px-2' : 'px-3'
        )}
        title={item.name}
      >
        <item.icon
          className={clsx(
            'h-6 w-6 shrink-0',
            item.current 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-blue-600'
          )}
          aria-hidden="true"
        />
        <span className={clsx(
          'transition-all duration-300',
          isCollapsed ? 'hidden' : 'block'
        )}>
          {item.name}
        </span>
      </Link>
    </li>
  );
};