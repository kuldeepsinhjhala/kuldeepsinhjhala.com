import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

function PdfPage({ pdf, pageNumber, width }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!pdf || !width) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    let cancelled = false
    let renderTask

    async function draw() {
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
      renderTask = page.render({ canvasContext: context, canvas, viewport })
      await renderTask.promise
    }

    draw().catch((error) => {
      if (!cancelled) console.error('Failed to render PDF page', error)
    })

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [pdf, pageNumber, width])

  return <canvas ref={canvasRef} className="block w-full bg-white" />
}

export default function ResumePdfPreview({ url }) {
  const containerRef = useRef(null)
  const [pdf, setPdf] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [width, setWidth] = useState(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const node = containerRef.current
    if (!node) return undefined

    const updateWidth = () => {
      const next = Math.floor(node.clientWidth)
      setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!url) return undefined

    let cancelled = false
    let loadingTask
    let doc

    async function load() {
      setStatus('loading')
      setPdf(null)
      setPageCount(0)

      loadingTask = getDocument({
        url,
        withCredentials: false,
        disableRange: true,
        disableStream: true,
      })
      doc = await loadingTask.promise
      if (cancelled) {
        doc.destroy()
        return
      }

      setPdf(doc)
      setPageCount(doc.numPages)
      setStatus('ready')
    }

    load().catch((error) => {
      if (!cancelled) {
        console.error('Failed to load PDF', error)
        setStatus('error')
      }
    })

    return () => {
      cancelled = true
      loadingTask?.destroy()
      doc?.destroy()
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
