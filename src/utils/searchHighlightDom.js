const HIGHLIGHT_CLASS = 'portfolio-search-highlight'

export function clearSearchHighlights(root) {
  if (!root) return
  root.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  })
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Wrap case-insensitive matches of `term` in <mark> inside `scopeEl`. Returns first mark or null.
 */
export function applySearchHighlights(scopeEl, term) {
  if (!scopeEl || !term) return null

  const trimmed = term.trim()
  if (!trimmed) return null

  const walker = document.createTreeWalker(scopeEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      let p = node.parentElement
      while (p && p !== scopeEl) {
        if (p.matches?.('script, style, noscript, textarea, [data-no-search-highlight]')) {
          return NodeFilter.FILTER_REJECT
        }
        if (p.classList?.contains(HIGHLIGHT_CLASS)) return NodeFilter.FILTER_REJECT
        p = p.parentElement
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes = []
  let n
  while ((n = walker.nextNode())) {
    if (new RegExp(escapeRegExp(trimmed), 'i').test(n.nodeValue)) {
      textNodes.push(n)
    }
  }

  let firstMark = null

  for (const textNode of textNodes) {
    if (!textNode.parentNode) continue
    const text = textNode.nodeValue
    if (!new RegExp(escapeRegExp(trimmed), 'i').test(text)) continue

    const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'))
    const frag = document.createDocumentFragment()

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part === '') continue
      if (i % 2 === 1) {
        const mark = document.createElement('mark')
        mark.className = `${HIGHLIGHT_CLASS} bg-gold/35 text-head rounded px-0.5 ring-1 ring-gold/50`
        mark.textContent = part
        frag.appendChild(mark)
        if (!firstMark) firstMark = mark
      } else {
        frag.appendChild(document.createTextNode(part))
      }
    }

    textNode.parentNode.replaceChild(frag, textNode)
  }

  return firstMark
}

export { HIGHLIGHT_CLASS }
