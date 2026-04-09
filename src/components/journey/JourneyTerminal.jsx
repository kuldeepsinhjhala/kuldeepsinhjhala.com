import { useState, useRef, useEffect } from 'react'
import JourneyTimelineItem from './JourneyTimelineItem'
import logo from '../../assets/lion-logo-sm.png'
import { getJourneyMilestoneYearLabel, isJourneyItemHighlighted } from '../../utils/journeyItemUtils'

/**
 * JourneyTerminal - Terminal-style horizontal scroll component for journey timeline
 * Displays journey items in a terminal window with horizontal scrolling
 * Clicking a card expands it within the terminal
 */
function JourneyTerminal({ timeline = [], className = '' }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollContainerRef = useRef(null)
  const expandedCardRef = useRef(null)

  if (!timeline || timeline.length === 0) return null

  const handleCardClick = (item) => {
    if (selectedItem?.id === item.id && isExpanded) {
      // Close if clicking the same card
      setSelectedItem(null)
      setIsExpanded(false)
    } else {
      // Open new card
      setSelectedItem(item)
      setIsExpanded(true)
    }
  }

  // Scroll expanded card into view
  useEffect(() => {
    if (isExpanded && expandedCardRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        expandedCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }, 100)
    }
  }, [isExpanded, selectedItem])

  // Get icon component
  const getIcon = (iconName) => {
    const icons = {
      lightbulb: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      school: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      book: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      briefcase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    }
    return icons[iconName] || icons.briefcase
  }

  // Format time period
  const formatTimePeriod = (time) => {
    if (time.startDate && time.endDate) {
      const start = formatDate(time.startDate)
      const end = time.endDate === 'present' ? 'Present' : formatDate(time.endDate)
      return `${start} - ${end}`
    }
    return ''
  }

  // Format date
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

  return (
    <div className={className}>
      {/* Terminal Window */}
      <div className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-gold/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Terminal Window Controls */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-body text-xs font-mono ml-2">journey-terminal</span>
          </div>
          <div className="flex items-center gap-1.5 text-body/50 text-xs font-mono">
            <img 
              src={logo} 
              alt="Logo" 
              width={128}
              height={124}
              className="h-3 w-auto object-contain opacity-90"
              style={{
                filter: 'brightness(0) invert(1) sepia(100%) saturate(200%) hue-rotate(20deg)'
              }}
            />
            <span>kuldeepsinhjhala.com</span>
          </div>
        </div>

        {/* Terminal Body - Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="bg-card/90 backdrop-blur-sm p-4 overflow-x-auto overflow-y-hidden journey-terminal-scroll"
          style={{
            maxHeight: '600px',
            minHeight: '400px'
          }}
        >
          <div className="flex gap-4 min-w-max pb-4">
            {timeline.map((item, index) => {
              const isSelected = selectedItem?.id === item.id && isExpanded
              const isHighlighted = isJourneyItemHighlighted(item)
              const milestoneYear = getJourneyMilestoneYearLabel(item.time)

              if (isSelected) {
                // Expanded Card View
                return (
                  <div
                    key={item.id || index}
                    ref={expandedCardRef}
                    className="flex-shrink-0 w-[90vw] md:w-[800px] lg:w-[1000px] relative"
                  >
                    <div className="bg-card/95 backdrop-blur-sm border-2 border-gold rounded-lg p-6 md:p-8 shadow-xl relative">
                      {/* Close Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItem(null)
                          setIsExpanded(false)
                        }}
                        className="absolute top-4 right-4 z-10 text-gold hover:text-gold/80 transition-colors bg-card/80 backdrop-blur-sm rounded-full p-1 border border-gold/20 hover:border-gold"
                        aria-label="Close"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Full Timeline Item */}
                      <JourneyTimelineItem item={item} index={index} />
                    </div>
                  </div>
                )
              } else {
                // Compact Card View
                return (
                  <div
                    key={item.id || index}
                    onClick={() => handleCardClick(item)}
                    className={`
                      flex-shrink-0 w-72 md:w-80 cursor-pointer
                      transition-all duration-300
                      ${isHighlighted ? 'ring-2 ring-gold/30' : ''}
                    `}
                  >
                    <div
                      className={`
                        bg-card/90 backdrop-blur-sm border rounded-lg p-5
                        transition-all duration-300 shadow-lg
                        ${isHighlighted ? 'border-gold' : 'border-gold/20'}
                        hover:border-gold hover:ring-1 hover:ring-gold/50 hover:scale-105
                        h-full
                      `}
                      style={{
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                      }}
                    >
                      {/* Icon and Year */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border-2 border-gold/30">
                          {getIcon(item.icon || 'briefcase')}
                        </div>
                        {milestoneYear && (
                          <span className="px-2 py-1 bg-gold/10 text-gold text-xs font-bold rounded border border-gold/20">
                            {milestoneYear}
                          </span>
                        )}
                      </div>

                      {/* Time Period */}
                      {item.time && (
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-gold/10 text-gold text-xs font-medium rounded border border-gold/20">
                            {formatTimePeriod(item.time)}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      {item.title && (
                        <h3 className="text-head text-lg font-bold mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                      )}

                      {/* Subtitle */}
                      {item.subtitle && (
                        <p className="text-gold text-sm mb-3 line-clamp-2">
                          {item.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p className="text-body text-xs mb-4 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Skills Preview */}
                      {item.skills && Array.isArray(item.skills) && item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 2 && (
                            <span className="px-2 py-0.5 text-body text-xs">
                              +{item.skills.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Click to Expand Hint */}
                      <div className="text-gold text-xs font-medium flex items-center gap-1 mt-auto">
                        <span>Click to expand</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="bg-card/80 backdrop-blur-sm border-t border-gold/20 px-4 py-2 text-center">
          <p className="text-body text-xs">
            <span className="text-gold">← →</span> Scroll horizontally to view all journey milestones
          </p>
        </div>
      </div>
    </div>
  )
}

export default JourneyTerminal

