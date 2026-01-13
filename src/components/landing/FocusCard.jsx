/**
 * FocusCard - Reusable focus/working on card component
 * Displays a focus item with title, description, and optional icon
 */
function FocusCard({ item, className = '' }) {
  if (!item) return null

  const getIcon = (iconName) => {
    const icons = {
      server: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      cloud: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      zap: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    }
    return icons[iconName] || null
  }

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200 shadow-lg
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {item.icon && (
        <div className="flex items-center gap-3 mb-3">
          <div className="text-gold">
            {getIcon(item.icon)}
          </div>
          {item.title && (
            <h3 className="text-head text-lg md:text-xl font-semibold">
              {item.title}
            </h3>
          )}
        </div>
      )}
      
      {item.title && !item.icon && (
        <h3 className="text-head text-lg md:text-xl font-semibold mb-3">
          {item.title}
        </h3>
      )}
      
      {item.description && (
        <p className="text-body text-sm md:text-base">
          {item.description}
        </p>
      )}
    </div>
  )
}

export default FocusCard

