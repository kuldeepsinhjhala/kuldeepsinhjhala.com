import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTabs } from '../context/TabContext'
import { useNavbar } from '../context/NavbarContext'
import logo from '../assets/Lion logo.png'

function Navbar() {
  const location = useLocation()
  const { openTab, tabs } = useTabs()
  const { isOpen: isNavbarOpen, setIsOpen: setIsNavbarOpen } = useNavbar()
  const navRef = useRef(null)

  const navItems = [
    { path: '/', label: 'index.jsx', mobileLabel: 'Home' },
    { path: '/journey', label: 'journey.jsx', mobileLabel: 'Journey' },
    { path: '/experience', label: 'experience.jsx', mobileLabel: 'Experience' },
    { path: '/education', label: 'education.jsx', mobileLabel: 'Education' },
    { path: '/skills', label: 'skills.jsx', mobileLabel: 'Skills' },
    { path: '/projects', label: 'projects.jsx', mobileLabel: 'Projects' },
    { path: '/resume', label: 'resume.jsx', mobileLabel: 'Resume' },
    // { path: '/blog', label: 'blog.jsx', mobileLabel: 'Blog' }, // Temporarily hidden
    { path: '/achievements', label: 'achievements.jsx', mobileLabel: 'Achievements' },
    { path: '/contact', label: 'contact.jsx', mobileLabel: 'Contact' },
  ]

  const handleFileClick = (e, item) => {
    e.preventDefault()
    // Reset all navbar button backgrounds (except the one being clicked) before opening new tab
    const buttons = document.querySelectorAll('.nav-item-button')
    buttons.forEach(button => {
      const buttonPath = button.getAttribute('data-path')
      // Don't reset the button that's being clicked (it will become active)
      if (buttonPath !== item.path) {
        button.style.backgroundColor = ''
      }
    })
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

  // Close File Explorer navbar when route changes
  useEffect(() => {
    setIsNavbarOpen(false)
  }, [location.pathname, setIsNavbarOpen])

  // Reset all navbar button backgrounds when route changes
  useEffect(() => {
    const buttons = document.querySelectorAll('.nav-item-button')
    buttons.forEach(button => {
      // Get the path from the button's data attribute or check if it's active
      const buttonPath = button.getAttribute('data-path')
      const isActive = buttonPath && (
        (buttonPath === '/' && location.pathname === '/') ||
        (buttonPath !== '/' && location.pathname === buttonPath)
      )
      
      // Only reset if it's not the active button
      if (!isActive) {
        button.style.backgroundColor = ''
      }
    })
  }, [location.pathname])

  // Update CSS variable with navbar width
  useEffect(() => {
    const updateNavbarWidth = () => {
      if (navRef.current && window.innerWidth >= 768) {
        const width = navRef.current.offsetWidth
        document.documentElement.style.setProperty('--navbar-width', `${width}px`)
      } else {
        document.documentElement.style.setProperty('--navbar-width', '0px')
      }
    }
    
    updateNavbarWidth()
    window.addEventListener('resize', updateNavbarWidth)
    return () => window.removeEventListener('resize', updateNavbarWidth)
  }, [])

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


  return (
    <>
      {/* Desktop Code Editor Navbar */}
      <nav ref={navRef} className="hidden md:block bg-card border-r border-gold/20 w-auto min-w-fit h-screen fixed left-0 top-0 flex flex-col overflow-hidden">
        {/* Explorer Header */}
        <div className="px-4 py-4 border-b border-gold/10 flex-shrink-0">
          <h2 className="text-head text-xs font-semibold uppercase tracking-wider">
            Explorer
          </h2>
        </div>

        <div className="p-3 flex-1 overflow-y-auto min-h-0">
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
                    data-path={item.path}
                    onClick={(e) => handleFileClick(e, item)}
                    className={`nav-item-button w-full flex items-center px-2 py-1.5 text-sm transition-all group text-left cursor-pointer ${
                      isActive(item.path)
                        ? 'bg-gold/20 text-gold'
                        : 'text-body'
                    }`}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = '#112240'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = ''
                      }
                    }}
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

        {/* Social Icons at Bottom - Desktop */}
        <div className="sticky bottom-0 px-4 py-4 border-t border-gold/10 flex-shrink-0 w-full bg-card">
          <div className="flex items-center justify-center gap-3 flex-wrap w-full">
            <a
              href="https://github.com/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/kuldepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a
              href="https://medium.com/@kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="mailto:kuldeepsinhjhala@example.com"
              className="text-body hover:text-gold transition-colors"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a
              href="tel:+1234567890"
              className="text-body hover:text-gold transition-colors"
              aria-label="Phone"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay for File Explorer */}
      {isNavbarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-shadow/80 z-40"
          onClick={() => setIsNavbarOpen(false)}
        ></div>
      )}

      {/* Mobile Desktop-Style Navbar (File Explorer) */}
      <nav
        className={`md:hidden fixed top-0 left-0 h-screen bg-card border-r border-gold/20 w-auto min-w-fit z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden rounded-tr-2xl rounded-br-2xl ${
          isNavbarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--c-card)' }}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsNavbarOpen(false)}
            className="text-body hover:text-head transition-colors p-1 rounded hover:bg-bg"
            aria-label="Close File Explorer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Explorer Header */}
        <div className="px-4 py-4 border-b border-gold/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-5 w-auto object-contain opacity-90"
              style={{
                filter: 'brightness(0) invert(1) sepia(100%) saturate(200%) hue-rotate(20deg)'
              }}
            />
          <h2 className="text-head text-xs font-semibold uppercase tracking-wider">
            Explorer
          </h2>
          </div>
        </div>

        <div className="p-3 flex-1 overflow-y-auto min-h-0">
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
                    data-path={item.path}
                    onClick={(e) => {
                      handleFileClick(e, item)
                      setIsNavbarOpen(false)
                    }}
                    className={`nav-item-button w-full flex items-center px-2 py-1.5 text-sm transition-all group text-left cursor-pointer ${
                      isActive(item.path)
                        ? 'bg-gold/20 text-gold'
                        : 'text-body'
                    }`}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = '#112240'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = ''
                      }
                    }}
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

        {/* Social Icons at Bottom - Mobile */}
        <div className="mt-auto px-4 py-4 border-t border-gold/10 flex-shrink-0 w-full bg-card">
          <div className="flex items-center justify-center gap-3 flex-wrap w-full">
            <a
              href="https://github.com/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/kuldepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a
              href="https://medium.com/@kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/kuldeepsinhjhala"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="mailto:kuldeepsinhjhala@example.com"
              className="text-body hover:text-gold transition-colors"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a
              href="tel:+1234567890"
              className="text-body hover:text-gold transition-colors"
              aria-label="Phone"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

