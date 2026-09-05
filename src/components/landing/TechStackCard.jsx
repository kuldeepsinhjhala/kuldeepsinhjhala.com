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
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-md px-3 py-2
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200
        w-full overflow-hidden
        ${hasItems && !isOpen ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={
        hasItems && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              expandOnly()
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <h3 className="text-gold text-sm font-semibold break-words min-w-0 flex-1 pr-1">
          {category.name}
        </h3>
        {hasItems && (
          <button
            type="button"
            onClick={toggle}
            className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? `Collapse ${category.name} technologies` : `Expand ${category.name} technologies`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
            <div id={panelId} className="pt-2">
              <div className="flex flex-wrap gap-1">
                {category.items.map((item, index) => (
                  <span
                    key={index}
                    className="
                      px-1.5 py-0.5 bg-card/80 backdrop-blur-sm border border-gold/10 rounded
                      text-body text-[11px] leading-4
                      hover:border-gold/30 hover:text-head
                      transition-colors
                      break-words
                      max-w-full
                    "
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

