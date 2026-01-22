import ProjectCard from '../experience/ProjectCard'
import CertificationCard from './CertificationCard'

/**
 * DegreeCard - Displays a single academic degree entry
 */
function DegreeCard({ degree = {}, index = 0 }) {
  if (!degree || Object.keys(degree).length === 0) return null

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
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
      diploma: { label: 'Diploma', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      bachelor: { label: "Bachelor's", color: 'bg-gold/20 text-gold border-gold/30' },
      master: { label: "Master's", color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      phd: { label: 'PhD', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    }
    const levelInfo = levelMap[level.toLowerCase()] || { label: level, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${levelInfo.color} backdrop-blur-sm shadow-sm`}>
        {levelInfo.label}
      </span>
    )
  }

  const getGradeBadge = (grade) => {
    if (!grade) return null
    return (
      <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm">
        {grade}
      </span>
    )
  }

  return (
    <div
      className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Header Section */}
      <div className="mb-6 pb-6 border-b border-gold/20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
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

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {getLevelBadge(degree.level)}
            {degree.performance?.grade && getGradeBadge(degree.performance.grade)}
            {degree.status?.current && (
              <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm">
                Current
              </span>
            )}
            {degree.status?.completed && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/30 backdrop-blur-sm shadow-sm">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {degree.performance.gpa && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-2xl font-bold">
                  {degree.performance.gpa}
                </div>
                <div className="text-body text-xs mt-1">
                  GPA / {degree.performance.gpaScale || '10'}
                </div>
              </div>
            )}
            {degree.performance.percentage !== undefined && degree.performance.percentage !== null && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-2xl font-bold">
                  {degree.performance.percentage}%
                </div>
                <div className="text-body text-xs mt-1">Percentage</div>
              </div>
            )}
            {degree.performance.grade && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
                <div className="text-gold text-xl font-bold">
                  {degree.performance.grade}
                </div>
                <div className="text-body text-xs mt-1">Grade</div>
              </div>
            )}
            {degree.performance.rank && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-3 text-center">
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
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Relevant Coursework</h4>
          <div className="flex flex-wrap gap-2">
            {degree.relevantCoursework.map((course, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
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

      {/* Custom Fields */}
      {degree.custom && Object.keys(degree.custom).length > 0 && (
        <div className="pt-6 border-t border-gold/20">
          <div className="space-y-2">
            {degree.custom.scholarships && Array.isArray(degree.custom.scholarships) && degree.custom.scholarships.length > 0 && (
              <div>
                <span className="text-head text-sm font-semibold">Scholarships: </span>
                <span className="text-body text-sm">
                  {degree.custom.scholarships.join(', ')}
                </span>
              </div>
            )}
            {degree.custom.hostel !== undefined && (
              <div>
                <span className="text-head text-sm font-semibold">Hostel: </span>
                <span className="text-body text-sm">
                  {degree.custom.hostel ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DegreeCard

