/**
 * TechnologySection - Displays technologies organized by category
 */
function TechnologySection({ technologies = {} }) {
  if (!technologies || Object.keys(technologies).length === 0) return null

  const categories = [
    { key: 'languages', label: 'Languages', icon: 'code' },
    { key: 'frameworks', label: 'Frameworks', icon: 'layers' },
    { key: 'databases', label: 'Databases', icon: 'database' },
    { key: 'cloud', label: 'Cloud', icon: 'cloud' },
    { key: 'devOps', label: 'DevOps', icon: 'settings' },
    { key: 'tools', label: 'Tools', icon: 'wrench' },
  ]

  const getIcon = (iconName) => {
    const icons = {
      code: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      layers: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      database: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      cloud: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      wrench: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    }
    return icons[iconName] || null
  }

  return (
    <div>
      <h4 className="text-head text-lg font-semibold mb-4">Technologies</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const items = technologies[category.key]
          if (!items || !Array.isArray(items) || items.length === 0) return null

          return (
            <div
              key={category.key}
              className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 shadow-md"
              style={{
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="text-gold">
                  {getIcon(category.icon)}
                </div>
                <h5 className="text-head text-sm font-semibold">
                  {category.label}
                </h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-card/90 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        })}

        {/* Custom Technologies */}
        {technologies.custom && Object.keys(technologies.custom).length > 0 && (
          Object.entries(technologies.custom).map(([key, items]) => {
            if (!Array.isArray(items) || items.length === 0) return null
            return (
              <div
                key={key}
                className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 shadow-md"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                }}
              >
                <h5 className="text-head text-sm font-semibold mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-card/90 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TechnologySection

