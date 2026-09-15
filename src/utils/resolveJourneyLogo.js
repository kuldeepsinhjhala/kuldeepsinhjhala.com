import { resolveS3Url } from './resolveS3Url'

const ASSET_EXTENSIONS = ['.png', '.svg', '.webp', '.jpeg', '.jpg', '.gif']

const assetUrlsByFileName = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/*.{png,jpeg,jpg,webp,svg,gif}', {
      eager: true,
      import: 'default',
    })
  ).map(([path, url]) => [path.split('/').pop(), url])
)

function assetUrlForName(name) {
  if (!name) return null
  if (assetUrlsByFileName[name]) return assetUrlsByFileName[name]
  if (/\.[a-z0-9]+$/i.test(name)) return null
  for (const ext of ASSET_EXTENSIONS) {
    const withExt = `${name}${ext}`
    if (assetUrlsByFileName[withExt]) return assetUrlsByFileName[withExt]
  }
  return null
}

/**
 * Resolve organization.logo from journey.json to a usable img src.
 * Prefer bundled assets when the path basename matches src/assets (Vite URL).
 * Also accepts s3_urls.json keys and absolute /public or http(s) URLs.
 */
export function resolveJourneyLogo(logo) {
  if (!logo || typeof logo !== 'string') return null
  const t = logo.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) return t

  const baseName = t.split('/').pop()
  const fromAssets = assetUrlForName(baseName) || assetUrlForName(t)
  if (fromAssets) return fromAssets

  const fromS3 = resolveS3Url(t) || resolveS3Url(baseName)
  if (fromS3) return fromS3

  if (t.startsWith('/')) return t
  return null
}

/** MSU mark is dark-on-transparent; invert on dark journey UI (matches DegreeCard). */
export function getJourneyOrgLogoImgStyle(logo) {
  if (!logo || typeof logo !== 'string') return undefined
  if (logo.includes('Msu_logo')) return { filter: 'brightness(0) invert(1)' }
  return undefined
}
