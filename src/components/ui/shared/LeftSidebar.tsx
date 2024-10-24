import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants/constants';
import { INavLink } from '@/types';
import { useSignOutAccount } from '@/lib/React-Query/queriesAndMutations';
import { useState } from 'react';

const LeftSidebar = () => {
  const { user, setIsAuthenticated } = useUserContext();
  const { pathname } = useLocation();
  const { mutateAsync: logout, isSuccess } = useSignOutAccount();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  // try and use setisauthenticated from useusercontext to determine authentication
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsAuthenticated(false);
    await logout();
    if (isSuccess) {
      navigate('/sign-in');
      setIsLoggingOut(false);
    }
  }
  if (isLoggingOut) {
    <div>logging out</div>
  }
  return (
    <>
      {user && (
        <div className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[300px] bg-dark-2">
          <Link to="/" className="flex gap-3 items-center">
            <img src="/assets/images/logo.svg"
              width={180} height={36} />
          </Link>
          {/* profile section */}
          <Link to={`profile/${user.id}`} className='flex gap-3'>
            <img src="assets/images/profile.png" />
            <div>
              <p className='text-lg font-extrabold'>{user.name}</p>
              <p className='text-gray-600'>@{user.username}</p>
            </div>
          </Link>
          {sidebarLinks.map(
            (link: INavLink) => {
              let isActive = pathname === link.route
              return (
                <li key={link.label} className={`group ${isActive && ' bg-primary-500'}`}>
                  <NavLink to={link.route}
                    className={`flex gap-5 hover:bg-blue-400 hover:rounded-xl w-full p-5`}>
                    <img src={link.imgURL} alt="link.label"
                      className={` group-hover:invert-white transition ease-in-out duration-800 ${isActive && 'invert-white'}`} />
                    {link.label}
                  </NavLink>
                </li>
              )
            })}

          <div onClick={() => handleLogout()} className=' group ml-2 flex gap-5 hover:bg-blue-400 p-5 rounded-xl'>
            <img src="/assets/icons/logout.svg" alt="logout" className=' group-hover:invert-white transition ease-in-out duration-800 hover:invert-white' />
            <button className='rounded-full '>Logout</button>
          </div>
        </div>
      )}
    </>
  )
}

export default LeftSidebar
