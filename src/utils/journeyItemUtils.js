/**
 * Year label for road/terminal badges when `time` only has startDate/endDate/duration.
 */
export function getJourneyMilestoneYearLabel(time) {
  if (!time?.startDate) return null
  const raw = String(time.startDate).trim()
  if (!raw || raw === 'present') return null
  if (/^\d{4}$/.test(raw)) return raw
  if (/^\d{4}[-/]/.test(raw)) return raw.slice(0, 4)
  const ms = Date.parse(raw)
  if (!Number.isNaN(ms)) return String(new Date(ms).getUTCFullYear())
  return null
}

/** Default highlighted when `status` is omitted (treat as highlighted). */
export function isJourneyItemHighlighted(item) {
  return item?.status?.highlighted !== false
}
