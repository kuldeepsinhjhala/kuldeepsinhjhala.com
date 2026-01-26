import { useState } from 'react'
import JourneyTimelineItem from './JourneyTimelineItem'

/**
 * JourneyRoad - Road visualization component for journey timeline
 * Creates a visual road/path with timeline items as milestones
 */
function JourneyRoad({ timeline = [], className = '' }) {
  const [expandedItems, setExpandedItems] = useState({})

  if (!timeline || timeline.length === 0) return null

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => {
      // If clicking the same item that's already expanded, close it
      if (prev[itemId]) {
        return {}
      }
      // Otherwise, close all others and open this one
      return { [itemId]: true }
    })
  }

  return (
    <div className={`relative ${className}`}>
      {/* Road Path - Vertical road with center line - Always centered */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 md:w-3">
        {/* Road Base - Darker road surface */}
        <div className="absolute inset-0 bg-gold/30 rounded-full"></div>
        
        {/* Road Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold/40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gold/40"></div>
        
        {/* Road Center Line (dashed) */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 15px, rgba(201, 166, 107, 0.6) 15px, rgba(201, 166, 107, 0.6) 20px)',
          }}
        ></div>
      </div>

      {/* Road Shadow/Glow Effect - Always centered */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 md:w-3 blur-sm opacity-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(201, 166, 107, 0.2), rgba(201, 166, 107, 0.1))',
        }}
      ></div>

      {/* Timeline Items */}
      <div className="relative space-y-16 md:space-y-20 lg:space-y-32 pb-8">
        {timeline.map((item, index) => {
          const isFeatured = item.status?.featured || item.status?.highlighted
          const isExpanded = expandedItems[item.id || index]
          
          return (
            <div
              key={item.id || index}
              className="relative flex flex-col items-center"
            >
              {/* Road Marker/Milestone - Top Center */}
              <div className="relative z-10 flex-shrink-0 mb-4">
                {/* Background circle to hide dotted line behind glow */}
                {(isFeatured || isExpanded) && (
                  <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-0"
                    style={{
                      width: 'calc(100% + 24px)',
                      height: 'calc(100% + 24px)',
                      backgroundColor: '#0A192F',
                    }}
                  ></div>
                )}
                
                <div
                  className={`
                    relative w-16 h-16 md:w-20 md:h-20 rounded-full
                    flex items-center justify-center
                    border-4 transition-all duration-300
                    ${isFeatured ? 'border-gold ring-4 ring-gold/30 scale-110 bg-gold/20' : 'border-gold/40 bg-card/90 backdrop-blur-sm'}
                    shadow-lg cursor-pointer hover:scale-105 z-10
                    ${isExpanded ? 'ring-4 ring-gold/50' : ''}
                  `}
                  style={{
                    boxShadow: isFeatured 
                      ? '0 0 30px rgba(201, 166, 107, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                  }}
                  onClick={() => toggleExpand(item.id || index)}
                >
                  {/* Inner Circle Glow */}
                  {isFeatured && (
                    <div className="absolute inset-0 rounded-full bg-gold/10 animate-pulse"></div>
                  )}
                  
                  {/* Icon */}
                  <div className="relative z-10 text-gold text-xl md:text-2xl">
                    {getIcon(item.icon || 'briefcase')}
                  </div>
                  
                  {/* Year Badge */}
                  {item.time?.year && (
                    <div 
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-gold text-xs font-bold rounded border-2 border-gold whitespace-nowrap shadow-lg z-20"
                      style={{
                        backgroundColor: '#0A192F',
                        opacity: 1
                      }}
                    >
                      {item.time.year}
                    </div>
                  )}

                  {/* Milestone Number */}
                  <div 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-gold flex items-center justify-center text-gold text-xs font-bold shadow-lg z-20"
                    style={{
                      backgroundColor: '#0A192F',
                      opacity: 1
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content Card - Centered below milestone - Only show if not expanded */}
              {!isExpanded && (
                <div className="w-full max-w-[90%] md:w-[500px] lg:w-[600px] mx-auto px-2 sm:px-4 md:px-0 mb-4 md:mb-0">
                  <div
                    className={`
                      relative bg-card/90 backdrop-blur-sm border rounded-lg p-3 sm:p-4 md:p-5 lg:p-6
                      transition-all duration-300 shadow-lg
                      ${isFeatured ? 'border-gold ring-2 ring-gold/30' : 'border-gold/20'}
                      hover:border-gold hover:ring-1 hover:ring-gold/50
                      cursor-pointer
                    `}
                    style={{
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                    }}
                    onClick={() => toggleExpand(item.id || index)}
                  >
                    {/* Featured Badge - Stacked on small screens, absolute on larger screens */}
                    {isFeatured && (
                      <div className="relative mb-3 sm:mb-0 sm:absolute sm:top-2 sm:right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 z-10 flex justify-center sm:justify-end">
                        <span className="px-2 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium rounded border border-gold/30 shadow-sm whitespace-nowrap">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Time Period - Stack vertically on small screens */}
                    {item.time && (
                      <div className={`mb-3 text-center ${isFeatured ? 'sm:pt-0' : ''}`}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                          <span className="inline-block px-2 sm:px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded border border-gold/20 break-words">
                            {formatTimePeriod(item.time)}
                          </span>
                          {item.time.duration && (
                            <span className="text-body text-xs whitespace-nowrap">
                              ({item.time.duration})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    {item.title && (
                      <h3 className="text-head text-base sm:text-lg md:text-xl font-bold mb-2 text-center break-words">
                        {item.title}
                      </h3>
                    )}

                    {/* Subtitle */}
                    {item.subtitle && (
                      <p className="text-gold text-xs sm:text-sm mb-3 text-center break-words">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Organization */}
                    {item.organization && (
                      <div className="flex items-center justify-center gap-2 mb-3 text-body text-sm">
                        <span>
                          {item.organization.role || ''}
                          {item.organization.name && ` at `}
                          {item.organization.name && (
                            <span className="text-head font-medium">
                              {item.organization.name}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Description - Truncated */}
                    {item.description && (
                      <p className="text-body text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2 text-center break-words">
                        {item.description}
                      </p>
                    )}

                    {/* Skills Preview - Limited */}
                    {item.skills && Array.isArray(item.skills) && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {item.skills.slice(0, 2).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {item.skills.length > 2 && (
                          <span className="px-2 py-1 text-body text-xs">
                            +{item.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(item.id || index)
                      }}
                      className="w-full mt-4 px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded border border-gold/20 hover:border-gold transition-all duration-200 flex items-center justify-center gap-2"
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
                </div>
              )}

              {/* Expanded Details - Centered on the road */}
              {isExpanded && (
                <div className="w-full max-w-[95%] md:w-[800px] lg:w-[900px] mx-auto mt-4 mb-8 md:mb-12 px-2 sm:px-4 md:px-0">
                  <div className="bg-card/95 backdrop-blur-sm border-2 border-gold rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl relative">
                    {/* Close Button */}
                    <button
                      onClick={() => toggleExpand(item.id || index)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-30 text-gold hover:text-gold/80 transition-colors rounded-full p-1.5 sm:p-2 border border-gold/20 hover:border-gold shadow-lg flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--c-card)'
                      }}
                      aria-label="Close"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {/* Add padding-top to prevent overlap with close button on small screens */}
                    <div className="pt-10 sm:pt-12 md:pt-0">
                      <JourneyTimelineItem item={item} index={index} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Road End Marker */}
      <div className="relative mt-8 flex justify-center">
        <div className="w-24 h-1 bg-gold/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-gold text-xs font-medium shadow-lg">
          Journey Continues...
        </div>
      </div>
    </div>
  )
}

// Helper function to get icon
function getIcon(iconName) {
  const icons = {
    lightbulb: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    school: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    book: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    briefcase: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  }
  return icons[iconName] || icons.briefcase
}

// Helper function to format time period
function formatTimePeriod(time) {
  if (time.startDate && time.endDate) {
    const start = formatDate(time.startDate)
    const end = time.endDate === 'present' ? 'Present' : formatDate(time.endDate)
    return `${start} - ${end}`
  }
  if (time.year && time.month) {
    return `${time.month} ${time.year}`
  }
  if (time.year) {
    return time.year
  }
  return ''
}

// Helper function to format date
function formatDate(dateString) {
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

export default JourneyRoad

