import s3Urls from '../data/s3_urls.json'

/**
 * Resolve an s3_urls.json key (or pass through an absolute URL / public path).
 */
export function resolveS3Url(keyOrUrl) {
  if (!keyOrUrl || typeof keyOrUrl !== 'string') return null
  const t = keyOrUrl.trim()
  if (!t) return null
  if (s3Urls[t]) return s3Urls[t]
  if (/^https?:\/\//i.test(t) || t.startsWith('/')) return t
  return null
}
