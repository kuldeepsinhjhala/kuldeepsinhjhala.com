import { useId, useState } from 'react'
import ProjectExpandedBody from './ProjectExpandedBody'
import {
  projectMediaDocuments,
  projectMediaImageList,
  projectMediaLinks,
} from '../../utils/projectMedia'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'
import { getJourneyOrgLogoImgStyle, resolveJourneyLogo } from '../../utils/resolveJourneyLogo'

function techStackHasItems(techStack) {
  if (!techStack || typeof techStack !== 'object') return false
  return Object.values(techStack).some((arr) => Array.isArray(arr) && arr.length > 0)
}

function projectHasExpandableDetails(project) {
  if (!project) return false
  if (String(project.longDescription || '').trim()) return true
  if (project.organization?.name || project.organization?.role || project.organization?.teamSize != null)
    return true
  if (project.problem?.summary || (project.problem?.constraints?.length > 0)) return true
  if (project.solution?.approach || project.solution?.architecture) return true
  if (project.features?.length > 0) return true
  if (project.challenges?.length > 0) return true
  if (techStackHasItems(project.techStack)) return true
  if (
    project.metrics &&
    Object.values(project.metrics).some((v) => v != null && String(v).trim() !== '')
  )
    return true
  if (project.skillsGained?.length > 0) return true
  if (
    projectMediaImageList(project.media).length > 0 ||
    projectMediaDocuments(project.media).length > 0 ||
    projectMediaLinks(project.media).length > 0
  )
    return true
  if (project.duration?.durationText || project.duration?.working != null) return true
  return false
}

/**
 * Single project row: summary + ExperienceCard-style V reveals full body (no second view).
 */
function ProjectCard({ project = {} }) {
  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)

  if (!project || !project.title) return null

  const getTypeBadge = (type) => {
    if (!type) return null
    return (
      <span className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs font-medium rounded border border-gold/10 shadow-sm capitalize">
        {type}
      </span>
    )
  }

  const getCategoryBadge = (category) => {
    if (!category) return null
    return (
      <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm capitalize">
        {category}
      </span>
    )
  }

  const hasDetails = projectHasExpandableDetails(project)
  const projectLogoSrc = project.logo ? resolveJourneyLogo(project.logo) : null

  return (
    <div
      className={`bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg ${hasDetails && !isOpen ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
      }}
      onClick={
        hasDetails && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              setIsOpen(true)
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        {projectLogoSrc && (
          <div className="flex-shrink-0">
            <img
              src={projectLogoSrc}
              alt={project.title ? `${project.title} logo` : 'Project logo'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-contain bg-gold/5 p-1"
              style={getJourneyOrgLogoImgStyle(project.logo)}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-3 space-y-1">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="text-head text-xl md:text-2xl font-bold">{project.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {getCategoryBadge(project.category)}
              {getTypeBadge(project.type)}
            </div>
          </div>

          {project.shortDescription && (
            <p className="text-body text-sm leading-relaxed">{project.shortDescription}</p>
          )}
        </div>

        {hasDetails && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 mt-0.5 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={
              isOpen
                ? `Collapse details for ${project.title}`
                : `Expand details for ${project.title}`
            }
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

      {hasDetails && (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div id={panelId}>
              <ProjectExpandedBody project={project} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
