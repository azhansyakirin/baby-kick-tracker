import Cookies from 'js-cookie'
import { Icons } from '../Icons';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../Context/AuthContext';

export const Sidebar = ({ handleLogoutUser }) => {

  const location = useLocation();
  const { user } = useAuth();

  const appPath = [
    { id: 1, path: '/home', label: 'Home', icon: 'home' },
    { id: 2, path: '/baby', label: 'Your Baby', icon: 'baby' },
    { id: 3, path: '/appointments', label: 'Your Appointment', icon: 'calendar' },
    { id: 4, path: '/records', label: 'Your Records', icon: 'folder' },
    { id: 5, path: '/journey', label: 'Your Journey', icon: 'thumbnail' },
  ]

  return (
    // <nav className="float-left w-16 fixed h-full bg-white rounded-lg shadow-md p-1">
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white z-50 rounded-t-lg shadow-md p-1 flex md:flex-col md:top-0 md:left-0 md:h-full md:w-16">
      <div className="flex h-full flex-row md:flex-col justify-between overflow-x-auto">
        <ul className="flex flex-row md:flex-col justify-center items-center gap-2">
          {appPath.map(({ id, path, label, icon }) => (
            <li key={id} className={clsx({
              'bg-[var(--text-primary)] text-white': location.pathname === path,
              'bg-[var(--background)]': location.pathname !== path,
            },
              "md:hover:bg-[var(--text-primary)] md:hover:text-white duration-300 ease active:scale-95 transition cursor-pointer size-12 rounded-md shadow-xs flex items-center justify-center text-center")}>
              <Link to={path} title={label}>
                <Icons name={icon} />
              </Link>
            </li>
          ))}
        </ul>
        {/** Profile Div */}
        <div>
          <ul className="flex flex-row md:flex-col justify-center items-center gap-2">
            <li className="size-12 rounded-md bg-[var(--background)] shadow-xs flex items-center justify-center text-center" title={user?.name ?? 'Profile Name'}>
              {user?.photo ?
                <img
                  src={user.photo}
                  className='size-8 object-cover rounded-full'
                />
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              }
            </li>
            <li className="size-12 rounded-md bg-[var(--background)] shadow-xs flex items-center justify-center text-center md:hover:bg-[var(--text-primary)] md:hover:text-white duration-300 ease cursor-pointer active:scale-95 transition">
              <button
                onClick={() => {
                  Cookies.remove('user');
                  handleLogoutUser();
                }}
                className=""
                title='Logout'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )

};