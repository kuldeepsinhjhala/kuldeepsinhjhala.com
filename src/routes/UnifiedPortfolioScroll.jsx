import { useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { applySearchHighlights, clearSearchHighlights } from '../utils/searchHighlightDom'
import { SECTION_FLOW } from '../config/sectionFlow'
import { useTabs } from '../context/TabContext'
import Landing from '../sections/landing/Landing'
import Journey from '../sections/journey/Journey'
import Experience from '../sections/experience/Experience'
import Education from '../sections/education/Education'
import Skills from '../sections/skills/Skills'
import Projects from '../sections/projects/Projects'
import Resume from '../sections/resume/Resume'
import Contact from '../sections/contact/Contact'
import Achievements from '../sections/achievement/Achievements'

const SECTION_COMPONENTS = {
  '/': Landing,
  '/journey': Journey,
  '/experience': Experience,
  '/education': Education,
  '/skills': Skills,
  '/projects': Projects,
  '/resume': Resume,
  '/achievements': Achievements,
  '/contact': Contact,
}

function pathToFlowSlug(path) {
  if (path === '/') return 'index'
  return path.replace(/^\//, '').replace(/\//g, '-')
}

function findSectionEl(container, path) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return container.querySelector(`[data-portfolio-section="${CSS.escape(path)}"]`)
  }
  if (path === '/') {
    return container.querySelector('[data-portfolio-section="/"]')
  }
  return container.querySelector(`[data-portfolio-section="${path}"]`)
}

/**
 * Pick which portfolio section owns the “reading line” in the scroll container
 * so URL / tabs stay aligned while the user scrolls one continuous column.
 */
function activePathForScrollLine(container) {
  const sections = container.querySelectorAll('[data-portfolio-section]')
  if (!sections.length) return null

  const cr = container.getBoundingClientRect()
  const y = cr.top + cr.height * 0.38

  let bestPath = null
  let bestDist = Infinity

  sections.forEach((sec) => {
    const r = sec.getBoundingClientRect()
    const path = sec.getAttribute('data-portfolio-section')
    if (r.top <= y && r.bottom >= y) {
      bestPath = path
      bestDist = -1
      return
    }
    if (bestDist < 0) return
    const mid = (r.top + r.bottom) / 2
    const d = Math.abs(mid - y)
    if (d < bestDist) {
      bestDist = d
      bestPath = path
    }
  })

  return bestPath
}

/**
 * All portfolio pages stacked in one scroll column (adjacent sections can share
 * the viewport — no route swap / flash). URL updates from scroll for tabs + links.
 */
export function UnifiedPortfolioScroll({ scrollContainerRef }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { openTab } = useTabs()
  const scrollSpyNavRef = useRef(false)
  const programmaticScrollRef = useRef(false)
  const prevSyncedPathRef = useRef(undefined)
  const pathnameRef = useRef(location.pathname)
  pathnameRef.current = location.pathname

  const scrollSectionIntoView = useCallback(
    (path) => {
      const container = scrollContainerRef.current
      if (!container) return
      const el = findSectionEl(container, path)
      if (!el) return
      programmaticScrollRef.current = true
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      requestAnimationFrame(() => {
        programmaticScrollRef.current = false
      })
    },
    [scrollContainerRef]
  )

  useLayoutEffect(() => {
    if (scrollSpyNavRef.current) {
      scrollSpyNavRef.current = false
      prevSyncedPathRef.current = location.pathname
      return
    }
    const isInitial = prevSyncedPathRef.current === undefined
    const pathChanged = prevSyncedPathRef.current !== location.pathname
    if (!isInitial && !pathChanged) return
    prevSyncedPathRef.current = location.pathname
    scrollSectionIntoView(location.pathname)
  }, [location.pathname, scrollSectionIntoView])

  useEffect(() => {
    const main = scrollContainerRef.current
    if (!main) return
    clearSearchHighlights(main)
  }, [location.pathname, scrollContainerRef])

  useEffect(() => {
    const term = location.state?.searchHighlight
    if (typeof term !== 'string' || !term.trim()) return

    const main = scrollContainerRef.current
    if (!main) return

    const path = location.pathname
    const section = findSectionEl(main, path) || main

    const timer = window.setTimeout(() => {
      clearSearchHighlights(main)
      const first = applySearchHighlights(section, term)
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      }
      navigate(path, { replace: true, state: {} })
    }, 160)

    return () => clearTimeout(timer)
  }, [location.pathname, location.state, scrollContainerRef, navigate])

  useEffect(() => {
    const main = scrollContainerRef.current
    if (!main) return

    let raf = 0
    let debounceTimer = 0

    const commitSpy = () => {
      if (programmaticScrollRef.current) return
      const path = activePathForScrollLine(main)
      if (!path || path === pathnameRef.current) return
      const entry = SECTION_FLOW.find((s) => s.path === path)
      if (!entry) return
      scrollSpyNavRef.current = true
      openTab(entry.path, entry.label, { replace: true })
    }

    const scheduleSpy = () => {
      if (programmaticScrollRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        clearTimeout(debounceTimer)
        debounceTimer = window.setTimeout(commitSpy, 100)
      })
    }

    main.addEventListener('scroll', scheduleSpy, { passive: true })
    const ro = new ResizeObserver(() => scheduleSpy())
    ro.observe(main)
    scheduleSpy()

    return () => {
      main.removeEventListener('scroll', scheduleSpy)
      ro.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(debounceTimer)
    }
  }, [scrollContainerRef, openTab])

  return (
    <div className="w-full">
      {SECTION_FLOW.map(({ path }) => {
        const Cmp = SECTION_COMPONENTS[path]
        if (!Cmp) return null
        const slug = pathToFlowSlug(path)
        return (
          <section
            key={path}
            id={`portfolio-flow-${slug}`}
            data-portfolio-section={path}
            className="relative w-full scroll-mt-0"
          >
            <Cmp />
          </section>
        )
      })}
    </div>
  )
}
