import { useState } from 'react'

/**
 * AchievementCard - Displays an achievement card with expandable details
 */
function AchievementCard({ achievement = {} }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!achievement || !achievement.title) return null

  const formatDate = (dateString) => {
    if (!dateString) return ''
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

  const getCategoryBadge = (category) => {
    if (!category) return null
    return (
      <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm capitalize">
        {category}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    if (!type) return null
    return (
      <span className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs font-medium rounded border border-gold/10 shadow-sm capitalize">
        {type.replace(/-/g, ' ')}
      </span>
    )
  }

  const getRecognitionLevelBadge = (level) => {
    if (!level) return null
    const levelMap = {
      institutional: { label: 'Institutional', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      national: { label: 'National', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      international: { label: 'International', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      regional: { label: 'Regional', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    }
    const levelInfo = levelMap[level.toLowerCase()] || { label: level, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${levelInfo.color} backdrop-blur-sm shadow-sm capitalize`}>
        {levelInfo.label}
      </span>
    )
  }

  const isFeatured = achievement.visibility?.featured || false

  return (
    <>
      {/* Compact Card View */}
      {!isExpanded && (
        <div
          className={`
            relative bg-card/90 backdrop-blur-sm border rounded-lg p-4 md:p-5 lg:p-6 shadow-lg cursor-pointer hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all duration-200 h-full flex flex-col
            ${isFeatured ? 'border-gold ring-2 ring-gold/30' : 'border-gold/20'}
          `}
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
          }}
          onClick={() => setIsExpanded(true)}
        >
          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
              <span className="px-2 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium rounded border border-gold/30 shadow-sm whitespace-nowrap">
                Featured
              </span>
            </div>
          )}

          {/* Header */}
          <div className="mb-3 pr-16">
            <h3 className="text-head text-lg md:text-xl font-bold mb-2">
              {achievement.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {getCategoryBadge(achievement.category)}
              {getTypeBadge(achievement.type)}
            </div>
          </div>

          {/* Organization */}
          {achievement.organization && (
            <div className="mb-3 flex items-center gap-2">
              {achievement.organization.logo && (
                <img
                  src={achievement.organization.logo}
                  alt={achievement.organization.name}
                  className="w-6 h-6 rounded object-contain"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-gold text-sm font-medium truncate">
                  {achievement.organization.name}
                </p>
                {achievement.organization.type && (
                  <p className="text-body text-xs capitalize">
                    {achievement.organization.type}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          {achievement.date && (
            <div className="mb-3 flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-body">
                {achievement.date.achievedOn ? formatDate(achievement.date.achievedOn) : achievement.date.year}
              </span>
            </div>
          )}

          {/* Description - Truncated */}
          {achievement.description && (
            <p className="text-body text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
              {achievement.description}
            </p>
          )}

          {/* Impact Summary */}
          {achievement.impact?.summary && (
            <div className="mb-4">
              <p className="text-gold text-xs font-semibold mb-1">Impact:</p>
              <p className="text-body text-xs leading-relaxed">
                {achievement.impact.summary}
              </p>
            </div>
          )}

          {/* Skills Preview */}
          {achievement.skillsDemonstrated && Array.isArray(achievement.skillsDemonstrated) && achievement.skillsDemonstrated.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {achievement.skillsDemonstrated.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
                >
                  {skill}
                </span>
              ))}
              {achievement.skillsDemonstrated.length > 3 && (
                <span className="px-2 py-0.5 text-body text-xs">
                  +{achievement.skillsDemonstrated.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="mt-auto w-full px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded border border-gold/20 hover:border-gold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>View Details</span>
            <svg 
              className="w-4 h-4 transition-transform"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="col-span-full">
          <div
            className={`
              relative bg-card/95 backdrop-blur-sm border-2 rounded-lg p-4 md:p-6 lg:p-8 shadow-xl
              ${isFeatured ? 'border-gold' : 'border-gold/40'}
            `}
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 166, 107, 0.1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 z-20 text-gold hover:text-gold/80 transition-colors rounded-full p-1 border border-gold/20 hover:border-gold shadow-lg"
              style={{
                backgroundColor: 'var(--c-card)'
              }}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 pr-12">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                {isFeatured && (
                  <span className="px-2 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium rounded border border-gold/30 shadow-sm">
                    Featured
                  </span>
                )}
                {getCategoryBadge(achievement.category)}
                {getTypeBadge(achievement.type)}
                {achievement.custom?.recognitionLevel && getRecognitionLevelBadge(achievement.custom.recognitionLevel)}
              </div>
              <h2 className="text-head text-2xl md:text-3xl font-bold mb-4">
                {achievement.title}
              </h2>
            </div>

            {/* Organization */}
            {achievement.organization && (
              <div className="mb-6 pb-6 border-b border-gold/20">
                <div className="flex items-center gap-3">
                  {achievement.organization.logo && (
                    <img
                      src={achievement.organization.logo}
                      alt={achievement.organization.name}
                      className="w-12 h-12 rounded object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-gold text-lg font-semibold">
                      {achievement.organization.name}
                    </h3>
                    {achievement.organization.type && (
                      <p className="text-body text-sm capitalize">
                        {achievement.organization.type}
                      </p>
                    )}
                    {achievement.organization.website && (
                      <a
                        href={achievement.organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 hover:underline text-sm transition-colors inline-flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        Visit Website
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Date */}
            {achievement.date && (
              <div className="mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-body text-sm">
                  <span className="text-head font-medium">Achieved on: </span>
                  {achievement.date.achievedOn ? formatDate(achievement.date.achievedOn) : achievement.date.year}
                </span>
              </div>
            )}

            {/* Description */}
            {achievement.description && (
              <div className="mb-6">
                <p className="text-body text-base md:text-lg leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            )}

            {/* Impact Section */}
            {achievement.impact && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Impact</h4>
                {achievement.impact.summary && (
                  <p className="text-body text-sm mb-4 leading-relaxed">
                    {achievement.impact.summary}
                  </p>
                )}
                {achievement.impact.metrics && Array.isArray(achievement.impact.metrics) && achievement.impact.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {achievement.impact.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg p-4 text-center"
                      >
                        <div className="text-gold text-2xl font-bold mb-1">
                          {metric.value}
                        </div>
                        <div className="text-head text-sm font-medium mb-1">
                          {metric.label}
                        </div>
                        {metric.unit && (
                          <div className="text-body text-xs">
                            {metric.unit}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skills Demonstrated */}
            {achievement.skillsDemonstrated && Array.isArray(achievement.skillsDemonstrated) && achievement.skillsDemonstrated.length > 0 && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Skills Demonstrated</h4>
                <div className="flex flex-wrap gap-2">
                  {achievement.skillsDemonstrated.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Section */}
            {achievement.evidence && (
              <div className="mb-6">
                <h4 className="text-head text-lg font-semibold mb-3">Evidence</h4>
                <div className="space-y-3">
                  {achievement.evidence.certificateUrl && (
                    <a
                      href={achievement.evidence.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold hover:text-gold/80 hover:underline transition-colors text-sm cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Certificate
                    </a>
                  )}
                  {achievement.evidence.proofUrl && (
                    <a
                      href={achievement.evidence.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold hover:text-gold/80 hover:underline transition-colors text-sm ml-4 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Proof
                    </a>
                  )}
                  {achievement.evidence.media && Array.isArray(achievement.evidence.media) && achievement.evidence.media.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievement.evidence.media.map((media, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-gold/20">
                          {media.type === 'image' && (
                            <img
                              src={media.url}
                              alt={media.caption || 'Achievement evidence'}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          {media.caption && (
                            <p className="p-2 text-body text-xs text-center bg-card/50">
                              {media.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Notes */}
            {achievement.custom?.notes && (
              <div className="mb-6 pt-6 border-t border-gold/20">
                <h4 className="text-head text-lg font-semibold mb-3">Additional Notes</h4>
                <p className="text-body text-sm leading-relaxed italic">
                  {achievement.custom.notes}
                </p>
              </div>
            )}

            {/* Related Project */}
            {achievement.custom?.relatedProject && (
              <div className="pt-6 border-t border-gold/20">
                <p className="text-body text-sm">
                  <span className="text-head font-medium">Related Project: </span>
                  <span className="text-gold">{achievement.custom.relatedProject}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AchievementCard

