import { useTabs } from '../context/TabContext'
import { useRef, useEffect } from 'react'

function TabBar() {
  const { tabs, switchTab, closeTab } = useTabs()
  const scrollContainerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  // Enable mouse wheel scrolling
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e) => {
      // Only scroll horizontally if content overflows
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
        // Add class to show scrollbar during scrolling
        container.classList.add('scrolling')
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(() => {
          container.classList.remove('scrolling')
        }, 1000)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="block sticky z-30 bg-card border-b border-gold/10" style={{ top: '48px', height: '36px' }}>
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden h-full tab-scrollbar tab-scrollbar-hover"
      >
        <div className="flex h-full" style={{ minWidth: 'max-content' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 border-r border-gold/10 cursor-pointer transition-all relative flex-shrink-0 ${
                tab.isActive
                  ? 'bg-gold/10 text-gold border-l-4 border-l-gold shadow-lg shadow-gold/20'
                  : 'bg-card/60 text-body/70 hover:bg-card/80 hover:text-body'
              }`}
            >
              {tab.isActive && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gold"></div>
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold"></div>
                  <div className="absolute inset-0 bg-gold/10 pointer-events-none"></div>
                </>
              )}
              <span className={`font-mono text-xs whitespace-nowrap relative z-10 ${
                tab.isActive ? 'font-bold text-gold drop-shadow-sm' : 'font-normal'
              }`}>{tab.label}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`relative z-10 opacity-100 transition-opacity p-1 rounded hover:bg-gold/30 flex-shrink-0 ${
                  tab.isActive ? 'text-gold hover:text-gold' : ''
                }`}
                aria-label={`Close ${tab.label}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TabBar

