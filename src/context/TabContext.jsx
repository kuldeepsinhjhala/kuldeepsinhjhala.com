import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TabContext = createContext()

export const useTabs = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabs must be used within TabProvider')
  }
  return context
}

export const TabProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Initialize tabs - check if first load or refresh
  const initializeTabs = () => {
    const isFirstLoad = !localStorage.getItem('hasVisited')
    const savedTabs = localStorage.getItem('savedTabs')
    const savedActivePath = localStorage.getItem('activePath')
    
    if (isFirstLoad) {
      // First load: always start with index.jsx
      localStorage.setItem('hasVisited', 'true')
      localStorage.setItem('savedTabs', JSON.stringify([{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]))
      localStorage.setItem('activePath', '/')
      return [{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]
    } else if (savedTabs && savedActivePath) {
      // Refresh: restore saved tabs and active path
      try {
        const parsedTabs = JSON.parse(savedTabs)
        const restoredTabs = parsedTabs.map(tab => ({
          ...tab,
          isActive: tab.path === savedActivePath
        }))
        return restoredTabs
      } catch (e) {
        // Fallback if parsing fails
        return [{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]
      }
    }
    
    // Default fallback
    return [{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]
  }

  const [tabs, setTabs] = useState(initializeTabs)
  const isOpeningTabRef = useRef(false)

  // Handle first load vs refresh
  useEffect(() => {
    const isFirstLoad = !localStorage.getItem('hasVisited')
    const savedActivePath = localStorage.getItem('activePath')
    
    if (isFirstLoad) {
      // First load: always navigate to index
      if (location.pathname !== '/') {
        navigate('/', { replace: true })
      }
    } else if (savedActivePath && savedActivePath !== location.pathname) {
      // Refresh: navigate to saved active path
      navigate(savedActivePath, { replace: true })
    }
  }, []) // Only run on mount

  // Sync active tab with current route and save to localStorage
  useEffect(() => {
    // Skip if we're in the middle of opening a tab (to prevent duplicates)
    if (isOpeningTabRef.current) {
      isOpeningTabRef.current = false
      return
    }

    setTabs(prevTabs => {
      const currentPath = location.pathname
      const hasTab = prevTabs.some(tab => tab.path === currentPath)
      
      let updatedTabs
      if (hasTab) {
        // Update active tab
        updatedTabs = prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      } else {
        // Route changed but no tab exists (e.g., from mobile menu or direct navigation)
        // Don't auto-create tab, just update active state
        updatedTabs = prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      }
      
      // Save to localStorage
      localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
      localStorage.setItem('activePath', currentPath)
      
      return updatedTabs
    })
  }, [location.pathname])

  const openTab = useCallback((path, label) => {
    // Set flag to prevent useEffect from creating duplicate tab
    isOpeningTabRef.current = true
    
    setTabs(prevTabs => {
      // Check if tab already exists
      const existingTab = prevTabs.find(tab => tab.path === path)
      let updatedTabs
      
      if (existingTab) {
        // Switch to existing tab
        updatedTabs = prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === path
        }))
      } else {
        // Add new tab and make it active, keep existing tabs
        const newTab = { id: path.replace('/', '') || 'index', path, label, isActive: true }
        updatedTabs = prevTabs.map(tab => ({ ...tab, isActive: false })).concat(newTab)
      }
      
      // Save to localStorage
      localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
      localStorage.setItem('activePath', path)
      
      return updatedTabs
    })
    navigate(path)
  }, [navigate])

  const closeTab = useCallback((tabId, e) => {
    e?.stopPropagation()
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === tabId)
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId)
      let updatedTabs
      
      if (filteredTabs.length === 0) {
        // If closing last tab, open index
        updatedTabs = [{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]
        localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
        localStorage.setItem('activePath', '/')
        navigate('/')
        return updatedTabs
      }

      // If closing active tab, activate another one
      if (tabToClose?.isActive) {
        const newActiveIndex = Math.max(0, filteredTabs.length - 1)
        updatedTabs = filteredTabs.map((tab, index) => ({
          ...tab,
          isActive: index === newActiveIndex
        }))
        const activePath = updatedTabs[newActiveIndex].path
        localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
        localStorage.setItem('activePath', activePath)
        navigate(activePath)
        return updatedTabs
      }

      updatedTabs = filteredTabs
      localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
      return updatedTabs
    })
  }, [navigate])

  const switchTab = useCallback((tabId) => {
    setTabs(prevTabs => {
      const tab = prevTabs.find(t => t.id === tabId)
      if (tab) {
        const updatedTabs = prevTabs.map(t => ({
          ...t,
          isActive: t.id === tabId
        }))
        localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
        localStorage.setItem('activePath', tab.path)
        navigate(tab.path)
        return updatedTabs
      }
      return prevTabs
    })
  }, [navigate])

  const getActiveTab = useCallback(() => {
    return tabs.find(tab => tab.isActive) || tabs[0]
  }, [tabs])

  return (
    <TabContext.Provider value={{ tabs, openTab, closeTab, switchTab, getActiveTab }}>
      {children}
    </TabContext.Provider>
  )
}

