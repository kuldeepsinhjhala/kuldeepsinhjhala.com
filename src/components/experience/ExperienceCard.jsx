import { useId, useState } from 'react'
import TechnologySection from './TechnologySection'
import ProjectCard from './ProjectCard'
import AchievementCard from '../journey/AchievementCard'
import { getJourneyOrgLogoImgStyle, resolveJourneyLogo } from '../../utils/resolveJourneyLogo'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'
import MediaPreviewGrid from '../media/MediaPreviewGrid'
import {
  combinedMediaPreviewEntries,
  mediaBlockHasRenderableContent,
  partitionDocumentEntries,
} from '../../utils/projectMedia'

/**
 * ExperienceCard - Displays a single work experience entry (collapsible summary + full detail)
 */
function ExperienceCard({ experience = {} }) {
  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)

  if (!experience || Object.keys(experience).length === 0) return null

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'present') return 'Present'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    } catch {
      return dateString
    }
  }

  const formatDuration = (startDate, endDate) => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)
    if (start === end) return start
    return `${start} - ${end}`
  }

  const getLocationString = (location) => {
    if (!location) return ''
    const parts = []
    if (location.city) parts.push(location.city)
    if (location.state) parts.push(location.state)
    if (location.country) parts.push(location.country)

    const locationStr = parts.join(', ')
    const workType = []
    if (location.remote) workType.push('Remote')
    if (location.hybrid) workType.push('Hybrid')
    if (location.onsite) workType.push('On-site')

    if (workType.length > 0) {
      return `${locationStr} (${workType.join(', ')})`
    }
    return locationStr
  }

  const getTypeBadge = (type) => {
    if (!type) return null
    return (
      <span className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs font-medium rounded border border-gold/10 shadow-sm">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const mediaExtLinks = Array.isArray(experience.media?.links) ? experience.media.links : []
  const hasMediaBlock = mediaBlockHasRenderableContent(experience.media)
  const previewEntries = combinedMediaPreviewEntries(experience.media)
  const { otherDocuments } = partitionDocumentEntries(experience.media?.documents)

  const hasDetails =
    !!experience.description ||
    (experience.responsibilities?.length > 0) ||
    (experience.achievements?.length > 0) ||
    (experience.projects?.length > 0) ||
    (experience.technologies && Object.keys(experience.technologies).length > 0) ||
    hasMediaBlock

  const companyLogoSrc =
    experience.company?.logo && resolveJourneyLogo(experience.company.logo)

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
      {/* Summary row + chevron — logo always visible (collapsed + expanded header) */}
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        {companyLogoSrc && (
          <div className="flex-shrink-0">
            <img
              src={companyLogoSrc}
              alt={experience.company?.name ? `${experience.company.name} logo` : ''}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-contain bg-gold/5 p-1"
              style={getJourneyOrgLogoImgStyle(experience.company?.logo)}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-3 space-y-1">
            {experience.role && (
              <h3 className="text-head text-xl md:text-2xl font-bold">{experience.role}</h3>
            )}
            {experience.company?.name && (
              <p className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-body text-sm sm:text-base shrink-0">at</span>
                {experience.company.website ? (
                  <a
                    href={experience.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold text-lg md:text-2xl font-semibold hover:text-gold/80 hover:underline transition-colors break-words"
                  >
                    {experience.company.name}
                  </a>
                ) : (
                  <span className="text-gold text-lg md:text-2xl font-semibold break-words">
                    {experience.company.name}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
            {experience.duration && (
              <div className="flex flex-wrap items-center gap-2">
                <svg
                  className="w-4 h-4 text-gold flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-body">
                  {formatDuration(
                    experience.duration.startDate,
                    experience.duration.endDate
                  )}
                </span>
                {experience.duration.current && (
                  <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded border border-gold/30">
                    Current
                  </span>
                )}
              </div>
            )}
            {experience.location && getLocationString(experience.location) && (
              <div className="flex items-start gap-2 min-w-0">
                <svg
                  className="w-4 h-4 text-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-body break-words">
                  {getLocationString(experience.location)}
                </span>
              </div>
            )}
          </div>

          {experience.type && (
            <div className="flex flex-wrap gap-2">{getTypeBadge(experience.type)}</div>
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
                ? `Collapse details for ${experience.role || 'role'}`
                : `Expand details for ${experience.role || 'role'}`
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
            <div id={panelId} className="pt-5 sm:pt-6">
          {experience.description && (
            <div className="mb-6">
              <p className="text-body text-base leading-relaxed">{experience.description}</p>
            </div>
          )}

          {experience.responsibilities &&
            Array.isArray(experience.responsibilities) &&
            experience.responsibilities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {experience.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gold mt-1.5">•</span>
                      <span className="text-body text-sm leading-relaxed flex-1">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {experience.achievements &&
            Array.isArray(experience.achievements) &&
            experience.achievements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Key Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.achievements.map((ach, idx) => (
                    <AchievementCard key={idx} achievement={ach} />
                  ))}
                </div>
              </div>
            )}

          {experience.projects &&
            Array.isArray(experience.projects) &&
            experience.projects.length > 0 && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Notable Projects</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.projects.map((project, idx) => (
                    <ProjectCard key={idx} project={project} />
                  ))}
                </div>
              </div>
            )}

          {experience.technologies && Object.keys(experience.technologies).length > 0 && (
            <div className="mb-6">
              <TechnologySection technologies={experience.technologies} />
            </div>
          )}

          {hasMediaBlock && (
            <div className="mb-6 pt-4 border-t border-gold/10 space-y-4">
              {previewEntries.length > 0 && (
                <div>
                  <h4 className="text-head text-sm font-semibold mb-2">Media</h4>
                  <MediaPreviewGrid
                    entries={previewEntries}
                    resolveSrc={(u) => resolveJourneyLogo(u) || u}
                    imgStyle={(raw) => getJourneyOrgLogoImgStyle(raw)}
                    defaultAlt="Experience media"
                  />
                </div>
              )}
              {otherDocuments.length > 0 && (
                <div>
                  <h4 className="text-head text-sm font-semibold mb-2">Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {otherDocuments.map((entry, idx) => {
                      const url = entry?.url
                      if (!url) return null
                      const label = entry.label || 'Document'
                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-gold hover:ring-1 hover:ring-gold/30 transition-all shadow-sm"
                          style={{
                            boxShadow:
                              '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)',
                          }}
                        >
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 flex-shrink-0 text-gold"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            {label}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
              {mediaExtLinks.length > 0 && (
                <div>
                  <h4 className="text-head text-sm font-semibold mb-2">Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {mediaExtLinks.map((link, idx) => {
                      let host = link
                      try {
                        host = new URL(link).hostname.replace('www.', '')
                      } catch {
                        /* keep raw */
                      }
                      return (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-gold hover:ring-1 hover:ring-gold/30 transition-all shadow-sm"
                          style={{
                            boxShadow:
                              '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)',
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            {host}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExperienceCard
