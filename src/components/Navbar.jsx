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

  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header className="z-50 shrink-0 max-lg:h-0 max-lg:overflow-visible lg:bg-deep lg:shadow-[0_4px_24px_rgba(30,6,53,0.2)]">
      <nav className="hidden lg:flex site-shell h-16 items-center gap-6">
        {VISIBLE_SECTION_FLOW.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navClassName}>
            {item.mobileLabel}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="lg:hidden nav-item-button fixed top-3 right-3 z-[70] flex items-center justify-center h-11 w-11 rounded-lg bg-deep text-white shadow-lg border border-white/15"
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

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="nav-item-button absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-16 right-3 left-3 rounded-lg bg-deep border border-white/15 shadow-xl">
            <nav className="flex flex-col py-2 px-3" aria-label="Mobile">
              {VISIBLE_SECTION_FLOW.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    [
                      'py-2.5 px-2 text-sm no-underline rounded-md hover:no-underline',
                      isActive ? 'text-white font-medium bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5',
                    ].join(' ')
                  }
                >
                  {item.mobileLabel}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
