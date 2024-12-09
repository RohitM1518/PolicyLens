import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useResponseContext } from '../contexts/ResponseContext';
import { useErrorContext } from '../contexts/ErrorContext';
import { errorParser } from '../utils/errorParser';
import { logout } from '../redux/userSlice';
import { useLoadingContext } from '../contexts/LoadingContext';
import { persistor } from '../redux/store';
import { useUserContext } from '../contexts/UserContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Summaries PDF', href: '/summaries' },
  { name: 'Regional Language', href: '/regional-language' },
  { name: 'Chat Bot', href: '/chatbot' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setResponse } = useResponseContext();
  const { setError } = useErrorContext();
  const dispatch = useDispatch()
  const { setIsLoading } = useLoadingContext();
  // This should be replaced with actual auth state management
  const isLoggedIn = useSelector((state) => state?.isLoggedIn);
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);
  // console.log("Status " + accessToken)
  const isActive = (path) => location.pathname === path;
  const {setUser}=useUserContext()
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`${backendURL}/user/logout`,{
        withCredentials:true,
        headers:{
            'Authorization':`Bearer ${accessToken}`
        }
    })
      dispatch(logout())
      navigate('/');
      setResponse()
    } catch (error) {
      // setError(errorParser(error));
      console.log(error)
    }
    finally {
      setIsLoading(false);
      setUser(null);
      persistor.purge().then(() => {
        console.log('Persisted state cleared');
      });
      navigate('/signin')
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-primary">PolicyLens</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-semibold leading-6 ${isActive(item.href)
                ? 'text-secondary'
                : 'text-gray-900 hover:text-secondary'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isLoggedIn ? (
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-secondary" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/dashboard"
                        className={`${active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Manage Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <Link
                to="/signin"
                className={`text-sm font-semibold leading-6 ${isActive('/signin')
                  ? 'text-secondary'
                  : 'text-gray-900 hover:text-secondary'
                  } px-4 py-2 rounded-md`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold leading-6 text-white bg-primary hover:bg-secondary px-4 py-2 rounded-md transition-colors duration-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-gray-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-2xl font-bold text-primary">PolicyLens</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${isActive(item.href)
                        ? 'text-secondary bg-gray-50'
                        : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-white bg-primary hover:bg-secondary rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}