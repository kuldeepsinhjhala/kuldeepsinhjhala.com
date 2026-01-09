import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTabs } from '../context/TabContext'

function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openTab, tabs } = useTabs()

  const navItems = [
    { path: '/', label: 'index.jsx', mobileLabel: 'Home' },
    { path: '/journey', label: 'journey.jsx', mobileLabel: 'Journey' },
    { path: '/experience', label: 'experience.jsx', mobileLabel: 'Experience' },
    { path: '/education', label: 'education.jsx', mobileLabel: 'Education' },
    { path: '/skills', label: 'skills.jsx', mobileLabel: 'Skills' },
    { path: '/tech', label: 'tech.jsx', mobileLabel: 'Tech' },
    { path: '/projects', label: 'projects.jsx', mobileLabel: 'Projects' },
    { path: '/resume', label: 'resume.jsx', mobileLabel: 'Resume' },
    { path: '/blog', label: 'blog.jsx', mobileLabel: 'Blog' },
    { path: '/contact', label: 'contact.jsx', mobileLabel: 'Contact' },
    { path: '/extra', label: 'extra.jsx', mobileLabel: 'Extra' },
  ]

  const handleFileClick = (e, item) => {
    e.preventDefault()
    openTab(item.path, item.label)
  }

  const isTabOpen = (path) => {
    return tabs.some(tab => tab.path === path)
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname === path
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  // File icon SVG
  const FileIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  )

  // Folder icon SVG
  const FolderIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  )

  // Hamburger icon
  const HamburgerIcon = ({ isOpen }) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-card text-head p-3 rounded-lg border border-gold/20 hover:bg-card/80 transition-colors hamburger-button"
        aria-label="Toggle menu"
      >
        <HamburgerIcon isOpen={isMobileMenuOpen} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-shadow/80 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Desktop Code Editor Navbar */}
      <nav className="hidden md:block bg-card border-r border-gold/20 w-64 h-screen fixed left-0 top-0 overflow-y-auto">
        {/* Explorer Header */}
        <div className="px-4 py-4 border-b border-gold/10">
          <h2 className="text-head text-xs font-semibold uppercase tracking-wider">
            Explorer
          </h2>
        </div>

        <div className="p-3">
          {/* Root folder */}
          <div>
            <div className="flex items-center text-head text-sm font-medium mb-1 px-2 py-1 rounded hover:bg-card/50 transition-colors">
              <FolderIcon />
              <span className="ml-2">kuldeepsinhjhala.com</span>
            </div>
            
            {/* File list */}
            <div className="ml-6 mt-1 space-y-0.5">
              {navItems.map((item) => {
                const tabIsOpen = isTabOpen(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={(e) => handleFileClick(e, item)}
                    className={`w-full flex items-center px-2 py-1.5 text-sm rounded transition-all group text-left ${
                      isActive(item.path)
                        ? 'bg-gold/20 text-gold'
                        : 'text-body hover:text-head hover:bg-card/50'
                    }`}
                  >
                    <span className={`mr-2 ${isActive(item.path) ? 'text-gold' : 'text-body group-hover:text-head'}`}>
                      <FileIcon />
                    </span>
                    <span className="font-mono text-xs flex-1">{item.label}</span>
                    {tabIsOpen && (
                      <span className="ml-2 w-1.5 h-1.5 bg-gold rounded-full"></span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Simple Vertical Navbar */}
      <nav
        className={`mobile-menu md:hidden fixed top-0 left-0 h-screen w-72 bg-card border-r border-gold/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-head text-xl font-bold mb-6">Navigation</h2>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-4 text-base font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-gold text-bg'
                    : 'text-body hover:text-head hover:bg-card/50'
                }`}
              >
                {item.mobileLabel}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

