import { sidebarLinks } from '@/constants/constants';
import { useUserContext } from '@/context/AuthContext';
import { INavLink } from '@/types';
import { Link, NavLink, useLocation } from 'react-router-dom'

const BottomBar = () => {
  const { user } = useUserContext();
  const { pathname } = useLocation();

  return (
    <section className=''>
      {user && (
        <div className="md:hidden px-3 py-3 flex items-center gap-5 justify-between bg-dark-2">
          {/* */}
          {sidebarLinks.map(
            (link: INavLink) => {
              let isActive = pathname === link.route
              return (
                <li key={link.label} className={`group rounded-xl ${isActive && ' bg-primary-500 rounded-[10px]'}`}>
                  <Link to={link.route}
                    className={`flex flex-col items-center p-2 hover:bg-blue-400 hover:rounded-xl w-full `}>
                    <img src={link.imgURL} alt="link.label"
                      className={` group-hover:invert-white transition ease-in-out duration-800 ${isActive && 'invert-white'}`} width={32} height={22} />
                    <p className='text-sm font-bold mt-1'>{link.label}</p>
                  </Link>
                </li>
              )
            })}
        </div>
      )}
    </section>
  )
}

export default BottomBar
