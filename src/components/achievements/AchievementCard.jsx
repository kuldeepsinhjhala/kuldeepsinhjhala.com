import { useId } from 'react'
import ProjectMediaSection from '../projects/ProjectMediaSection'
import msuLogo from '../../assets/Msu_logo.png'
import bhsLogo from '../../assets/bhs_logo.jpeg'
import gtuLogo from '../../assets/Gtu_logo.png'
import namastedevLogo from '../../assets/namastedev.png'
import udemyLogo from '../../assets/udemy_logo.webp'
import nccLogo from '../../assets/ncc.jpg'
import {
  projectMediaDocuments,
  projectMediaImageList,
  projectMediaLinks,
} from '../../utils/projectMedia'
import { isExpandCardClickIgnoredTarget } from '../../utils/expandCardClick'

/** JSON uses filenames like `Msu_logo.png`; map to bundled assets (same as DegreeCard). */
function resolveAchievementOrgLogoSrc(logoPath) {
  if (!logoPath) return null
  const s = String(logoPath)
  if (s.includes('Msu_logo')) return msuLogo
  if (s.includes('bhs_logo')) return bhsLogo
  if (s.includes('Gtu_logo')) return gtuLogo
  if (s.includes('namastedev')) return namastedevLogo
  if (s.includes('udemy_logo')) return udemyLogo
  if (s.includes('ncc')) return nccLogo
  if (/^https?:\/\//i.test(s) || s.startsWith('/')) return s
  return null
}

function achievementEvidenceHasStructuredMedia(media) {
  if (!media || typeof media !== 'object' || Array.isArray(media)) return false
  return (
    projectMediaImageList(media).length > 0 ||
    projectMediaDocuments(media).length > 0 ||
    projectMediaLinks(media).length > 0
  )
}

/**
 * AchievementCard — summary + chevron; details use max-height collapse (reliable clipping).
 * Use `expanded` + `onToggle` from parent for accordion (only one open at a time).
 */
function AchievementCard({ achievement = {}, expanded = false, onToggle }) {
  const panelId = useId()
  const isOpen = expanded

  if (!achievement || !achievement.title) return null

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const achievedOnLabel = achievement.date?.achievedOn
    ? formatDate(achievement.date.achievedOn)
    : null

  const orgLogoSrc =
    achievement.organization?.logo &&
    resolveAchievementOrgLogoSrc(achievement.organization.logo)

  const hasEvidenceBody =
    achievement.evidence &&
    (achievement.evidence.credentialId ||
      achievement.evidence.certificateUrl ||
      achievement.evidence.proofUrl ||
      achievementEvidenceHasStructuredMedia(achievement.evidence.media))

  const hasExpandableContent = Boolean(
    (achievement.description && String(achievement.description).trim()) ||
      (achievement.skillsDemonstrated?.length > 0) ||
      hasEvidenceBody ||
      achievement.organization?.website
  )

  return (
    <div
      className={`bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 sm:p-5 md:p-6 shadow-lg w-full self-start flex flex-col ${hasExpandableContent && !isOpen ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
      }}
      onClick={
        hasExpandableContent && !isOpen
          ? (e) => {
              if (isExpandCardClickIgnoredTarget(e.target)) return
              onToggle?.()
            }
          : undefined
      }
    >
      <div className="flex-shrink-0 flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-head text-sm sm:text-base font-bold leading-snug line-clamp-3 mb-2 min-w-0">
            {achievement.title}
          </h3>

          {achievement.organization && (
            <div className="mb-2 flex items-center gap-1.5 min-w-0">
              {orgLogoSrc && (
                <img
                  src={orgLogoSrc}
                  alt=""
                  className="w-4 h-4 rounded object-contain flex-shrink-0"
                  style={
                    String(achievement.organization.logo).includes('Msu_logo')
                      ? { filter: 'brightness(0) invert(1)' }
                      : undefined
                  }
                />
              )}
              <p className="text-gold text-xs font-medium min-w-0 flex-1 truncate">
                {achievement.organization.name}
              </p>
            </div>
          )}

          {achievedOnLabel && (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-body">
              <svg className="w-3.5 h-3.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{achievedOnLabel}</span>
            </div>
          )}
        </div>

        {hasExpandableContent && (
          <button
            type="button"
            onClick={() => onToggle?.()}
            className="flex-shrink-0 flex items-center justify-center min-h-9 min-w-9 mt-0.5 rounded-md text-gold/90 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-colors"
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            aria-label={isOpen ? `Collapse ${achievement.title}` : `Expand ${achievement.title}`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasExpandableContent && isOpen && (
        <div
          id={panelId}
          role="region"
          aria-label={`Details for ${achievement.title}`}
          className="w-full min-w-0 pt-5 sm:pt-6 space-y-4 border-t border-gold/20 mt-4"
        >
              {achievement.organization?.website && (
                <div>
                  <a
                    href={achievement.organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 hover:underline text-sm inline-flex items-center gap-1.5 transition-colors"
                  >
                    Visit website
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {achievement.description && (
                <div>
                  <p className="text-body text-sm md:text-base leading-relaxed">{achievement.description}</p>
                </div>
              )}

              {achievement.skillsDemonstrated &&
                Array.isArray(achievement.skillsDemonstrated) &&
                achievement.skillsDemonstrated.length > 0 && (
                  <div>
                    <h4 className="text-head text-base font-semibold mb-2">Skills demonstrated</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {achievement.skillsDemonstrated.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {hasEvidenceBody && (
                <div>
                  <h4 className="text-head text-base font-semibold mb-2">Evidence</h4>
                  <div className="space-y-2 text-sm">
                    {achievement.evidence.credentialId && (
                      <p className="text-body">
                        <span className="text-head font-medium">Credential ID: </span>
                        <span className="font-mono text-xs break-all">{achievement.evidence.credentialId}</span>
                      </p>
                    )}
                    {achievement.evidence.certificateUrl && (
                      <a
                        href={achievement.evidence.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold hover:text-gold/80 hover:underline transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View certificate
                      </a>
                    )}
                    {achievement.evidence.proofUrl && (
                      <a
                        href={achievement.evidence.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold hover:text-gold/80 hover:underline transition-colors cursor-pointer ml-0 sm:ml-4"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View proof
                      </a>
                    )}
                    {achievementEvidenceHasStructuredMedia(achievement.evidence.media) && (
                      <div className="mt-3">
                        <ProjectMediaSection
                          media={achievement.evidence.media}
                          projectTitle={achievement.title}
                          embedded
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
        </div>
      )}
    </div>
  )
}

export default AchievementCard
