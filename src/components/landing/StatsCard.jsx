/**
 * StatsCard - Reusable stat card component
 * Displays a statistic with value, label, and description
 */
function StatsCard({ stat, className = '' }) {
  if (!stat) return null

  const getIcon = (iconName) => {
    const icons = {
      briefcase: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      layers: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      code: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    }
    return icons[iconName] || null
  }

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200
        text-center shadow-lg
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {stat.icon && (
        <div className="flex justify-center mb-4 text-gold">
          {getIcon(stat.icon)}
        </div>
      )}
      
      <div className="text-gold text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
        {stat.value}
        {stat.suffix && <span className="text-head">{stat.suffix}</span>}
      </div>
      
      {stat.label && (
        <h3 className="text-head text-base md:text-lg font-semibold mb-2">
          {stat.label}
        </h3>
      )}
      
      {stat.description && (
        <p className="text-body text-xs md:text-sm">
          {stat.description}
        </p>
      )}
    </div>
  )
}

export default StatsCard

