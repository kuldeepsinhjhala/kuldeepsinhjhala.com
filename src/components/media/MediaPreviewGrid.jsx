/**
 * Renders image-style media with optional caption (label).
 * `resolveSrc` maps JSON URLs to bundled asset URLs when needed.
 */
function MediaPreviewGrid({
  entries = [],
  resolveSrc = (u) => u,
  defaultAlt = 'Media',
  imgClassName = 'w-full h-auto max-h-64 object-contain object-center',
  imgStyle,
}) {
  if (!Array.isArray(entries) || entries.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {entries.map((entry, idx) => {
        if (!entry?.url) return null
        const raw = String(entry.url).trim()
        const src = resolveSrc(raw) || raw
        const alt = entry.alt?.trim() || entry.label?.trim() || defaultAlt
        const label = entry.label?.trim() || entry.alt?.trim() || ''
        const resolvedStyle = typeof imgStyle === 'function' ? imgStyle(raw, entry) : imgStyle
        return (
          <figure key={`${src}-${idx}`} className="rounded-lg border border-gold/20 overflow-hidden bg-card/50 hover:border-gold/40 transition-colors">
            <a href={src} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={imgClassName}
                style={resolvedStyle}
              />
            </a>
            {label ? (
              <figcaption className="text-body text-xs text-center px-2 py-2 border-t border-gold/10 bg-card/40">
                {label}
              </figcaption>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}

export default MediaPreviewGrid
