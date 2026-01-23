import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTabs } from '../context/TabContext'
import { useNavbar } from '../context/NavbarContext'
import contactData from '../data/contact.json'

function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tabs, switchTab, openTab } = useTabs()
  const { isOpen: isNavbarOpen, setIsOpen: setIsNavbarOpen } = useNavbar()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [isSocialMediaOpen, setIsSocialMediaOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const socialMediaModalRef = useRef(null)
  const contactModalRef = useRef(null)
  const searchResultsRef = useRef(null)

  // Page routes mapping
  const pageRoutes = {
    '/': 'index.jsx',
    '/journey': 'journey.jsx',
    '/experience': 'experience.jsx',
    '/education': 'education.jsx',
    '/skills': 'skills.jsx',
    '/projects': 'projects.jsx',
    '/resume': 'resume.jsx',
    // '/blog': 'blog.jsx', // Temporarily hidden
    '/contact': 'contact.jsx'
  }

  // Content index for all pages - searchable content across the entire website
  const pageContentIndex = {
    '/': {
      keywords: ['landing', 'home', 'welcome', 'portfolio', 'index', 'main', 'start', 'beginning'],
      content: 'Welcome to my portfolio landing page'
    },
    '/journey': {
      keywords: ['journey', 'story', 'path', 'career', 'timeline', 'history', 'background', 'about'],
      content: 'My journey and career path'
    },
    '/experience': {
      keywords: ['experience', 'work', 'job', 'employment', 'career', 'professional', 'positions', 'roles', 'companies'],
      content: 'Professional work experience and employment history'
    },
    '/education': {
      keywords: ['education', 'school', 'university', 'college', 'degree', 'academic', 'qualifications', 'courses', 'learning'],
      content: 'Educational background and academic qualifications'
    },
    '/skills': {
      keywords: ['skills', 'abilities', 'competencies', 'expertise', 'proficiency', 'talents', 'capabilities'],
      content: 'Skills and technical competencies'
    },
    '/projects': {
      keywords: ['projects', 'portfolio', 'work', 'applications', 'apps', 'development', 'build', 'created', 'developed'],
      content: 'Projects and portfolio work'
    },
    '/resume': {
      keywords: ['resume', 'cv', 'curriculum vitae', 'download', 'pdf', 'document'],
      content: 'Resume and CV download'
    },
    // '/blog': {
    //   keywords: ['blog', 'articles', 'posts', 'writing', 'thoughts', 'insights', 'tutorials'],
    //   content: 'Blog posts and articles'
    // },
    '/contact': {
      keywords: ['contact', 'reach', 'email', 'message', 'connect', 'get in touch', 'communication', 'social'],
      content: 'Contact information and ways to reach out'
    }
  }

  // Search function to scan the entire website across all pages (case-insensitive)
  const searchWebsite = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Convert search term to lowercase for case-insensitive matching
    const searchTerm = query.toLowerCase().trim()
    const matches = []
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Search through all pages in the content index
    Object.keys(pageRoutes).forEach(path => {
      const pageName = pageRoutes[path]
      const pageContent = pageContentIndex[path] || {}
      const allSearchableText = [
        pageName,
        ...(pageContent.keywords || []),
        pageContent.content || ''
      ].join(' ').toLowerCase()

      // Count matches in page name, keywords, and content
      let matchCount = 0

      // Check page name
      if (pageName.toLowerCase().includes(searchTerm)) {
        const nameMatches = (pageName.toLowerCase().match(new RegExp(escapedTerm, 'gi')) || []).length
        matchCount += nameMatches
      }

      // Check keywords
      pageContent.keywords?.forEach(keyword => {
        if (keyword.toLowerCase().includes(searchTerm)) {
          const keywordMatches = (keyword.toLowerCase().match(new RegExp(escapedTerm, 'gi')) || []).length
          matchCount += keywordMatches
        }
      })

      // Check content
      if (pageContent.content && pageContent.content.toLowerCase().includes(searchTerm)) {
        const contentMatches = (pageContent.content.toLowerCase().match(new RegExp(escapedTerm, 'gi')) || []).length
        matchCount += contentMatches
      }

      // Also search in all searchable text combined
      if (allSearchableText.includes(searchTerm)) {
        const allMatches = (allSearchableText.match(new RegExp(escapedTerm, 'gi')) || []).length
        matchCount = Math.max(matchCount, allMatches)
      }

      if (matchCount > 0) {
        matches.push({
          path: path,
          name: pageName,
          count: matchCount
        })
      }
    })

    // Also search current page DOM content for dynamic content
    const mainContent = document.querySelector('main')
    if (mainContent) {
      // Get all text nodes in the main content
      const walker = document.createTreeWalker(
        mainContent,
        NodeFilter.SHOW_TEXT,
        null,
        false
      )

      let node
      let currentPageDOMMatches = 0

      while (node = walker.nextNode()) {
        // Convert text to lowercase for case-insensitive comparison
        const text = node.textContent.toLowerCase()
        if (text.includes(searchTerm)) {
          const count = (text.match(new RegExp(escapedTerm, 'gi')) || []).length
          currentPageDOMMatches += count
        }
      }

      // Add or update current page matches with DOM content
      if (currentPageDOMMatches > 0) {
        const currentPagePath = location.pathname
        const existingMatch = matches.find(m => m.path === currentPagePath)
        if (existingMatch) {
          existingMatch.count += currentPageDOMMatches
        } else {
          matches.push({
            path: currentPagePath,
            name: pageRoutes[currentPagePath] || currentPagePath,
            count: currentPageDOMMatches
          })
        }
      }
    }

    setSearchResults(matches.sort((a, b) => b.count - a.count))
  }

  // Perform search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchWebsite(searchQuery)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, location.pathname])

  // Get current active tab index
  const activeTabIndex = tabs.findIndex(tab => tab.isActive)
  const canGoPrevious = activeTabIndex > 0
  const canGoNext = activeTabIndex < tabs.length - 1

  // Navigate to previous tab
  const navigatePrevious = () => {
    if (canGoPrevious) {
      const previousTab = tabs[activeTabIndex - 1]
      switchTab(previousTab.id)
    }
  }

  // Navigate to next tab
  const navigateNext = () => {
    if (canGoNext) {
      const nextTab = tabs[activeTabIndex + 1]
      switchTab(nextTab.id)
    }
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsFocused(true)
      }
      if (e.key === 'Escape') {
        if (isFocused) {
          inputRef.current?.blur()
          setIsFocused(false)
        }
        if (isContactOpen) {
          setIsContactOpen(false)
        } else if (isSocialMediaOpen) {
          setIsSocialMediaOpen(false)
        } else if (isQuickActionsOpen) {
          setIsQuickActionsOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, isQuickActionsOpen, isSocialMediaOpen, isContactOpen])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactModalRef.current && !contactModalRef.current.contains(event.target)) {
        setIsContactOpen(false)
      }
      if (socialMediaModalRef.current && !socialMediaModalRef.current.contains(event.target)) {
        setIsSocialMediaOpen(false)
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="Quick Actions"]')) {
        setIsQuickActionsOpen(false)
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          !event.target.closest('input[type="text"]')) {
        // Don't close search results on input click
      }
    }

    if (isQuickActionsOpen || isSocialMediaOpen || isContactOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isQuickActionsOpen, isSocialMediaOpen, isContactOpen])

  // Handle navigation to search result
  const handleSearchResultClick = (path) => {
    const pageName = pageRoutes[path] || path
    openTab(path, pageName)
    navigate(path)
    setSearchQuery('')
    setSearchResults([])
    setIsFocused(false)
    inputRef.current?.blur()
  }

  // Helper function to get icon by icon name
  const getIcon = (iconName) => {
    const icons = {
      github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      medium: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      ),
      mail: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      whatsapp: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      phone: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
    return icons[iconName] || icons.mail
  }

  // Social media accounts data from contact.json
  const socialMediaAccounts = useMemo(() => {
    if (!contactData?.social) return []
    
    return Object.entries(contactData.social).map(([key, value], index) => ({
      id: index + 1,
      name: value.label || key,
      username: value.username || '',
      url: value.url || '',
      icon: getIcon(value.icon || key)
    }))
  }, [])

  // Contact options data from contact.json
  const contactOptions = useMemo(() => {
    const options = []
    const contact = contactData?.contact || {}
    
    // Email
    if (contact.email?.primary) {
      options.push({
        id: 1,
        type: 'Email',
        value: contact.email.primary,
        url: `mailto:${contact.email.primary}`,
        icon: getIcon('mail')
      })
    }
    
    // Phone
    if (contact.phone?.primary) {
      options.push({
        id: 2,
        type: 'Call',
        value: contact.phone.primary,
        url: `tel:${contact.phone.primary.replace(/[^0-9+]/g, '')}`,
        icon: getIcon('phone')
      })
    }
    
    // WhatsApp
    if (contact.phone?.whatsapp) {
      options.push({
        id: 3,
        type: 'WhatsApp',
        value: contact.phone.primary || contact.phone.whatsapp,
        url: contact.phone.whatsapp,
        icon: getIcon('whatsapp')
      })
    }
    
    return options
  }, [])

  // Google Drive file ID for resume download
  const resumeFileId = '15NUqamzDlsB0NBRFfNTtM_RIS0sO7iii'
  const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${resumeFileId}`

  const handleDownloadResume = () => {
    window.open(resumeDownloadUrl, '_blank')
  }

  const quickActions = [
    {
      id: 1,
      label: 'Download Resume',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => {
        handleDownloadResume()
        setIsQuickActionsOpen(false)
      }
    },
    {
      id: 2,
      label: 'Contact Kuldeep',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => {
        // Open contact modal and close quick actions
        setIsQuickActionsOpen(false)
        setIsContactOpen(true)
      }
    },
    {
      id: 3,
      label: 'Social Media',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-6.414-2.485a4 4 0 106.364 6.364l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      onClick: () => {
        // Open social media modal and close quick actions
        setIsQuickActionsOpen(false)
        setIsSocialMediaOpen(true)
      }
    }
  ]

  return (
    <div className="block sticky top-0 z-40 bg-card border-b border-gold/10 px-2 max-[425px]:px-3 sm:px-4" style={{ height: '48px' }}>
      <div className="flex items-center h-full w-full max-[425px]:w-full gap-2">
        {/* Hamburger Menu - File Explorer Toggle */}
        <button
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          className="md:hidden p-1.5 rounded text-body hover:text-head hover:bg-bg transition-colors flex-shrink-0"
          aria-label="Toggle File Explorer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Tab Navigation Arrows */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={navigatePrevious}
            disabled={!canGoPrevious}
            className="p-1.5 rounded text-body hover:text-head hover:bg-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={navigateNext}
            disabled={!canGoNext}
            className="p-1.5 rounded text-body hover:text-head hover:bg-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 min-w-0 max-[425px]:w-full max-[768px]:max-w-[250px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[450px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              // Delay blur to allow click on search results
              setTimeout(() => {
                if (!searchResultsRef.current?.contains(document.activeElement)) {
                  setIsFocused(false)
                }
              }, 200)
            }}
            placeholder="Search (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 bg-bg border border-gold/20 rounded text-head text-sm placeholder:text-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
          />
          
          {/* Search Results Dropdown */}
          {isFocused && searchQuery.trim() && (
            <div
              ref={searchResultsRef}
              className="absolute top-full left-0 right-0 mt-1 border-2 border-gold/30 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
              style={{ 
                backgroundColor: '#112240', 
                opacity: 1,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                position: 'absolute',
                zIndex: 9999
              }}
            >
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2.5 border-b border-gold/20" style={{ backgroundColor: '#112240', opacity: 1 }}>
                    <p className="text-xs text-body font-medium">
                      Found {searchResults.reduce((sum, r) => sum + r.count, 0)} occurrence{searchResults.reduce((sum, r) => sum + r.count, 0) !== 1 ? 's' : ''} in {searchResults.length} page{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="py-1" style={{ backgroundColor: '#112240', opacity: 1 }}>
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultClick(result.path)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-bg hover:text-gold transition-colors group border-b border-gold/10 last:border-b-0 cursor-pointer"
                        style={{ backgroundColor: '#112240', opacity: 1 }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-mono text-xs text-head group-hover:text-gold truncate">{result.name}</span>
                        </div>
                        <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded flex-shrink-0 ml-2">
                          {result.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-4 py-8 text-center" style={{ backgroundColor: '#112240', opacity: 1 }}>
                  <p className="text-sm text-body font-medium">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-body/70 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
          className="flex items-center gap-1.5 px-2 min-[425px]:px-3 py-2 bg-bg border border-gold/20 rounded text-head hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all flex-shrink-0 text-xs font-medium cursor-pointer"
          aria-label="Quick Actions"
        >
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="hidden min-[510px]:inline">Quick Actions</span>
        </button>
        <button
          onClick={handleDownloadResume}
          className="flex items-center gap-1.5 px-2 min-[425px]:px-3 py-2 bg-bg border border-gold/20 rounded text-head hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all flex-shrink-0 text-xs font-medium cursor-pointer"
          aria-label="Download Resume"
        >
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Download Resume</span>
        </button>
      </div>

      {/* Quick Actions Modal */}
      {isQuickActionsOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-shadow/80 z-40"
            onClick={() => setIsQuickActionsOpen(false)}
          ></div>
          
          {/* Modal - Centered */}
          <div
            ref={modalRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-gold/20 rounded-lg shadow-lg min-w-[280px] max-w-[320px] overflow-hidden"
            style={{ backgroundColor: 'var(--c-card)' }}
          >
            <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
              <h3 className="text-head text-sm font-semibold">Quick Actions</h3>
              <button
                onClick={() => setIsQuickActionsOpen(false)}
                className="text-body hover:text-gold transition-colors p-1 rounded hover:bg-bg cursor-pointer"
                aria-label="Close Quick Actions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-body hover:text-gold hover:bg-bg transition-colors group cursor-pointer"
                >
                  <span className="text-gold group-hover:text-gold transition-colors">
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Social Media Modal */}
      {isSocialMediaOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-shadow/80 z-40"
            onClick={() => setIsSocialMediaOpen(false)}
          ></div>
          
          {/* Modal - Centered, same size as Quick Actions */}
          <div
            ref={socialMediaModalRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-gold/20 rounded-lg shadow-lg min-w-[280px] max-w-[320px] overflow-hidden"
            style={{ backgroundColor: 'var(--c-card)' }}
          >
            <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSocialMediaOpen(false)
                    setIsQuickActionsOpen(true)
                  }}
                  className="text-body hover:text-head transition-colors p-1 rounded hover:bg-bg"
                  aria-label="Back to Quick Actions"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-head text-sm font-semibold">Social Media</h3>
              </div>
              <button
                onClick={() => setIsSocialMediaOpen(false)}
                className="text-body hover:text-gold transition-colors p-1 rounded hover:bg-bg cursor-pointer"
                aria-label="Close Social Media"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-2 max-h-[400px] overflow-y-auto">
              {socialMediaAccounts.map((account) => (
                <a
                  key={account.id}
                  href={account.url}
                  target={account.url.startsWith('http') ? '_blank' : undefined}
                  rel={account.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-body hover:text-head hover:bg-bg transition-colors group"
                >
                  <span className="text-gold group-hover:text-gold transition-colors flex-shrink-0">
                    {account.icon}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium">{account.name}</span>
                    <span className="text-xs text-body/70 truncate">{account.username}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Contact Modal */}
      {isContactOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-shadow/80 z-40"
            onClick={() => setIsContactOpen(false)}
          ></div>
          
          {/* Modal - Centered, same size as Quick Actions */}
          <div
            ref={contactModalRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-gold/20 rounded-lg shadow-lg min-w-[280px] max-w-[320px] overflow-hidden"
            style={{ backgroundColor: 'var(--c-card)' }}
          >
            <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsContactOpen(false)
                    setIsQuickActionsOpen(true)
                  }}
                  className="text-body hover:text-head transition-colors p-1 rounded hover:bg-bg"
                  aria-label="Back to Quick Actions"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-head text-sm font-semibold">Contact Kuldeep</h3>
              </div>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-body hover:text-gold transition-colors p-1 rounded hover:bg-bg cursor-pointer"
                aria-label="Close Contact"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-2">
              {contactOptions.map((option) => (
                <a
                  key={option.id}
                  href={option.url}
                  target={option.url.startsWith('http') ? '_blank' : undefined}
                  rel={option.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-body hover:text-head hover:bg-bg transition-colors group"
                >
                  <span className="text-gold group-hover:text-gold transition-colors flex-shrink-0">
                    {option.icon}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium">{option.type}</span>
                    <span className="text-xs text-body/70 truncate">{option.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SearchBar;