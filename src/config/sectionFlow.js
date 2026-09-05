/**
 * Canonical order for the top navbar and page routes.
 * Visibility is controlled in src/data/system.json (true = shown, false = hidden).
 */
import { isVisible } from './systemVisibility'

export const SECTION_FLOW = [
  { id: 'index', path: '/', label: 'index.jsx', mobileLabel: 'Home' },
  { id: 'skills', path: '/skills', label: 'skills.jsx', mobileLabel: 'Skills' },
  { id: 'experience', path: '/experience', label: 'experience.jsx', mobileLabel: 'Experience' },
  { id: 'resume', path: '/resume', label: 'resume.jsx', mobileLabel: 'Resume' },
  { id: 'projects', path: '/projects', label: 'projects.jsx', mobileLabel: 'Projects' },
  { id: 'achievements', path: '/achievements', label: 'achievements.jsx', mobileLabel: 'Achievements' },
  { id: 'journey', path: '/journey', label: 'journey.jsx', mobileLabel: 'Journey' },
  { id: 'education', path: '/education', label: 'education.jsx', mobileLabel: 'Education' },
  { id: 'blog', path: '/blog', label: 'blog.jsx', mobileLabel: 'Blog' },
  { id: 'contact', path: '/contact', label: 'contact.jsx', mobileLabel: 'Contact' },
]

export function isPathVisible(path) {
  const section = SECTION_FLOW.find((s) => s.path === path)
  if (!section) return false
  return isVisible(section.id)
}

export const VISIBLE_SECTION_FLOW = SECTION_FLOW.filter((s) => isVisible(s.id))

export const FIRST_VISIBLE_SECTION = VISIBLE_SECTION_FLOW[0] || null
