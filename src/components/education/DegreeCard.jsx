import { useState } from 'react'
import ProjectCard from '../experience/ProjectCard'
import CertificationCard from './CertificationCard'
import msuLogo from '../../assets/Msu_logo.png'
import bhsLogo from '../../assets/bhs_logo.jpeg'
import gtuLogo from '../../assets/Gtu_logo.png'

/**
 * DegreeCard - Displays a single academic degree entry
 */
function DegreeCard({ degree = {}, index = 0 }) {
  if (!degree || Object.keys(degree).length === 0) return null

  // State for managing marksheet visibility and modal
  const [showMarksheets, setShowMarksheets] = useState(false)
  const [selectedMarksheet, setSelectedMarksheet] = useState(null)

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
      className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Header Section */}
      <div className="mb-6 pb-6 border-b border-gold/20">
        <div className="flex flex-col gap-4">
          <div className="flex-1 min-w-0">
            {/* Degree and Field */}
            <div className="mb-3">
              {degree.degree && (
                <h3 className="text-head text-xl md:text-2xl font-bold mb-1">
                  {degree.degree}
                </h3>
              )}
              {degree.field && (
                <p className="text-gold text-lg md:text-xl font-semibold">
                  {degree.field}
                </p>
              )}
            </div>

            {/* Institution */}
            {degree.institution?.name && (
              <div className="mb-3">
                <div className="flex items-center gap-3 mb-2">
                  {/* Institution Logo */}
                  {degree.institution.logo && (
                    <div className="flex-shrink-0">
                      {degree.institution.logo.includes('Msu_logo') ? (
                        <img
                          src={msuLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-12 w-auto object-contain"
                          style={{
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      ) : degree.institution.logo.includes('bhs_logo') ? (
                        <img
                          src={bhsLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-12 w-auto object-contain"
                        />
                      ) : degree.institution.logo.includes('Gtu_logo') ? (
                        <img
                          src={gtuLogo}
                          alt={`${degree.institution.name} logo`}
                          className="h-12 w-auto object-contain"
                          style={{
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      ) : (
                        <img
                          src={degree.institution.logo}
                          alt={`${degree.institution.name} logo`}
                          className="h-12 w-auto object-contain"
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
                        className="text-head text-lg font-medium hover:text-gold hover:underline transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        {degree.institution.name}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-head text-lg font-medium">
                        {degree.institution.name}
                      </span>
                    )}
                  </div>
                </div>
                {degree.institution.affiliation && (
                  <p className="text-body text-sm mt-1">
                    {degree.institution.type && (
                      <span className="capitalize">{degree.institution.type}</span>
                    )}
                    {degree.institution.type && degree.institution.affiliation && ' - '}
                    {degree.institution.affiliation}
                  </p>
                )}
                {degree.institution.location && getLocationString(degree.institution.location) && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
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
              <div className="flex items-center gap-2 text-sm mb-3">
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

          {/* Badges - full width row so they wrap on mobile */}
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
        </div>
      </div>

      {/* Performance */}
      {degree.performance && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Academic Performance</h4>
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
        <div className="mb-6">
          <p className="text-body text-base leading-relaxed">
            {degree.description}
          </p>
        </div>
      )}

      {/* Relevant Coursework */}
      {degree.relevantCoursework && Array.isArray(degree.relevantCoursework) && degree.relevantCoursework.length > 0 && (
        <div className="mb-6 min-w-0">
          <h4 className="text-head text-lg font-semibold mb-3">Relevant Coursework</h4>
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
      {degree.projects && Array.isArray(degree.projects) && degree.projects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Academic Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degree.projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {degree.achievements && Array.isArray(degree.achievements) && degree.achievements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Achievements</h4>
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
      {degree.certifications && Array.isArray(degree.certifications) && degree.certifications.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Related Certifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degree.certifications.map((cert, idx) => (
              <CertificationCard key={idx} certification={cert} />
            ))}
          </div>
        </div>
      )}

      {/* Activities and societies */}
      {degree.custom?.activitiesAndSocieties && Array.isArray(degree.custom.activitiesAndSocieties) && degree.custom.activitiesAndSocieties.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Activities and societies</h4>
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
      {degree.custom?.testScores && Array.isArray(degree.custom.testScores) && degree.custom.testScores.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Test scores</h4>
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
      {degree.custom && (() => {
        const skipKeys = ['scholarships', 'hostel', 'exchangePrograms', 'activitiesAndSocieties', 'testScores']
        const entries = Object.entries(degree.custom).filter(([k]) => !skipKeys.includes(k))
        const hasScholarships = degree.custom.scholarships?.length > 0
        const hasHostel = degree.custom.hostel !== undefined
        const hasAny = hasScholarships || hasHostel || entries.length > 0
        if (!hasAny) return null
        return (
          <div className="pt-6 border-t border-gold/20">
            <div className="space-y-2">
              {hasScholarships && (
                <div>
                  <span className="text-head text-sm font-semibold">Scholarships: </span>
                  <span className="text-body text-sm">
                    {degree.custom.scholarships.join(', ')}
                  </span>
                </div>
              )}
              {hasHostel && (
                <div>
                  <span className="text-head text-sm font-semibold">Hostel: </span>
                  <span className="text-body text-sm">
                    {degree.custom.hostel ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
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

      {/* Marksheets Section */}
      {degree.marksheets && Array.isArray(degree.marksheets) && degree.marksheets.length > 0 && (
        <div className="pt-6 border-t border-gold/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h4 className="text-head text-lg font-semibold">Marksheets</h4>
            <button
              onClick={() => setShowMarksheets(!showMarksheets)}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg text-head hover:bg-gold/10 hover:border-gold transition-all duration-200 shadow-sm text-sm w-full sm:w-auto"
            >
              <span className="text-xs font-medium">
                {showMarksheets ? 'Hide' : 'View'} Marksheets
              </span>
              <svg
                className={`w-4 h-4 text-gold transition-transform duration-300 ${
                  showMarksheets ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Marksheets Grid with Dropdown Animation */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showMarksheets
                ? 'max-h-[10000px] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {degree.marksheets.map((marksheet, idx) => (
                <div
                  key={marksheet.id || idx}
                  className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg overflow-hidden shadow-lg hover:border-gold/50 transition-all duration-200"
                >
                  {/* Marksheet Image */}
                  <div
                    className="relative w-full aspect-[3/4] bg-bg overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedMarksheet(marksheet)}
                  >
                    <img
                      src={marksheet.image}
                      alt={marksheet.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%23112240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23C9A66B" font-family="Arial" font-size="18"%3EMarksheet Image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0v6m0-6h6m-6 0H4"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Marksheet Info */}
                  <div className="p-3">
                    <h5 className="text-head text-sm font-semibold mb-1.5">
                      {marksheet.name}
                    </h5>
                    <div className="space-y-0.5 text-xs">
                      {marksheet.semester && (
                        <p className="text-body">
                          <span className="text-gold font-medium">Semester: </span>
                          {marksheet.semester}
                        </p>
                      )}
                      {marksheet.year && (
                        <p className="text-body">
                          <span className="text-gold font-medium">Year: </span>
                          {marksheet.year}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marksheet Modal */}
      {selectedMarksheet && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-shadow/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMarksheet(null)}
          >
            {/* Modal Content */}
            <div
              className="relative max-w-5xl max-h-[90vh] w-full bg-card border border-gold/20 rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMarksheet(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg text-head hover:text-gold hover:border-gold transition-all duration-200"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
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

              {/* Marksheet Info Header */}
              <div className="p-4 border-b border-gold/20 bg-card/90">
                <h3 className="text-head text-xl font-bold mb-1">
                  {selectedMarksheet.name}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-body">
                  {selectedMarksheet.semester && (
                    <span>
                      <span className="text-gold font-medium">Semester: </span>
                      {selectedMarksheet.semester}
                    </span>
                  )}
                  {selectedMarksheet.year && (
                    <span>
                      <span className="text-gold font-medium">Year: </span>
                      {selectedMarksheet.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Marksheet Image */}
              <div className="overflow-auto max-h-[calc(90vh-120px)] bg-bg">
                <img
                  src={selectedMarksheet.image}
                  alt={selectedMarksheet.name}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"%3E%3Crect width="800" height="1200" fill="%23112240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23C9A66B" font-family="Arial" font-size="24"%3EMarksheet Image Not Found%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DegreeCard

