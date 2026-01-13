import { createContext, useContext, useState, useEffect, useRef } from 'react'

const CopilotContext = createContext()

export const useCopilot = () => {
  const context = useContext(CopilotContext)
  if (!context) {
    throw new Error('useCopilot must be used within CopilotProvider')
  }
  return context
}

export const CopilotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasShownHint = useRef(false)

  const toggleCopilot = () => {
    setIsOpen(prev => !prev)
  }

  // Auto-open panel on mount, then close after 1 second as a hint
  useEffect(() => {
    // Only show hint once per session
    if (hasShownHint.current) return

    let closeTimer = null

    // Open panel after a small delay to ensure everything is rendered
    const openTimer = setTimeout(() => {
      setIsOpen(true)
      hasShownHint.current = true

      // Close panel after 1 second
      closeTimer = setTimeout(() => {
        setIsOpen(false)
      }, 1000)
    }, 100)

    // Cleanup function
    return () => {
      clearTimeout(openTimer)
      if (closeTimer) {
        clearTimeout(closeTimer)
      }
    }
  }, [])

  return (
    <CopilotContext.Provider value={{ isOpen, setIsOpen, toggleCopilot }}>
      {children}
    </CopilotContext.Provider>
  )
}

