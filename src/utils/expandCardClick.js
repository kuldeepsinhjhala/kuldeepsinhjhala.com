/**
 * True if the event target is inside an element that should keep native click
 * (so we don't also run "expand card" when using chevron or links).
 */
export function isExpandCardClickIgnoredTarget(target) {
  if (!target?.closest) return true
  return Boolean(
    target.closest(
      'a[href], button, [role="button"], input, textarea, select, label'
    )
  )
}
