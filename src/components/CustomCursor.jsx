import { useEffect, useRef } from 'react'

const CLICKABLE_SELECTOR = [
  'a[href]',
  'button',
  '[role="button"]',
  '.cursor-pointer',
  '.clickable',
  '[onclick]',
  'input[type="submit"]',
  'input[type="button"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'label[for]',
  'select',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function isTextField(el) {
  if (!el?.matches) return false
  if (el.matches('textarea, [contenteditable="true"]')) return true
  if (!el.matches('input')) return false
  const t = (el.getAttribute('type') || 'text').toLowerCase()
  return ['text', 'email', 'password', 'search', 'url', 'tel', 'number'].includes(t)
}

function closestClickable(el) {
  if (!el?.closest) return null
  const node = el.closest(CLICKABLE_SELECTOR)
  if (!node) return null
  if (node.matches(':disabled') || node.getAttribute('aria-disabled') === 'true') return null
  if (node.matches('a[href]')) {
    const href = node.getAttribute('href')
    if (href == null || href === '') return null
  }
  return node
}

/**
 * Custom cursor: thin ring + centered dot; dot glows on clickable targets.
 * Disabled on coarse pointers (touch).
 */
function CustomCursor() {
  const rootRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const root = rootRef.current
    if (!root) return

    const size = 28
    const half = size / 2

    const setPosition = (clientX, clientY) => {
      root.style.transform = `translate(${clientX - half}px, ${clientY - half}px)`
    }

    const handleMouseMove = (e) => {
      setPosition(e.clientX, e.clientY)
    }

    const updateHover = (target) => {
      const textNode = target.closest?.('input, textarea, [contenteditable="true"]')
      if (textNode && isTextField(textNode)) {
        root.classList.add('custom-cursor--hidden')
        root.classList.remove('custom-cursor--clickable')
        return
      }

      root.classList.remove('custom-cursor--hidden')

      if (closestClickable(target)) {
        root.classList.add('custom-cursor--clickable')
      } else {
        root.classList.remove('custom-cursor--clickable')
      }
    }

    const handleMouseOver = (e) => {
      updateHover(e.target)
    }

    setPosition(window.innerWidth / 2, window.innerHeight / 2)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor__dot" />
    </div>
  )
}

export default CustomCursor
