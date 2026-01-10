import { createContext, useContext, useState } from 'react'

const NavbarContext = createContext()

export const useNavbar = () => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider')
  }
  return context
}

export const NavbarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <NavbarContext.Provider value={{ isOpen, setIsOpen, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  )
}

