import { useId, useState } from 'react'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'

/**
 * SkillCard - Name only until chevron expands description
 */
function SkillCard({ skill = {} }) {
  if (!skill || !skill.name) return null

  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const hasDescription = Boolean(
    skill.description && String(skill.description).trim()
  )

  return (
    <div
      className={`bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 md:p-5 shadow-md ${hasDescription && !isOpen ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
      onClick={
        hasDescription && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              setIsOpen(true)
            }
          : undefined
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <h3 className="text-head text-lg md:text-xl font-semibold flex-1 min-w-0">
          {skill.name}
        </h3>
        {hasDescription && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? `Hide details for ${skill.name}` : `Show details for ${skill.name}`}
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

      {hasDescription && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div id={panelId} className="pt-3">
              <p className="text-body text-sm md:text-base leading-relaxed">
                {skill.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillCard
