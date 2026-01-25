import { useEffect, useRef } from 'react'

/**
 * CustomCursor - Professional dot + ring cursor with hover effects
 * Disabled on touch devices for accessibility
 */
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isHoveringRef = useRef(false)
  const animationFrameRef = useRef(null)
  const ringSizeRef = useRef(30)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current

    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2

    // Smooth ring follow with easing (higher value = less lag, faster follow)
    const ease = 0.35

    const updateRing = () => {
      const dx = mouseX - ringX
      const dy = mouseY - ringY
      
      ringX += dx * ease
      ringY += dy * ease

      const size = ringSizeRef.current
      ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`

      animationFrameRef.current = requestAnimationFrame(updateRing)
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot follows instantly (offset by half of dot size: 8px / 2 = 4px)
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`

      // Start ring animation if not already running
      if (!animationFrameRef.current) {
        updateRing()
      }
    }

    const handleMouseDown = () => {
      if (ring) {
        const currentSize = ringSizeRef.current
        ring.style.transform = `translate(${ringX - currentSize / 2}px, ${ringY - currentSize / 2}px) scale(0.9)`
        ring.style.transition = 'transform 0.1s ease-out'
      }
    }

    const handleMouseUp = () => {
      if (ring) {
        const currentSize = ringSizeRef.current
        ring.style.transform = `translate(${ringX - currentSize / 2}px, ${ringY - currentSize / 2}px) scale(1)`
        ring.style.transition = 'transform 0.2s ease-out'
      }
    }

    // Handle hover states for clickable elements
    const handleMouseEnter = () => {
      if (ring && !isHoveringRef.current) {
        isHoveringRef.current = true
        ringSizeRef.current = 44
        ring.style.width = '44px'
        ring.style.height = '44px'
        ring.style.borderWidth = '1.5px'
        ring.style.opacity = '0.6'
        ring.style.transition = 'width 0.2s ease-out, height 0.2s ease-out, border-width 0.2s ease-out, opacity 0.2s ease-out'
      }
    }

    const handleMouseLeave = () => {
      if (ring && isHoveringRef.current) {
        isHoveringRef.current = false
        ringSizeRef.current = 30
        ring.style.width = '30px'
        ring.style.height = '30px'
        ring.style.borderWidth = '1px'
        ring.style.opacity = '0.4'
        ring.style.transition = 'width 0.2s ease-out, height 0.2s ease-out, border-width 0.2s ease-out, opacity 0.2s ease-out'
      }
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Use event delegation for better performance
    const handleDocumentMouseOver = (e) => {
      const target = e.target

      // Check if hovering over text input/textarea (use native cursor)
      const isTextInput = target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input[type="number"], textarea, [contenteditable="true"]')
      
      if (isTextInput) {
        if (dot) dot.style.display = 'none'
        if (ring) ring.style.display = 'none'
        return
      }

      // Show cursor for other elements
      if (dot) dot.style.display = 'block'
      if (ring) ring.style.display = 'block'

      // Check if hovering over clickable element
      const isClickable = target.matches('a, button, [role="button"], .cursor-pointer, [onClick], input[type="submit"], input[type="button"], input[type="reset"], label[for], select, [tabindex]:not([tabindex="-1"])') ||
        target.closest('a, button, [role="button"], .cursor-pointer, [onClick], input[type="submit"], input[type="button"], input[type="reset"], label[for], select')

      if (isClickable) {
        handleMouseEnter()
      } else {
        handleMouseLeave()
      }
    }

    document.addEventListener('mouseover', handleDocumentMouseOver)

    // Initialize ring position
    updateRing()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleDocumentMouseOver)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

export default CustomCursor
