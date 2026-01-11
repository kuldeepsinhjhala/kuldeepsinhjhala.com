import { useState, useCallback, useEffect } from 'react'

/**
 * BlogSearch - Reusable search component with debouncing
 * Can be used in Blog section, Projects section, etc.
 */
function BlogSearch({
  onSearch,
  placeholder = 'Search posts...',
  debounceMs = 300,
  className = '',
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // Call onSearch when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedTerm)
    }
  }, [debouncedTerm, onSearch])

  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setSearchTerm('')
    setDebouncedTerm('')
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-body"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-10 py-3 bg-card border border-gold/20 rounded
            text-head placeholder:text-body/50
            focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50
            transition-all duration-200
          "
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-body hover:text-head transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Count (optional, can be passed as prop) */}
      {searchTerm && (
        <p className="mt-2 text-body text-xs">
          Searching for: <span className="text-head font-medium">"{searchTerm}"</span>
        </p>
      )}
    </div>
  )
}

export default BlogSearch

