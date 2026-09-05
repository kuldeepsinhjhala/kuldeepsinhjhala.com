import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { VISIBLE_SECTION_FLOW } from '../config/sectionFlow'

function navClassName({ isActive }) {
  return [
    'relative py-1.5 text-sm font-medium whitespace-nowrap no-underline transition-colors hover:no-underline',
    isActive
      ? 'text-white after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-white'
      : 'text-white/80 hover:text-white',
  ].join(' ')
}

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header className="shrink-0 z-50 bg-deep shadow-[0_4px_24px_rgba(30,6,53,0.2)]">
      <nav className="site-shell h-16 flex items-center justify-between gap-4">
        <div className="hidden lg:flex items-center gap-6">
          {VISIBLE_SECTION_FLOW.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navClassName}>
              {item.mobileLabel}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="lg:hidden nav-item-button ml-auto flex items-center justify-center h-10 w-10 text-white"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {isOpen && (
        <div className="lg:hidden border-t border-white/15 bg-deep">
          <div className="site-shell pb-4">
            <div className="flex flex-col py-2">
              {VISIBLE_SECTION_FLOW.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    [
                      'py-2.5 text-sm no-underline hover:no-underline',
                      isActive ? 'text-white font-medium' : 'text-white/80 hover:text-white',
                    ].join(' ')
                  }
                >
                  {item.mobileLabel}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
