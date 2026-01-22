import TechnologySection from './TechnologySection'
import ProjectCard from './ProjectCard'
import AchievementCard from '../journey/AchievementCard'

/**
 * ExperienceCard - Displays a single work experience entry
 */
function ExperienceCard({ experience = {}, index = 0 }) {
  if (!experience || Object.keys(experience).length === 0) return null

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'present') return 'Present'
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

  const getLevelBadge = (level) => {
    if (!level) return null
    const levelMap = {
      junior: { label: 'Junior', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      mid: { label: 'Mid-Level', color: 'bg-gold/20 text-gold border-gold/30' },
      senior: { label: 'Senior', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      lead: { label: 'Lead', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    }
    const levelInfo = levelMap[level.toLowerCase()] || { label: level, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${levelInfo.color} backdrop-blur-sm shadow-sm`}>
        {levelInfo.label}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    if (!type) return null
    return (
      <span className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs font-medium rounded border border-gold/10 shadow-sm">
        {type.charAt(0).toUpperCase() + type.slice(1)}
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
            {/* Role and Company */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
              {experience.role && (
                <h3 className="text-head text-xl md:text-2xl font-bold">
                  {experience.role}
                </h3>
              )}
              {experience.company?.name && (
                <>
                  {experience.role && <span className="text-body hidden md:inline">at</span>}
                  {experience.company.website ? (
                    <a
                      href={experience.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold text-xl md:text-2xl font-semibold hover:text-gold/80 hover:underline transition-colors cursor-pointer"
                    >
                      {experience.company.name}
                    </a>
                  ) : (
                    <span className="text-gold text-xl md:text-2xl font-semibold">
                      {experience.company.name}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Duration and Location */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {experience.duration && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-body">
                    {formatDuration(experience.duration.startDate, experience.duration.endDate)}
                  </span>
                  {experience.duration.current && (
                    <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded border border-gold/30">
                      Current
                    </span>
                  )}
                </div>
              )}
              {experience.location && getLocationString(experience.location) && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-body">
                    {getLocationString(experience.location)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {getLevelBadge(experience.level)}
            {getTypeBadge(experience.type)}
          </div>
        </div>

        {/* Company Description */}
        {experience.company?.description && (
          <p className="text-body text-sm mt-3 leading-relaxed">
            {experience.company.description}
          </p>
        )}
      </div>

      {/* Description */}
      {experience.description && (
        <div className="mb-6">
          <p className="text-body text-base leading-relaxed">
            {experience.description}
          </p>
        </div>
      )}

      {/* Responsibilities */}
      {experience.responsibilities && Array.isArray(experience.responsibilities) && experience.responsibilities.length > 0 && (
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

      {/* Achievements */}
      {experience.achievements && Array.isArray(experience.achievements) && experience.achievements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Key Achievements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experience.achievements.map((achievement, idx) => (
              <AchievementCard key={idx} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {experience.projects && Array.isArray(experience.projects) && experience.projects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Notable Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experience.projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {experience.technologies && Object.keys(experience.technologies).length > 0 && (
        <div className="mb-6">
          <TechnologySection technologies={experience.technologies} />
        </div>
      )}

      {/* Skills */}
      {experience.skills && Array.isArray(experience.skills) && experience.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collaboration */}
      {experience.collaboration && (
        <div className="mb-6">
          <h4 className="text-head text-lg font-semibold mb-3">Collaboration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experience.collaboration.teamSize && (
              <div>
                <span className="text-body text-sm">Team Size: </span>
                <span className="text-head font-medium">{experience.collaboration.teamSize}</span>
              </div>
            )}
            {experience.collaboration.crossFunctional !== undefined && (
              <div>
                <span className="text-body text-sm">Cross-functional: </span>
                <span className="text-head font-medium">
                  {experience.collaboration.crossFunctional ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {experience.collaboration.stakeholders && Array.isArray(experience.collaboration.stakeholders) && experience.collaboration.stakeholders.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-body text-sm">Stakeholders: </span>
                <span className="text-head font-medium">
                  {experience.collaboration.stakeholders.join(', ')}
                </span>
              </div>
            )}
            {experience.collaboration.methodologies && Array.isArray(experience.collaboration.methodologies) && experience.collaboration.methodologies.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-body text-sm">Methodologies: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {experience.collaboration.methodologies.map((methodology, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gold/10 text-gold text-xs rounded border border-gold/20"
                    >
                      {methodology}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {experience.feedback && (
        <div className="pt-6 border-t border-gold/20">
          <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
            {experience.feedback.rating && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold text-lg font-bold">{experience.feedback.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < parseInt(experience.feedback.rating) ? 'text-gold' : 'text-body/30'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.137a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.137a1 1 0 00-1.175 0l-2.8 2.137c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
            {experience.feedback.review && (
              <p className="text-body text-sm italic mb-2">
                "{experience.feedback.review}"
              </p>
            )}
            {experience.feedback.source && (
              <p className="text-body text-xs">
                — {experience.feedback.source}
                {experience.feedback.sourceUrl && (
                  <a
                    href={experience.feedback.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 hover:underline ml-1 cursor-pointer"
                  >
                    (View)
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExperienceCard

