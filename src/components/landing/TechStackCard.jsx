import { useId, useState } from 'react'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'

/**
 * TechStackCard - Reusable tech stack category card component
 * Displays a category of technologies
 */
function TechStackCard({ category, className = '', expanded, onExpandedChange }) {
  if (!category || !category.name) return null

  const panelId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof onExpandedChange === 'function'
  const isOpen = isControlled ? Boolean(expanded) : internalOpen
  const toggle = () => {
    if (isControlled) onExpandedChange(!expanded)
    else setInternalOpen((v) => !v)
  }
  const expandOnly = () => {
    if (isOpen) return
    if (isControlled) onExpandedChange(true)
    else setInternalOpen(true)
  }
  const hasItems = category.items && category.items.length > 0

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 sm:p-5 md:p-6
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200 shadow-lg
        w-full overflow-hidden
        ${hasItems && !isOpen ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
      onClick={
        hasItems && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              expandOnly()
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        <h3 className="text-gold text-sm sm:text-base md:text-lg font-semibold break-words min-w-0 flex-1 pr-1">
          {category.name}
        </h3>
        {hasItems && (
          <button
            type="button"
            onClick={toggle}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? `Collapse ${category.name} technologies` : `Expand ${category.name} technologies`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasItems && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div id={panelId} className="pt-3 sm:pt-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category.items.map((item, index) => (
                  <span
                    key={index}
                    className="
                      px-2 sm:px-3 py-1 sm:py-1.5 bg-card/80 backdrop-blur-sm border border-gold/10 rounded
                      text-body text-xs sm:text-sm
                      hover:border-gold/30 hover:text-head
                      transition-colors shadow-sm
                      break-words
                      max-w-full
                    "
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TechStackCard

