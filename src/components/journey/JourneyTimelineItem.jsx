import { useMemo } from 'react'
import AchievementCard from './AchievementCard'
import SkillsList from './SkillsList'
import ReflectionCard from './ReflectionCard'

/**
 * JourneyTimelineItem - Reusable component for displaying a timeline entry
 * Shows all details of a journey milestone including time, organization, activities, achievements, skills, and reflections
 */
function JourneyTimelineItem({ item = {}, index = 0 }) {
  if (!item || !item.id) return null

  // Get icon component
  const getIcon = (iconName) => {
    const icons = {
      lightbulb: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      school: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      book: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      briefcase: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    }
    return icons[iconName] || icons.briefcase
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'present') return 'Present'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  // Format time period
  const timePeriod = useMemo(() => {
    const time = item.time || {}
    if (time.startDate && time.endDate) {
      return `${formatDate(time.startDate)} - ${formatDate(time.endDate)}`
    }
    if (time.year && time.month) {
      return `${time.month} ${time.year}`
    }
    if (time.year) {
      return time.year
    }
    return ''
  }, [item.time])

  const isFeatured = item.status?.featured || item.status?.highlighted
  const iconName = item.icon || 'briefcase'
  const color = item.color || 'blue'

  return (
    <div
      className={`
        relative bg-card/90 backdrop-blur-sm border rounded-lg p-6 md:p-8
        transition-all duration-300 shadow-lg
        ${isFeatured ? 'border-gold ring-2 ring-gold/30' : 'border-gold/20'}
        ${isFeatured ? 'hover:ring-gold/50' : 'hover:border-gold hover:ring-1 hover:ring-gold/50'}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
          <span className="px-2 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium rounded border border-gold/30 shadow-sm whitespace-nowrap">
            Featured
          </span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
            {getIcon(iconName)}
          </div>
        </div>

        {/* Title and Time */}
        <div className="flex-1">
          {/* Time Period */}
          {timePeriod && (
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded border border-gold/20">
                {timePeriod}
              </span>
              {item.time?.duration && (
                <span className="ml-2 text-body text-xs">
                  ({item.time.duration})
                </span>
              )}
            </div>
          )}

          {/* Title */}
          {item.title && (
            <h3 className="text-head text-xl md:text-2xl font-bold mb-2">
              {item.title}
            </h3>
          )}

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-gold text-sm md:text-base mb-3">
              {item.subtitle}
            </p>
          )}

          {/* Organization */}
          {item.organization && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-body text-sm">
                {item.organization.role || ''}
                {item.organization.name && ` at `}
                {item.organization.name && (
                  <span className="text-head font-medium">
                    {item.organization.name}
                  </span>
                )}
              </span>
              {item.organization.website && (
                <a
                  href={item.organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 hover:scale-110 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-2 text-body text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                {[item.location.city, item.location.state, item.location.country]
                  .filter(Boolean)
                  .join(', ')}
                {item.location.mode && ` • ${item.location.mode}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-body text-sm md:text-base mb-6 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Activities */}
      {item.activities && Array.isArray(item.activities) && item.activities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-sm font-semibold mb-3">Key Activities</h4>
          <ul className="space-y-2">
            {item.activities.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-2 text-body text-sm">
                <span className="text-gold mt-1">•</span>
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {item.achievements && Array.isArray(item.achievements) && item.achievements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-head text-sm font-semibold mb-3">Achievements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.achievements.map((achievement, idx) => (
              <AchievementCard key={idx} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {item.skills && Array.isArray(item.skills) && item.skills.length > 0 && (
        <div className="mb-6">
          <SkillsList skills={item.skills} />
        </div>
      )}

      {/* Reflection */}
      {item.reflection && (
        <div className="mb-6">
          <ReflectionCard reflection={item.reflection} />
        </div>
      )}

      {/* Media Links */}
      {item.media?.links && Array.isArray(item.media.links) && item.media.links.length > 0 && (
        <div className="pt-4 border-t border-gold/10">
          <div className="flex flex-wrap gap-2">
            {item.media.links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-gold hover:ring-1 hover:ring-gold/30 transition-all shadow-sm cursor-pointer"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                }}
              >
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {new URL(link).hostname.replace('www.', '')}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default JourneyTimelineItem

