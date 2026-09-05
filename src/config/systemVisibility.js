import system from '../data/system.json'

/**
 * Page flags from src/data/system.json.
 * true = show in the UI, false = hide (nav and page).
 */
export function isVisible(key) {
  return system?.[key] === true
}
