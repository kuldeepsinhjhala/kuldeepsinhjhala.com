import { useNavigate } from 'react-router-dom'
import { useTabs } from '../../context/TabContext'
import kuldeepImage from '../../assets/kuldeep.png'

/**
 * HeroSection - Reusable hero section component
 * Displays greeting, name, designation, tagline, description, profile image, and quick links
 */
function HeroSection({ hero = {}, quickLinks = [], meta = {}, className = '' }) {
  const navigate = useNavigate()
  const { openTab } = useTabs()

  // Page routes mapping for tab labels
  const pageRoutes = {
    '/': 'index.jsx',
    '/journey': 'journey.jsx',
    '/experience': 'experience.jsx',
    '/education': 'education.jsx',
    '/skills': 'skills.jsx',
    '/projects': 'projects.jsx',
    '/resume': 'resume.jsx',
    // '/blog': 'blog.jsx', // Temporarily hidden
    '/achievements': 'achievements.jsx',
    '/contact': 'contact.jsx'
  }

  const handleLinkClick = (url) => {
    if (!url) return
    
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      // Use openTab to add the page as a tab
      const label = pageRoutes[url] || url.replace('/', '').replace('.jsx', '') + '.jsx'
      openTab(url, label)
    }
  }

  const getIcon = (iconName) => {
    const icons = {
      folder: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      book: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      map: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      mail: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      github: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    }
    return icons[iconName] || null
  }

  return (
    <section className={`flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-6 xl:gap-8 ${className}`}>
      {/* Content - Text and Image */}
      <div className="flex-1 w-full">
        {/* Text Content */}
        <div className="text-center lg:text-left mb-8 lg:mb-0">
          {hero.greeting && (
            <p className="text-gold text-base md:text-lg mb-2 font-medium text-center lg:text-left">
              {hero.greeting}
            </p>
          )}
          
          {hero.name && (
            <h1 className="text-head text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-center lg:text-left">
              {hero.name}
            </h1>
          )}

          {/* Profile Image - Below name on mobile/tablet only */}
          <div className="flex items-center justify-center lg:hidden mb-4">
            <div className="relative">
              <img 
                src={kuldeepImage} 
                alt={hero.profile?.alt || hero.name || 'Kuldeepsinh Jhala'} 
                className="
                  w-70 h-70
                  rounded-full object-cover
                  border-2 border-gold/20
                  hover:border-gold hover:ring-2 hover:ring-gold/50
                  transition-all duration-300
                  shadow-lg
                "
              />
              
              {/* Decorative glow effect */}
              <div 
                className="absolute inset-0 -z-10 blur-2xl opacity-20"
                style={{
                  background: 'radial-gradient(circle, rgba(201, 166, 107, 0.4) 0%, transparent 70%)',
                  transform: 'scale(1.2)'
                }}
              />
            </div>
          </div>
          
          {hero.designation && (
            <h2 className="text-gold text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4 text-center lg:text-left">
              {hero.designation}
            </h2>
          )}
          
          {hero.tagline && (
            <p className="text-head text-lg md:text-xl mb-3 md:mb-4 text-center lg:text-left">
              {hero.tagline}
            </p>
          )}
          
          {hero.subtitle && (
            <p className="text-body text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto lg:mx-0 text-justify lg:text-left">
              {hero.subtitle}
            </p>
          )}
          
          {hero.description && (
            <p className="text-body text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 text-justify lg:text-left">
              {hero.description}
            </p>
          )}

          {/* Quick Links - Mobile/Tablet only */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start lg:hidden w-full">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.url)}
                  className="
                    w-full sm:w-auto
                    px-4 py-3 sm:py-2 md:px-5 md:py-2.5 
                    bg-card/90 backdrop-blur-sm border border-gold/20 rounded
                    text-head text-sm font-medium
                    hover:border-gold hover:bg-gold/10 hover:ring-1 hover:ring-gold/50
                    transition-all duration-200 shadow-lg cursor-pointer
                    flex items-center justify-center gap-2
                    flex-1 sm:flex-initial
                  "
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                  }}
                >
                  {link.icon && getIcon(link.icon)}
                  <span>{link.label}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Content - Profile Image and Quick Links (Desktop only) */}
      <div className="hidden lg:flex flex-col items-center flex-shrink-0">
        <div className="relative mb-4 lg:mb-6">
          <img 
            src={kuldeepImage} 
            alt={hero.profile?.alt || hero.name || 'Kuldeepsinh Jhala'} 
            className="
              w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64
              rounded-full object-cover
              border-2 border-gold/20
              hover:border-gold hover:ring-2 hover:ring-gold/50
              transition-all duration-300
              shadow-lg
            "
          />
          
          {/* Decorative glow effect */}
          <div 
            className="absolute inset-0 -z-10 blur-2xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(201, 166, 107, 0.4) 0%, transparent 70%)',
              transform: 'scale(1.2)'
            }}
          />
        </div>

        {/* Quick Links - Desktop only (below image) */}
        {quickLinks && quickLinks.length > 0 && (
          <div className="flex flex-col gap-2 lg:gap-3 w-full max-w-[280px]">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link.url)}
                className="
                  px-3 py-2 lg:px-4 lg:py-2
                  bg-card/90 backdrop-blur-sm border border-gold/20 rounded
                  text-head text-xs lg:text-sm font-medium
                  hover:border-gold hover:bg-gold/10 hover:ring-1 hover:ring-gold/50
                  transition-all duration-200 shadow-lg cursor-pointer
                  flex items-center justify-center gap-2
                  w-full
                "
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                }}
              >
                {link.icon && getIcon(link.icon)}
                <span className="whitespace-nowrap">{link.label}</span>
                <svg
                  className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection

