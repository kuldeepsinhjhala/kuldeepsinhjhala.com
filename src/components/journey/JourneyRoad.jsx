import { useState } from 'react'
import JourneyTimelineItem from './JourneyTimelineItem'
import { getJourneyMilestoneYearLabel, isJourneyItemHighlighted } from '../../utils/journeyItemUtils'
import { getJourneyOrgLogoImgStyle, resolveJourneyLogo } from '../../utils/resolveJourneyLogo'

/**
 * JourneyRoad - Road visualization component for journey timeline
 * Creates a visual road/path with timeline items as milestones
 * @param {boolean} [showContinuationBadge=true] — When false (e.g. parent shows only first N items), hides the “Journey Continues…” end marker.
 */
function JourneyRoad({ timeline = [], className = '', showContinuationBadge = true }) {
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
      <div className="relative space-y-8 md:space-y-10 lg:space-y-16 pb-8">
        {timeline.map((item, index) => {
          const isHighlighted = isJourneyItemHighlighted(item)
          const isExpanded = expandedItems[item.id || index]
          const milestoneYear = getJourneyMilestoneYearLabel(item.time)
          const milestoneLogoSrc = resolveJourneyLogo(item.organization?.logo)
          
          return (
            <div
              key={item.id || index}
              className="relative flex flex-col items-center"
            >
              {/* Road Marker/Milestone - Top Center */}
              <div className="relative z-10 flex-shrink-0 mb-4">
                {/* Background circle to hide dotted line behind glow */}
                {(isHighlighted || isExpanded) && (
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
                    ${isHighlighted ? 'border-gold ring-4 ring-gold/30 scale-110 bg-card' : 'border-gold/40 bg-card'}
                    shadow-lg cursor-pointer hover:scale-105 z-10
                    ${isExpanded ? 'ring-4 ring-gold/50' : ''}
                  `}
                  style={{
                    boxShadow: isHighlighted 
                      ? '0 0 30px rgba(201, 166, 107, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                  }}
                  onClick={() => toggleExpand(item.id || index)}
                >
                  {/* Inner Circle Glow */}
                  {isHighlighted && (
                    <div className="absolute inset-0 rounded-full bg-gold/10 animate-pulse"></div>
                  )}
                  
                  {/* Icon or company logo */}
                  <div className="relative z-10 text-gold text-xl md:text-2xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-full">
                    {milestoneLogoSrc ? (
                      <img
                        src={milestoneLogoSrc}
                        alt={
                          item.organization?.name
                            ? `${item.organization.name} logo`
                            : item.title
                              ? `Milestone: ${item.title}`
                              : 'Journey milestone'
                        }
                        className="w-full h-full object-contain p-1.5"
                        style={getJourneyOrgLogoImgStyle(item.organization?.logo)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      getIcon(item.icon || 'briefcase')
                    )}
                  </div>
                  
                  {/* Year badge from startDate */}
                  {milestoneYear && (
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-gold text-xs font-bold rounded border-2 border-gold whitespace-nowrap shadow-lg z-20"
                      style={{
                        backgroundColor: '#0A192F',
                        opacity: 1,
                      }}
                    >
                      {milestoneYear}
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

              {/* Single card: summary + chevron; expand/collapse in place (no nested card) */}
              <div className="w-full max-w-7xl mx-auto px-0 sm:px-0 mb-2 md:mb-4 lg:mb-6">
                <JourneyTimelineItem
                  item={item}
                  index={index}
                  expanded={Boolean(isExpanded)}
                  onToggle={() => toggleExpand(item.id || index)}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Road end marker — hidden when timeline is truncated (Show more in parent) */}
      {showContinuationBadge && (
        <div className="relative mt-8 flex justify-center">
          <div className="w-24 h-1 bg-gold/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-gold text-xs font-medium shadow-lg">
            Journey Continues...
          </div>
        </div>
      )}
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

export default JourneyRoad

