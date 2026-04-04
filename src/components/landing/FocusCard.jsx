import { useId, useState } from 'react'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'

/**
 * FocusCard - Reusable focus/working on card component
 * Displays a focus item with title, description, and optional icon
 */
function FocusCard({ item, className = '', expanded, onExpandedChange }) {
  if (!item) return null

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

  const getIcon = (iconName) => {
    const key = (iconName || '').toLowerCase()
    const icons = {
      server: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      cloud: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      zap: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      brain: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8a3 3 0 116 0v8a3 3 0 11-6 0V8zm6 0a3 3 0 116 0v4a3 3 0 01-3 3"
          />
        </svg>
      ),
      workflow: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h8M8 12h8M8 17h8M5 7h.01M5 12h.01M5 17h.01M19 7h.01M19 12h.01M19 17h.01"
          />
        </svg>
      ),
    }
    return icons[key] || null
  }

  const hasBody = Boolean(item.description)

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 sm:p-5 md:p-6
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200 shadow-lg
        w-full overflow-hidden
        ${hasBody && !isOpen ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
      onClick={
        hasBody && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              expandOnly()
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {item.icon && (
            <div className="text-gold flex-shrink-0" aria-hidden>
              {getIcon(item.icon)}
            </div>
          )}
          {item.title && (
            <h3 className="text-head text-base sm:text-lg md:text-xl font-semibold break-words min-w-0">
              {item.title}
            </h3>
          )}
        </div>
        {hasBody && (
          <button
            type="button"
            onClick={toggle}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? 'Collapse description' : 'Expand description'}
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

      {hasBody && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div id={panelId} className="pt-3 sm:pt-4">
              <p className="text-body text-xs sm:text-sm md:text-base break-words leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusCard

