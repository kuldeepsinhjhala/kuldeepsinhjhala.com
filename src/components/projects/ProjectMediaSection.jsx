import MediaPreviewGrid from '../media/MediaPreviewGrid'
import {
  combinedMediaPreviewEntries,
  mediaBlockHasRenderableContent,
  partitionDocumentEntries,
  projectMediaLinks,
} from '../../utils/projectMedia'
import { resolveJourneyLogo } from '../../utils/resolveJourneyLogo'

/**
 * Renders project.media (and same shape for education / achievements): images, documents, links.
 * Image-like documents (e.g. .jpg certificates) render in the same grid as images with labels.
 */
function ProjectMediaSection({
  media,
  projectTitle = '',
  className = '',
  embedded = false,
  resolveSrc,
  imgStyle,
}) {
  const resolve =
    resolveSrc ||
    ((u) => {
      const r = resolveJourneyLogo(u)
      return r || u
    })

  const previewEntries = combinedMediaPreviewEntries(media)
  const { otherDocuments } = partitionDocumentEntries(media?.documents)
  const mediaExtLinks = projectMediaLinks(media)
  const hasContent = mediaBlockHasRenderableContent(media)

  if (!hasContent) return null

  const rootClass = embedded
    ? `space-y-4 ${className}`.trim()
    : `bg-card/80 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-5 space-y-4 ${className}`.trim()

  return (
    <div
      className={rootClass}
      style={
        embedded
          ? undefined
          : {
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
            }
      }
    >
      <h3
        className={
          embedded
            ? 'text-head text-lg font-semibold'
            : 'text-head text-lg font-semibold border-b border-gold/20 pb-2'
        }
      >
        Media
      </h3>

      {previewEntries.length > 0 && (
        <div>
          <h4 className="text-body text-sm font-semibold mb-2">Gallery</h4>
          <MediaPreviewGrid
            entries={previewEntries}
            resolveSrc={resolve}
            imgStyle={imgStyle}
            defaultAlt={projectTitle ? `${projectTitle} media` : 'Media'}
          />
        </div>
      )}

      {otherDocuments.length > 0 && (
        <div>
          <h4 className="text-body text-sm font-semibold mb-2">Documents</h4>
          <div className="flex flex-wrap gap-2">
            {otherDocuments.map((entry, idx) => {
              const url = entry?.url
              if (!url) return null
              const href = resolve(url) || url
              const label = entry.label || 'Document'
              return (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-gold hover:ring-1 hover:ring-gold/30 transition-all shadow-sm"
                  style={{
                    boxShadow:
                      '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)',
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {label}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {mediaExtLinks.length > 0 && (
        <div>
          <h4 className="text-body text-sm font-semibold mb-2">Links</h4>
          <div className="flex flex-wrap gap-2">
            {mediaExtLinks.map((link, idx) => {
              let host = link
              try {
                host = new URL(link).hostname.replace('www.', '')
              } catch {
                /* keep raw */
              }
              return (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-gold hover:ring-1 hover:ring-gold/30 transition-all shadow-sm"
                  style={{
                    boxShadow:
                      '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)',
                  }}
                >
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {host}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectMediaSection
