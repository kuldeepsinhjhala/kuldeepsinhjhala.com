import { useCopilot } from '../context/CopilotContext'

function CopilotButton() {
  const { isOpen, setIsOpen } = useCopilot()

  // Only show when panel is closed
  if (isOpen) return null

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="hidden lg:flex fixed items-center gap-1.5 px-2 bg-bg border border-gold/20 rounded text-head hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all z-30 group"
      style={{ 
        top: '8px', 
        right: '16px',
        height: '32px',
        boxSizing: 'border-box'
      }}
      aria-label="Open Cursor Copilot"
    >
      <div className="relative flex-shrink-0">
        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col items-start justify-center leading-none">
        <span className="text-head text-[11px] font-semibold leading-tight">kuldeep Copilot</span>
        <span className="text-body text-[9px] leading-tight">
          Ask about <span className="text-gold">Kuldeep</span>
        </span>
      </div>
    </button>
  )
}

export default CopilotButton

