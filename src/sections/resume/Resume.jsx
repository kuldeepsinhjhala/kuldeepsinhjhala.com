import { useState, useMemo } from 'react'
import resumeData from '../../data/resume.json'

function Resume() {
  const [zoom, setZoom] = useState(100)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Extract file ID from Google Drive link and generate URLs
  const resumeLink = useMemo(() => resumeData?.resumeLink || '', [])
  
  const resumeFileId = useMemo(() => {
    if (!resumeLink) return ''
    // Extract file ID from Google Drive URL
    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match = resumeLink.match(/\/d\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : ''
  }, [resumeLink])

  const resumeViewUrl = useMemo(() => {
    if (!resumeFileId) return ''
    return `https://drive.google.com/file/d/${resumeFileId}/preview`
  }, [resumeFileId])

  const resumeDownloadUrl = useMemo(() => {
    if (!resumeFileId) return ''
    return `https://drive.google.com/uc?export=download&id=${resumeFileId}`
  }, [resumeFileId])

  const resumeDirectUrl = useMemo(() => resumeLink, [resumeLink])

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

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Standard A4 aspect ratio (8.27" x 11.69") ≈ 0.707
  // US Letter aspect ratio (8.5" x 11") ≈ 0.7727
  // Using A4 as it's more common for resumes
  const pdfAspectRatio = 0.707 // A4 aspect ratio

  return (
    <div className="bg-dotted px-3 pb-1.5 pt-0 sm:px-4 sm:pb-2 sm:pt-0 md:px-6 md:pb-3 md:pt-0 lg:px-8 lg:pb-4 lg:pt-0 xl:px-12 xl:pb-6 xl:pt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
          <h1 className="section-heading-highlight text-head text-3xl sm:text-4xl md:text-5xl font-bold">
            Resume
          </h1>
        </header>

        {/* Resume Section */}
        <section className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {/* Download, copy link, and zoom — single row */}
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {resumeDownloadUrl && (
              <a
                href={resumeDownloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-4 md:px-5 py-2 md:py-2.5 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md cursor-pointer"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)',
                }}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="whitespace-nowrap">Download Resume</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 sm:px-4 md:px-5 py-2 md:py-2.5 bg-card/80 hover:bg-card/90 text-gold rounded border border-gold/20 hover:border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md"
              style={{
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)',
              }}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="whitespace-nowrap">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">Copy Link</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 sm:gap-2 bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg px-1 py-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1.5 sm:px-2 sm:py-1.5 text-gold hover:text-gold/80 disabled:text-body/30 disabled:cursor-not-allowed transition-colors rounded"
                aria-label="Zoom out"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-head text-xs md:text-sm font-medium min-w-[2.75rem] text-center tabular-nums">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1.5 sm:px-2 sm:py-1.5 text-gold hover:text-gold/80 disabled:text-body/30 disabled:cursor-not-allowed transition-colors rounded"
                aria-label="Zoom in"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 py-1 text-gold hover:text-gold/80 transition-colors text-xs md:text-sm rounded"
                aria-label="Reset zoom"
                title="Reset to 100%"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Resume Viewer */}
          <div className="relative w-full bg-card/50 rounded-lg border border-gold/20 overflow-hidden">
            {/* Loader */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-body text-sm md:text-base">Loading resume...</p>
                </div>
              </div>
            )}

            <div
              className="w-full overflow-auto"
              style={{
                height: 'calc(100vh - 350px)',
                minHeight: '500px',
                maxHeight: '1000px',
              }}
            >
              <div className="flex justify-center p-2 md:p-4">
                <div
                  className="relative"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    width: 'min(100%, 210mm)',
                    aspectRatio: pdfAspectRatio,
                    maxWidth: '100%',
                  }}
                >
                  {resumeViewUrl ? (
                    <iframe
                      src={resumeViewUrl}
                      className="w-full h-full rounded-lg border-0"
                      style={{
                        minHeight: '100%',
                        height: '100%',
                      }}
                      title="Resume Preview"
                      allow="autoplay"
                      loading="lazy"
                      onLoad={handleIframeLoad}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[500px] text-body">
                      <p>Resume link not available. Please check resume.json</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {resumeDirectUrl && (
            <div className="mt-3 sm:mt-4 text-center space-y-2">
              <p className="text-body text-xs sm:text-sm md:text-base">
                Having trouble viewing?{' '}
                <a
                  href={resumeDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition-colors underline cursor-pointer"
                >
                  Open in Google Drive
                </a>
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Resume
