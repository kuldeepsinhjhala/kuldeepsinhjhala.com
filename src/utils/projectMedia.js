/** Resolve a single media.images entry to a URL string. */
export function projectImageSrc(entry) {
  if (entry == null) return null
  if (typeof entry === 'string') {
    const t = entry.trim()
    return t || null
  }
  const u = entry.url
  if (u == null) return null
  const t = String(u).trim()
  return t || null
}

/** Ordered list of image URLs from project.media.images */
export function projectMediaImageList(media) {
  if (!media?.images || !Array.isArray(media.images)) return []
  return media.images.map(projectImageSrc).filter(Boolean)
}

/** First image URL (cover / hero). */
export function projectCoverImageSrc(media) {
  const list = projectMediaImageList(media)
  return list[0] || null
}

export function projectMediaDocuments(media) {
  return Array.isArray(media?.documents) ? media.documents : []
}

/** External URLs from project.media.links (same shape as experience media.links). */
export function projectMediaLinks(media) {
  const raw = media?.links
  if (!Array.isArray(raw)) return []
  return raw.map((l) => (typeof l === 'string' ? l.trim() : '')).filter(Boolean)
}

/** Short label for compact link chips (GitHub vs hostname). */
export function projectLinkDisplayLabel(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '').toLowerCase()
    if (host.includes('github')) return 'GitHub'
    return host
  } catch {
    return url
  }
}

/** True when URL path looks like a raster/SVG image suitable for <img> preview. */
export function urlLooksLikeImagePreview(url) {
  if (!url || typeof url !== 'string') return false
  const path = url.split('?')[0].split('#')[0]
  return /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/i.test(path)
}

/**
 * Normalize a media.images entry to { url, label, alt }.
 * Supports legacy string entries and { url, alt, label } objects.
 */
export function normalizeMediaImageEntry(entry, fallbackLabel = 'Media') {
  if (entry == null) return null
  if (typeof entry === 'string') {
    const url = entry.trim()
    if (!url) return null
    const basename = url.split('/').pop()?.split('?')[0] || fallbackLabel
    return { url, label: basename, alt: basename }
  }
  const url = entry.url != null ? String(entry.url).trim() : ''
  if (!url) return null
  const fromFile = url.split('/').pop()?.split('?')[0] || fallbackLabel
  const label =
    entry.label != null && String(entry.label).trim() !== ''
      ? String(entry.label).trim()
      : entry.alt != null && String(entry.alt).trim() !== ''
        ? String(entry.alt).trim()
        : fromFile
  const alt =
    entry.alt != null && String(entry.alt).trim() !== ''
      ? String(entry.alt).trim()
      : label
  return { url, label, alt }
}

/** Ordered rich entries from media.images */
export function mediaImageEntriesFromMedia(media) {
  if (!media?.images || !Array.isArray(media.images)) return []
  return media.images.map((e) => normalizeMediaImageEntry(e)).filter(Boolean)
}

/** Normalize document entry to { url, label, alt }. */
export function normalizeDocumentEntry(entry) {
  if (entry == null) return null
  if (typeof entry === 'string') {
    const url = entry.trim()
    if (!url) return null
    const basename = url.split('/').pop()?.split('?')[0] || 'Document'
    return { url, label: basename, alt: basename }
  }
  const url = entry.url != null ? String(entry.url).trim() : ''
  if (!url) return null
  const fromFile = url.split('/').pop()?.split('?')[0] || 'Document'
  const label =
    entry.label != null && String(entry.label).trim() !== ''
      ? String(entry.label).trim()
      : fromFile
  const alt =
    entry.alt != null && String(entry.alt).trim() !== ''
      ? String(entry.alt).trim()
      : label
  return { url, label, alt }
}

/**
 * Split documents into image-like (preview as <img>) vs other (PDF, etc. — link chips).
 */
export function partitionDocumentEntries(documents) {
  const raw = Array.isArray(documents) ? documents : []
  const previewAsImages = []
  const otherDocuments = []
  for (const d of raw) {
    const n = normalizeDocumentEntry(d)
    if (!n) continue
    if (urlLooksLikeImagePreview(n.url)) previewAsImages.push(n)
    else otherDocuments.push(n)
  }
  return { previewAsImages, otherDocuments }
}

/** All entries that should render as image previews with captions (images + image-like documents). */
export function combinedMediaPreviewEntries(media) {
  const fromImages = mediaImageEntriesFromMedia(media)
  const { previewAsImages } = partitionDocumentEntries(media?.documents)
  return [...fromImages, ...previewAsImages]
}

/** Whether media has anything that renders in the image grid or document chips / links. */
export function mediaBlockHasRenderableContent(media) {
  if (!media || typeof media !== 'object') return false
  const previews = combinedMediaPreviewEntries(media)
  const { otherDocuments } = partitionDocumentEntries(media?.documents)
  const links = projectMediaLinks(media)
  return previews.length > 0 || otherDocuments.length > 0 || links.length > 0
}
