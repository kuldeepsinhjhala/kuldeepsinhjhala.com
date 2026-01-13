import { useState, useEffect } from 'react'
import contactData from '../../data/contact.json'
import ContactInfoCard from '../../components/contact/ContactInfoCard'

function Resume() {
  const [contact, setContact] = useState(null)
  const [zoom, setZoom] = useState(100)
  const [copied, setCopied] = useState(false)

  // Load contact data for contact section
  useEffect(() => {
    try {
      setContact(contactData?.contact || {})
    } catch (error) {
      console.error('Error loading contact data:', error)
    }
  }, [])

  // Google Drive file ID extracted from the URL
  const resumeFileId = '15NUqamzDlsB0NBRFfNTtM_RIS0sO7iii'
  const resumeViewUrl = `https://drive.google.com/file/d/${resumeFileId}/preview`
  const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${resumeFileId}`
  const resumeDirectUrl = `https://drive.google.com/file/d/${resumeFileId}/view?usp=sharing`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resumeDirectUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = resumeDirectUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-head text-4xl md:text-5xl font-bold mb-2">
            Resume
          </h1>
          <p className="text-body text-lg md:text-xl">
            Download or view my resume below
          </p>
        </header>

        {/* Resume Section */}
        <section className="mb-16 md:mb-24">
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-6 lg:p-8 shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
            }}
          >
            {/* Header with Actions */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-head text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-center md:text-left">
                My Resume
              </h2>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Download Button */}
                <a
                  href={resumeDownloadUrl}
                  download
                  className="flex-1 sm:flex-initial px-4 md:px-6 py-2.5 md:py-3 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md"
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                  }}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="whitespace-nowrap">Download Resume</span>
                </a>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial px-4 md:px-6 py-2.5 md:py-3 bg-card/80 hover:bg-card/90 text-gold rounded border border-gold/20 hover:border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md"
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                  }}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="whitespace-nowrap">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="whitespace-nowrap">Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-body text-xs md:text-sm">Zoom:</span>
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="px-2 py-1 text-gold hover:text-gold/80 disabled:text-body/30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-head text-xs md:text-sm font-medium min-w-[3rem] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="px-2 py-1 text-gold hover:text-gold/80 disabled:text-body/30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom in"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="px-2 py-1 text-gold hover:text-gold/80 transition-colors text-xs"
                    aria-label="Reset zoom"
                    title="Reset to 100%"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Resume Viewer */}
            <div className="relative w-full bg-card/50 rounded-lg border border-gold/20 overflow-hidden">
              <div 
                className="w-full overflow-auto"
                style={{
                  height: 'calc(100vh - 400px)',
                  minHeight: '400px',
                  maxHeight: '900px'
                }}
              >
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: `${100 / (zoom / 100)}%`,
                    height: `${100 / (zoom / 100)}%`
                  }}
                >
                  <iframe
                    src={resumeViewUrl}
                    className="w-full h-full rounded-lg border-0"
                    style={{
                      minHeight: '600px',
                      height: '100%'
                    }}
                    title="Resume Preview"
                    allow="autoplay"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Alternative: If iframe doesn't work well, show a message */}
            <div className="mt-4 text-center space-y-2">
              <p className="text-body text-xs md:text-sm">
                Having trouble viewing?{' '}
                <a
                  href={resumeDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition-colors underline"
                >
                  Open in Google Drive
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details Section */}
        {contact && Object.keys(contact).length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ContactInfoCard contact={contact} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Resume
