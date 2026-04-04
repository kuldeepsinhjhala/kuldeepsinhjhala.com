import { useId, useState } from 'react'
import SkillCard from './SkillCard'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'

/**
 * SkillCategoryCard — collapsed: category name only. Chevron reveals description + nested skills.
 */
function SkillCategoryCard({ category = {} }) {
  if (!category || !category.name) return null

  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const skills = category.skills || []
  const hasSkills = skills.length > 0
  const hasCategoryDescription = Boolean(
    category.description && String(category.description).trim()
  )
  const hasExpandableContent = hasCategoryDescription || hasSkills

  return (
    <div
      className={`bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg ${hasExpandableContent && !isOpen ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
      }}
      onClick={
        hasExpandableContent && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              setIsOpen(true)
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-head text-2xl md:text-3xl font-bold">{category.name}</h2>
        </div>
        {hasExpandableContent && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 mt-1 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? `Collapse ${category.name}` : `Expand ${category.name}`}
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

      {hasExpandableContent && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div id={panelId} className="pt-5 sm:pt-6 space-y-4">
              {hasCategoryDescription && (
                <p className="text-body text-sm md:text-base leading-relaxed">
                  {category.description}
                </p>
              )}
              {hasSkills &&
                skills.map((skill, index) => (
                  <SkillCard key={skill.id || index} skill={skill} />
                ))}
            </div>
          </div>
        </div>
      )}

      {!hasExpandableContent && (
        <p className="text-body text-sm text-center py-4 mt-2">No skills listed in this category.</p>
      )}
    </div>
  )
}

export default SkillCategoryCard
