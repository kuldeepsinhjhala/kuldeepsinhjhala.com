import { SECTION_FLOW } from './sectionFlow'
import landing from '../data/landing.json'
import journey from '../data/journey.json'
import experience from '../data/experience.json'
import education from '../data/education.json'
import skills from '../data/skills.json'
import project from '../data/project.json'
import resume from '../data/resume.json'
import achievements from '../data/achievements.json'
import contact from '../data/contact.json'
import emailSignatureHtml from '../data/EmailSignature.html?raw'

const DATA_BY_PATH = {
  '/': landing,
  '/journey': journey,
  '/experience': experience,
  '/education': education,
  '/skills': skills,
  '/projects': project,
  '/resume': resume,
  '/achievements': achievements,
  '/contact': contact,
}

/** Pull plain text from HTML for search (e.g. email signature). */
function htmlToSearchableChunks(html) {
  if (!html || typeof html !== 'string') return []
  const t = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return t ? [t] : []
}

/** Collect all string and numeric leaf values from JSON (full depth). */
function collectStringValues(value, acc = []) {
  if (typeof value === 'string') {
    const t = value.trim()
    if (t) acc.push(t)
  } else if (typeof value === 'number' && Number.isFinite(value)) {
    acc.push(String(value))
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStringValues(item, acc))
  } else if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((v) => collectStringValues(v, acc))
  }
  return acc
}

function pageIdentitySegments(path, label, mobileLabel) {
  const parts = [label, mobileLabel, path]
  if (path === '/') {
    parts.push('home', 'landing', 'index', 'root')
  } else {
    const seg = path.replace(/^\//, '')
    if (seg) parts.push(seg.replace(/-/g, ' '))
  }
  return [...new Set(parts.filter(Boolean))]
}

function buildPages() {
  const emailChunks = htmlToSearchableChunks(emailSignatureHtml)

  return SECTION_FLOW.map(({ path, label, mobileLabel }) => {
    const data = DATA_BY_PATH[path]
    const fromJson = data ? collectStringValues(data) : []
    const extra =
      path === '/contact' ? [...fromJson, ...emailChunks] : fromJson
    const segments = [...pageIdentitySegments(path, label, mobileLabel), ...extra]
    return {
      path,
      fileLabel: label,
      pageTitle: mobileLabel || label,
      segments,
    }
  })
}

export const SITE_SEARCH_PAGES = buildPages()

function snippetAround(text, termLower, radius = 72) {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(termLower)
  if (idx === -1) {
    const slice = text.slice(0, radius * 2).trim()
    return slice.length < text.length ? `${slice}…` : slice
  }
  const start = Math.max(0, idx - radius)
  const end = Math.min(text.length, idx + termLower.length + radius)
  let s = text.slice(start, end).replace(/\s+/g, ' ').trim()
  if (start > 0) s = `…${s}`
  if (end < text.length) s = `${s}…`
  return s
}

/**
 * @param {typeof SITE_SEARCH_PAGES[0]} page
 * @param {string} term lowercased query
 * @param {string} escaped regex-safe query
 */
function matchPage(page, term, escaped) {
  let count = 0
  const snippetTexts = []
  const seen = new Set()

  for (const seg of page.segments) {
    const lower = String(seg).toLowerCase()
    if (!lower.includes(term)) continue
    const matches = String(seg).match(new RegExp(escaped, 'gi'))
    if (matches) count += matches.length
    const sn = snippetAround(String(seg), term)
    const key = sn.toLowerCase().replace(/\s+/g, ' ').slice(0, 120)
    if (seen.has(key)) continue
    seen.add(key)
    snippetTexts.push(sn)
  }

  return { count, snippetTexts }
}

/**
 * Flat list of suggestions: one row per distinct text hit (multiple rows per page possible).
 * @param {string} query
 * @param {{ maxRows?: number, maxSnippetsPerPage?: number }} opts
 */
export function searchSiteSuggestions(query, opts = {}) {
  const maxRows = opts.maxRows ?? 45
  const maxSnippetsPerPage = opts.maxSnippetsPerPage ?? 6

  const raw = query?.trim()
  if (!raw) {
    return { rows: [], pageCount: 0, totalMatches: 0, truncated: false }
  }

  const term = raw.toLowerCase()
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const pageHits = []

  for (const page of SITE_SEARCH_PAGES) {
    const { count, snippetTexts } = matchPage(page, term, escaped)
    if (count === 0) continue
    pageHits.push({
      page,
      count,
      snippetTexts,
    })
  }

  pageHits.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.page.fileLabel.localeCompare(b.page.fileLabel)
  })

  const rows = []
  let totalMatches = 0
  let truncated = false

  outer: for (const hit of pageHits) {
    totalMatches += hit.count
    const p = hit.page
    const chunks = hit.snippetTexts.slice(0, maxSnippetsPerPage)
    for (const snippet of chunks) {
      rows.push({
        path: p.path,
        fileLabel: p.fileLabel,
        pageTitle: p.pageTitle,
        snippet,
        pageMatchCount: hit.count,
      })
      if (rows.length >= maxRows) {
        truncated = true
        break outer
      }
    }
  }

  return {
    rows,
    pageCount: pageHits.length,
    totalMatches,
    truncated,
  }
}

/** Page-level results (one row per page, with multiple snippet previews). */
export function searchSite(query) {
  const raw = query?.trim()
  if (!raw) return []

  const term = raw.toLowerCase()
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const results = []

  for (const page of SITE_SEARCH_PAGES) {
    const { count, snippetTexts } = matchPage(page, term, escaped)
    if (count === 0) continue
    const snippets = snippetTexts.slice(0, 5)
    results.push({
      path: page.path,
      fileLabel: page.fileLabel,
      pageTitle: page.pageTitle,
      count,
      snippet: snippets[0] || page.pageTitle,
      snippets,
    })
  }

  results.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.fileLabel.localeCompare(b.fileLabel)
  })

  return results
}
