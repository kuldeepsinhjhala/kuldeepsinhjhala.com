import { useState, useMemo } from 'react'
import resumeData from '../../data/resume.json'

const cardShadow = {
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
}

function Resume() {
  const [copied, setCopied] = useState(false)

  const resumeLink = useMemo(() => resumeData?.resumeLink || '', [])

  const resumeFileId = useMemo(() => {
    if (!resumeLink) return ''
    const match = resumeLink.match(/\/d\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : ''
  }, [resumeLink])

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

  const actionClass =
    'px-4 sm:px-5 py-2.5 md:py-3 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg border border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md'

  return (
    <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h2 className="section-heading-highlight text-head text-4xl md:text-5xl font-bold mb-2">Resume</h2>
        </header>

        <section className="mb-8 md:mb-12" aria-label="Resume actions">
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg w-full"
            style={cardShadow}
          >
            {resumeDirectUrl ? (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <a
                  href={resumeDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Open in Google Drive</span>
                </a>

                {resumeDownloadUrl && (
                  <a
                    href={resumeDownloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={actionClass}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="whitespace-nowrap">Download PDF</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy resume link to clipboard"
                  className="px-4 sm:px-5 py-2.5 md:py-3 bg-card/80 hover:bg-card/90 text-gold rounded-lg border border-gold/20 hover:border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base shadow-md"
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Copy link</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-body text-sm text-center">Resume link not available. Please check resume.json.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Resume
