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
        className="overflow-x-auto overflow-y-hidden h-full tab-scrollbar tab-scrollbar-visible"
      >
        <div className="flex h-full" style={{ minWidth: 'max-content' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 border-r border-gold/10 cursor-pointer transition-all relative flex-shrink-0 ${
                tab.isActive
                  ? 'text-head shadow-xl'
                  : 'bg-card/60 text-body/70 hover:bg-card/80 hover:text-gold hover:border-l-2 hover:border-l-gold/50'
              }`}
              style={tab.isActive ? { backgroundColor: '#112240', opacity: 1 } : {}}
            >
              <span className={`font-mono text-xs whitespace-nowrap relative z-10 ${
                tab.isActive ? 'font-bold text-head' : 'font-normal'
              }`}>{tab.label}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`relative z-10 opacity-100 transition-all p-1 rounded hover:bg-card/80 hover:scale-110 flex-shrink-0 cursor-pointer ${
                  tab.isActive ? 'text-head hover:text-head' : 'text-body hover:text-gold'
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

