import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Summaries PDF', href: '/summaries' },
  { name: 'Regional Language', href: '/regional-language' },
  { name: 'Chat Bot', href: '/chatbot' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

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
              className={`text-sm font-semibold leading-6 \${
                isActive(item.href)
                  ? 'text-secondary'
                  : 'text-gray-900 hover:text-secondary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link
            to="/signin"
            className={`text-sm font-semibold leading-6 \${
              isActive('/signin')
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
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 \${
                        isActive(item.href)
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
                  <Link
                    to="/signin"
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 \${
                      isActive('/signin')
                        ? 'text-secondary bg-gray-50'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-primary hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}