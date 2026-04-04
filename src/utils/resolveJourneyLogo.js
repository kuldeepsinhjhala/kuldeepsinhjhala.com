const assetUrlsByFileName = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/*.{png,jpeg,jpg,webp,svg,gif}', {
      eager: true,
      import: 'default',
    })
  ).map(([path, url]) => [path.split('/').pop(), url])
)

/**
 * Resolve organization.logo from journey.json to a usable img src.
 * Prefer bundled assets when the path basename matches src/assets (Vite URL).
 * Otherwise use absolute /public paths or external URLs as-is.
 */
export function resolveJourneyLogo(logo) {
  if (!logo || typeof logo !== 'string') return null
  const t = logo.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) return t
  const baseName = t.split('/').pop()
  if (baseName && assetUrlsByFileName[baseName]) {
    return assetUrlsByFileName[baseName]
  }
  if (t.startsWith('/')) return t
  return assetUrlsByFileName[t] ?? null
}

/** MSU mark is dark-on-transparent; invert on dark journey UI (matches DegreeCard). */
export function getJourneyOrgLogoImgStyle(logo) {
  if (!logo || typeof logo !== 'string') return undefined
  if (logo.includes('Msu_logo')) return { filter: 'brightness(0) invert(1)' }
  return undefined
}
