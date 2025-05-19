import { Link } from 'react-router-dom'

const classNames = (...classes) => {
 return classes.filter(Boolean).join(' ')
}

export const TeamItem = ({ team }) => {
 return (
   <li>
     <Link
       to={team.to}
       className={classNames(
         team.current
           ? 'bg-gray-50 text-blue-600'
           : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
         'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
       )}
     >
       <span
         className={classNames(
           team.current
             ? 'text-blue-600 border-blue-600'
             : 'text-gray-400 border-gray-200 group-hover:border-blue-600 group-hover:text-blue-600',
           'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
         )}
       >
         {team.initial}
       </span>
       <span className="truncate">{team.name}</span>
     </Link>
   </li>
 )
}