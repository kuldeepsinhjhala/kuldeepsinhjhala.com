import { useId } from 'react'
import ProjectCard from '../experience/ProjectCard'
import CertificationCard from './CertificationCard'
import ProjectMediaSection from '../projects/ProjectMediaSection'
import { getJourneyOrgLogoImgStyle } from '../../utils/resolveJourneyLogo'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'
import msuLogo from '../../assets/Msu_logo.png'
import bhsLogo from '../../assets/bhs_logo.jpeg'
import gtuLogo from '../../assets/Gtu_logo.png'

/**
 * DegreeCard - Displays a single academic degree entry
 * When `onToggle` is passed (e.g. from Education), summary is always visible; full details toggle like JourneyRoad items.
 */
function DegreeCard({ degree = {}, index = 0, expanded, onToggle }) {
  const panelId = useId()

  if (!degree || Object.keys(degree).length === 0) return null

  const collapsible = typeof onToggle === 'function'
  const showDetails = !collapsible || Boolean(expanded)

  const degreeMediaForSection = (() => {
    const m = degree.media
    if (!m || typeof m !== 'object') return null
    const images = Array.isArray(m.images) ? m.images : []
    const documents = Array.isArray(m.documents) ? m.documents : []
    const links = Array.isArray(m.links) ? m.links : []
    if (images.length === 0 && documents.length === 0 && links.length === 0) return null
    return { ...m, images, documents, links }
  })()

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      // Year-only (e.g. "2007", "2019") → show as-is
      if (/^\d{4}$/.test(String(dateString).trim())) return String(dateString).trim()
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
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
    return parts.join(', ')
  }

  const getLevelBadge = (level) => {
    if (!level) return null
    const levelMap = {
      school: { label: 'School', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      diploma: { label: 'Diploma', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      bachelor: { label: "Bachelor's", color: 'bg-gold/20 text-gold border-gold/30' },
      master: { label: "Master's", color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      phd: { label: 'PhD', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    }
    const levelInfo = levelMap[level.toLowerCase()] || { label: level, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${levelInfo.color} backdrop-blur-sm shadow-sm whitespace-nowrap`}>
        {levelInfo.label}
      </span>
    )
  }

  const getGradeBadge = (grade) => {
    if (!grade) return null
    return (
      <span className="inline-flex px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm">
        {grade}
      </span>
    )
  }

  return (
    <div
      className={`bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-3 sm:p-5 md:p-6 shadow-lg ${collapsible && !showDetails ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
      onClick={
        collapsible && !showDetails
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              onToggle()
            }
          : undefined
      }
    >
      {/* Header Section */}
      <div className="mb-4 flex items-start gap-2.5 sm:gap-3 min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="min-w-0">
            {/* Degree and Field */}
            <div className="mb-2">
              {degree.degree && (
                <h3 className="text-head text-lg md:text-xl font-bold mb-0.5">
                  {degree.degree}
                </h3>
              )}
              {degree.field && (
                <p className="text-gold text-base md:text-lg font-semibold">
                  {degree.field}
                </p>
              )}
            </div>

            {/* Institution */}
            {degree.institution?.name && (
              <div className="mb-2">
                <div className="flex items-center gap-2.5 mb-1">
                  {/* Institution Logo */}
                  {degree.institution.logo && (
                    <div className="flex-shrink-0">
                      {degree.institution.logo.includes('Msu_logo') ? (
                        <img
                          src={msuLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-10 w-auto object-contain"
                          style={{
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      ) : degree.institution.logo.includes('bhs_logo') ? (
                        <img
                          src={bhsLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-10 w-auto object-contain"
                        />
                      ) : degree.institution.logo.includes('Gtu_logo') ? (
                        <img
                          src={gtuLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-10 w-auto object-contain"
                          style={{
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      ) : (
                        <img
                          src={degree.institution.logo}
                          alt={`${degree.institution.name} logo`}
                          className="h-10 w-auto object-contain"
                        />
                      )}
                    </div>
                  )}
                  {/* Institution Name */}
                  <div className="flex-1">
                    {degree.institution.website ? (
                      <a
                        href={degree.institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-head text-base font-medium hover:text-gold hover:underline transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        {degree.institution.name}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-head text-base font-medium">
                        {degree.institution.name}
                      </span>
                    )}
                  </div>
                </div>
                {degree.institution.location && getLocationString(degree.institution.location) && (
                  <div className="flex items-center gap-2 mt-1.5 text-sm">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-body">
                      {getLocationString(degree.institution.location)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Duration */}
            {degree.duration && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-body">
                  {formatDuration(degree.duration.startDate, degree.duration.endDate)}
                </span>
                {degree.duration.graduationDate && (
                  <span className="text-body text-xs">
                    (Graduated: {formatDate(degree.duration.graduationDate)})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Badges — hidden when accordion is collapsed (Education page) */}
          {(!collapsible || showDetails) && (
            <div className="flex flex-wrap gap-2 w-full min-w-0">
              {getLevelBadge(degree.level)}
              {degree.performance?.grade && getGradeBadge(degree.performance.grade)}
              {degree.status?.current && (
                <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm whitespace-nowrap">
                  Current
                </span>
              )}
              {degree.status?.completed && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/30 backdrop-blur-sm shadow-sm whitespace-nowrap">
                  Completed
                </span>
              )}
            </div>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 flex items-center justify-center min-h-8 min-w-8 mt-0.5 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={showDetails}
            aria-controls={panelId}
            aria-label={
              showDetails
                ? `Collapse details for ${degree.degree || 'degree'}`
                : `Expand details for ${degree.degree || 'degree'}`
            }
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
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

      {(() => {
        const content = (
          <>
      {/* Performance */}
      {degree.performance && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Academic Performance</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {degree.performance.gpa && (
              <div className="min-w-0 bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-2xl font-bold">
                  {degree.performance.gpa}
                </div>
                <div className="text-body text-xs mt-1">
                  GPA / {degree.performance.gpaScale || '10'}
                </div>
              </div>
            )}
            {degree.performance.percentage !== undefined && degree.performance.percentage !== null && (
              <div className="min-w-0 bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-2xl font-bold">
                  {degree.performance.percentage}%
                </div>
                <div className="text-body text-xs mt-1">Percentage</div>
              </div>
            )}
            {degree.performance.grade && (
              <div className="min-w-0 bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center overflow-hidden">
                <div className="text-gold text-base sm:text-xl font-bold break-words">
                  {degree.performance.grade}
                </div>
                <div className="text-body text-xs mt-1">Grade</div>
              </div>
            )}
            {degree.performance.rank && (
              <div className="min-w-0 bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-2xl font-bold">
                  #{degree.performance.rank}
                </div>
                <div className="text-body text-xs mt-1">Rank</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {degree.description && (
        <div className="mb-5">
          <p className="text-body text-base leading-relaxed">
            {degree.description}
          </p>
        </div>
      )}

      {/* Relevant Coursework */}
      {degree.relevantCoursework &&
        Array.isArray(degree.relevantCoursework) &&
        degree.relevantCoursework.length > 0 && (
        <div className="mb-5 min-w-0">
          <h4 className="text-head text-base font-semibold mb-2">Relevant Coursework</h4>
          <div className="flex flex-wrap gap-2">
            {degree.relevantCoursework.map((course, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 sm:px-3 bg-card/80 backdrop-blur-sm text-body text-xs sm:text-sm rounded border border-gold/10 shadow-sm break-words"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {degree.projects &&
        Array.isArray(degree.projects) &&
        degree.projects.length > 0 && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Academic Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degree.projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {degree.achievements &&
        Array.isArray(degree.achievements) &&
        degree.achievements.length > 0 && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Achievements</h4>
          <ul className="space-y-2">
            {degree.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gold mt-1.5">•</span>
                <span className="text-body text-sm leading-relaxed flex-1">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Degree-specific Certifications */}
      {degree.certifications &&
        Array.isArray(degree.certifications) &&
        degree.certifications.length > 0 && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Related Certifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degree.certifications.map((cert, idx) => (
              <CertificationCard key={idx} certification={cert} />
            ))}
          </div>
        </div>
      )}

      {degreeMediaForSection && (
        <div className="mb-5">
          <ProjectMediaSection
            media={degreeMediaForSection}
            projectTitle={degree.degree || 'Education'}
            embedded
            imgStyle={(raw) => getJourneyOrgLogoImgStyle(raw)}
          />
        </div>
      )}

      {/* Activities and societies */}
      {degree.custom?.activitiesAndSocieties &&
        Array.isArray(degree.custom.activitiesAndSocieties) &&
        degree.custom.activitiesAndSocieties.length > 0 && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Activities and societies</h4>
          <ul className="space-y-2">
            {degree.custom.activitiesAndSocieties.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gold mt-1.5">•</span>
                <span className="text-body text-sm leading-relaxed flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test scores (e.g. semester SPI) */}
      {degree.custom?.testScores &&
        Array.isArray(degree.custom.testScores) &&
        degree.custom.testScores.length > 0 && (
        <div className="mb-5">
          <h4 className="text-head text-base font-semibold mb-2">Test scores</h4>
          <div className="space-y-4">
            {degree.custom.testScores.map((item, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-gold font-semibold">{item.score}</span>
                  {item.semester && (
                    <span className="text-body text-sm">Semester {item.semester}</span>
                  )}
                  {item.date && (
                    <span className="text-body text-sm">
                      {formatDate(item.date)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-body text-sm leading-relaxed mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {degree.custom &&
        (() => {
        const skipKeys = ['scholarships', 'hostel', 'exchangePrograms', 'activitiesAndSocieties', 'testScores']
        const entries = Object.entries(degree.custom).filter(([k]) => !skipKeys.includes(k))
        if (entries.length === 0) return null
        return (
          <div className="pt-5 border-t border-gold/20">
            <div className="space-y-2">
              {entries.map(([key, value]) => {
                if (value == null || (typeof value === 'object' && !Array.isArray(value))) return null
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
                return (
                  <div key={key}>
                    <span className="text-head text-sm font-semibold">{label}: </span>
                    <span className="text-body text-sm">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
        })()}

          </>
        )
        if (!collapsible) return content
        return (
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
              showDetails ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                id={panelId}
                role="region"
                aria-label={degree.degree ? `Details for ${degree.degree}` : 'Degree details'}
                className="pt-2 sm:pt-3"
              >
                {content}
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

export default DegreeCard

