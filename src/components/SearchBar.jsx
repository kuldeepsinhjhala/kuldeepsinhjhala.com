import { useState, useEffect, useRef } from 'react'

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsFocused(true)
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur()
        setIsFocused(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused])

  return (
    <div className="hidden lg:block sticky top-0 z-30 bg-card border-b border-gold/10 px-4" style={{ height: '48px' }}>
      <div className="flex items-center h-full" style={{ width: 'max-content' }}>
        <div className="relative" style={{ width: '500px' }}>
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
            onBlur={() => setIsFocused(false)}
            placeholder="Search (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 bg-bg border border-gold/20 rounded text-head text-sm placeholder:text-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
          />
        </div>
        <div className="ml-2 flex items-center gap-2 text-xs text-body">
          <kbd className="px-2 py-1 bg-card border border-gold/20 rounded text-body">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-card border border-gold/20 rounded text-body">K</kbd>
        </div>
      </div>
    </div>
  )
}

export default SearchBar;