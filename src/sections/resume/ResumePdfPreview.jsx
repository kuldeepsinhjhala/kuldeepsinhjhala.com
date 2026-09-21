import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

function isBenignPdfError(error) {
  const name = error?.name || ''
  const message = String(error?.message || error || '')
  return (
    name === 'RenderingCancelledException' ||
    name === 'AbortException' ||
    message.includes('Rendering cancelled') ||
    message.includes('Worker was terminated') ||
    message.includes('Transport destroyed') ||
    message.includes('Unable to send')
  )
}

function PdfPage({ pdf, pageNumber, width }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!pdf || !width) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    let cancelled = false
    let renderTask

    async function draw() {
      try {
        const page = await pdf.getPage(pageNumber)
        if (cancelled) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const base = page.getViewport({ scale: 1 })
        const scale = width / base.width
        const viewport = page.getViewport({ scale: scale * dpr })

        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.width = `${Math.floor(width)}px`
        canvas.style.height = `${Math.floor(base.height * scale)}px`

        const context = canvas.getContext('2d', { alpha: false })
        if (!context || cancelled) return

        renderTask = page.render({ canvasContext: context, viewport })
        await renderTask.promise
      } catch (error) {
        if (cancelled || isBenignPdfError(error)) return
        console.error('Failed to render PDF page', error)
      }
    }

    draw()

    return () => {
      cancelled = true
      try {
        renderTask?.cancel()
      } catch {
        // ignore cancel races during route changes
      }
    }
  }, [pdf, pageNumber, width])

  return <canvas ref={canvasRef} className="block w-full bg-white" />
}

export default function ResumePdfPreview({ url }) {
  const containerRef = useRef(null)
  const pdfRef = useRef(null)
  const [pdf, setPdf] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [width, setWidth] = useState(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const node = containerRef.current
    if (!node) return undefined

    let active = true
    const updateWidth = () => {
      if (!active) return
      const next = Math.floor(node.clientWidth)
      setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!url) return undefined

    let cancelled = false
    let loadingTask

    async function load() {
      setStatus('loading')
      setPdf(null)
      setPageCount(0)
      pdfRef.current = null

      loadingTask = getDocument({
        url,
        withCredentials: false,
        disableRange: true,
        disableStream: true,
      })

      const doc = await loadingTask.promise
      if (cancelled) {
        try {
          await doc.destroy()
        } catch {
          // ignore teardown races
        }
        return
      }

      pdfRef.current = doc

      // Re-check after storing — navigation may have started during the await
      if (cancelled) {
        pdfRef.current = null
        try {
          await doc.destroy()
        } catch {
          // ignore teardown races
        }
        return
      }

      if (cancelled) return

      setPdf(doc)
      setPageCount(doc.numPages)
      setStatus('ready')
    }

    load().catch((error) => {
      if (cancelled || isBenignPdfError(error)) return
      console.error('Failed to load PDF', error)
      setStatus('error')
    })

    return () => {
      cancelled = true

      const doc = pdfRef.current
      pdfRef.current = null

      // Destroy once — resolved doc if ready, otherwise the in-flight loading task
      const teardown = doc ? doc.destroy() : loadingTask?.destroy?.()
      Promise.resolve(teardown).catch(() => {})
    }
  }, [url])

  return (
    <div ref={containerRef} className="w-full bg-white">
      {status === 'loading' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-body text-sm">Loading resume...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center justify-center min-h-[40vh] px-4">
          <p className="text-body text-sm text-center">Unable to preview the resume. Use Download PDF.</p>
        </div>
      )}
      {status === 'ready' && pdf && width > 0 && (
        <div className="flex flex-col gap-3 pb-3">
          {Array.from({ length: pageCount }, (_, index) => (
            <PdfPage key={index + 1} pdf={pdf} pageNumber={index + 1} width={width} />
          ))}
        </div>
      )}
    </div>
  )
}
