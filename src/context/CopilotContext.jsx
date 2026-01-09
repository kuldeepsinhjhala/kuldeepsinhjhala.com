import { createContext, useContext, useState } from 'react'

const CopilotContext = createContext()

export const useCopilot = () => {
  const context = useContext(CopilotContext)
  if (!context) {
    throw new Error('useCopilot must be used within CopilotProvider')
  }
  return context
}

export const CopilotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleCopilot = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <CopilotContext.Provider value={{ isOpen, setIsOpen, toggleCopilot }}>
      {children}
    </CopilotContext.Provider>
  )
}

