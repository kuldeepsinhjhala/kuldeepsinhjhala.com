import { useState, useMemo } from 'react'
import resumeData from '../../data/resume.json'
import ResumePdfPreview from './ResumePdfPreview'

function filenameFromUrl(url) {
  try {
    const path = decodeURIComponent(new URL(url).pathname)
    const name = path.split('/').filter(Boolean).pop()
    return name || 'Kuldeepsinh-Jhala-Resume.pdf'
  } catch {
    return 'Kuldeepsinh-Jhala-Resume.pdf'
  }
}

function Resume() {
  const [copied, setCopied] = useState(false)

  const resumeLink = useMemo(() => resumeData?.resumeLink || '', [resumeData])
  const resumeFilename = useMemo(() => filenameFromUrl(resumeLink), [resumeLink])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resumeLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      const textArea = document.createElement('textarea')
      textArea.value = resumeLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async (event) => {
    event.preventDefault()
    if (!resumeLink) return

    try {
      const response = await fetch(resumeLink)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = resumeFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Failed to download resume:', error)
      window.open(resumeLink, '_blank', 'noopener,noreferrer')
    }
  }

  const actionClass =
    'px-4 sm:px-5 py-2.5 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg border border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base'

  if (!resumeLink) {
    return (
      <div className="bg-dotted py-10">
        <p className="text-body text-sm text-center">Resume link not available. Please check resume.json.</p>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-full py-4 md:py-6 lg:py-8">
      <div className="site-shell">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 px-4 bg-background rounded-t-lg border border-b-0 border-gold/20">
          <a href={resumeLink} download={resumeFilename} onClick={handleDownload} className={actionClass}>
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

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy resume link to clipboard"
            className="px-4 sm:px-5 py-2.5 bg-card/80 hover:bg-card/90 text-gold rounded-lg border border-gold/20 hover:border-gold/30 transition-colors inline-flex items-center justify-center gap-2 font-medium text-sm md:text-base"
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

        <div className="w-full rounded-b-lg border border-gold/20 bg-white overflow-hidden">
          <ResumePdfPreview url="/resume-file" />
        </div>
      </div>
    </div>
  )
}

export default Resume
