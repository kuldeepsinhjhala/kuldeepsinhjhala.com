import { useTabs } from '../context/TabContext'

function TabBar() {
  const { tabs, switchTab, closeTab } = useTabs()

  return (
    <div className="hidden lg:block sticky z-30 bg-card border-b border-gold/10" style={{ top: '48px', height: '36px' }}>
      <div className="overflow-x-auto overflow-y-hidden h-full tab-scrollbar">
        <div className="flex h-full" style={{ minWidth: 'max-content' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 border-r border-gold/10 cursor-pointer transition-all relative flex-shrink-0 ${
                tab.isActive
                  ? 'bg-bg text-head'
                  : 'bg-card text-body hover:bg-card/80 hover:text-head'
              }`}
            >
              {tab.isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"></div>
              )}
              <span className="font-mono text-xs whitespace-nowrap">{tab.label}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gold/20 flex-shrink-0 ${
                  tab.isActive ? 'opacity-100' : ''
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

