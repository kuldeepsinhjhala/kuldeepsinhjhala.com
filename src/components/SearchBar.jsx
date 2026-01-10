import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTabs } from '../context/TabContext'
import { useNavbar } from '../context/NavbarContext'

function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tabs, switchTab, openTab } = useTabs()
  const { isOpen: isNavbarOpen, setIsOpen: setIsNavbarOpen } = useNavbar()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const searchResultsRef = useRef(null)

  // Page routes mapping
  const pageRoutes = {
    '/': 'index.jsx',
    '/journey': 'journey.jsx',
    '/experience': 'experience.jsx',
    '/education': 'education.jsx',
    '/skills': 'skills.jsx',
    '/tech': 'tech.jsx',
    '/projects': 'projects.jsx',
    '/resume': 'resume.jsx',
    '/blog': 'blog.jsx',
    '/contact': 'contact.jsx',
    '/extra': 'extra.jsx'
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
    '/tech': {
      keywords: ['tech', 'technology', 'technologies', 'tools', 'stack', 'frameworks', 'languages', 'software', 'programming'],
      content: 'Technologies and tech stack'
    },
    '/projects': {
      keywords: ['projects', 'portfolio', 'work', 'applications', 'apps', 'development', 'build', 'created', 'developed'],
      content: 'Projects and portfolio work'
    },
    '/resume': {
      keywords: ['resume', 'cv', 'curriculum vitae', 'download', 'pdf', 'document'],
      content: 'Resume and CV download'
    },
    '/blog': {
      keywords: ['blog', 'articles', 'posts', 'writing', 'thoughts', 'insights', 'tutorials'],
      content: 'Blog posts and articles'
    },
    '/contact': {
      keywords: ['contact', 'reach', 'email', 'message', 'connect', 'get in touch', 'communication', 'social'],
      content: 'Contact information and ways to reach out'
    },
    '/extra': {
      keywords: ['extra', 'additional', 'more', 'other', 'miscellaneous', 'bonus'],
      content: 'Extra content and additional information'
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
        if (isQuickActionsOpen) {
          setIsQuickActionsOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, isQuickActionsOpen])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="Quick Actions"]')) {
        setIsQuickActionsOpen(false)
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          !event.target.closest('input[type="text"]')) {
        // Don't close search results on input click
      }
    }

    if (isQuickActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isQuickActionsOpen])

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
        // Add download resume functionality here
        console.log('Download Resume clicked')
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
        // Navigate to contact page
        navigate('/contact')
        setIsQuickActionsOpen(false)
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
        // Open social media links or menu
        console.log('Social Media clicked')
        setIsQuickActionsOpen(false)
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
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-bg transition-colors group border-b border-gold/10 last:border-b-0"
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
          className="flex items-center gap-1.5 px-2 min-[425px]:px-3 py-2 bg-bg border border-gold/20 rounded text-head hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all flex-shrink-0 text-xs font-medium"
          aria-label="Quick Actions"
        >
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="hidden min-[425px]:inline">Quick Actions</span>
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
                className="text-body hover:text-head transition-colors p-1 rounded hover:bg-bg"
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
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-body hover:text-head hover:bg-bg transition-colors group"
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
    </div>
  )
}

export default SearchBar;