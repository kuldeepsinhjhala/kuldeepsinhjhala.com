import system from '../data/system.json'

/**
 * Page and UI flags from src/data/system.json.
 * true = show in the UI, false = hide (nav, tabs, search, page, copilot).
 */
export function isVisible(key) {
  return system?.[key] === true
}

export function isCopilotVisible() {
  return isVisible('copilot')
}
