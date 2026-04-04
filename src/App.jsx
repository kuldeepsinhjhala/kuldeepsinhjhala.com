import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import TerminalLoader from './components/TerminalLoader'
import AppRoutes from './routes/AppRoutes'

const TERMINAL_LOADER_STORAGE_KEY = 'portfolio-terminal-loader-completed'

function shouldShowTerminalLoader() {
  if (typeof window === 'undefined') return true
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    const isReload = nav?.type === 'reload'
    if (isReload) return true
    return window.localStorage.getItem(TERMINAL_LOADER_STORAGE_KEY) !== '1'
  } catch {
    return window.localStorage.getItem(TERMINAL_LOADER_STORAGE_KEY) !== '1'
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(shouldShowTerminalLoader)

  const handleLoaderComplete = () => {
    try {
      window.localStorage.setItem(TERMINAL_LOADER_STORAGE_KEY, '1')
    } catch {
      /* ignore quota / private mode */
    }
    setIsLoading(false)
  }

  return (
    <BrowserRouter>
      {isLoading ? (
        <TerminalLoader onComplete={handleLoaderComplete} />
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  )
}

export default App