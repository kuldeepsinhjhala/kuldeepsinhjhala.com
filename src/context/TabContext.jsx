import { createContext, useContext, useState, useCallback, useEffect } from 'react'
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
  const [tabs, setTabs] = useState([
    { id: 'index', path: '/', label: 'index.jsx', isActive: true }
  ])

  // Sync active tab with current route
  useEffect(() => {
    setTabs(prevTabs => {
      const currentPath = location.pathname
      const hasTab = prevTabs.some(tab => tab.path === currentPath)
      
      if (hasTab) {
        // Update active tab
        return prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      } else {
        // Route changed but no tab exists (e.g., from mobile menu)
        // Don't auto-create tab, just update active state
        return prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      }
    })
  }, [location.pathname])

  const openTab = useCallback((path, label) => {
    setTabs(prevTabs => {
      // Check if tab already exists
      const existingTab = prevTabs.find(tab => tab.path === path)
      if (existingTab) {
        // Switch to existing tab
        return prevTabs.map(tab => ({
          ...tab,
          isActive: tab.path === path
        }))
      }

      // Add new tab and make it active, keep existing tabs
      const newTab = { id: path.replace('/', '') || 'index', path, label, isActive: true }
      return prevTabs.map(tab => ({ ...tab, isActive: false })).concat(newTab)
    })
    navigate(path)
  }, [navigate])

  const closeTab = useCallback((tabId, e) => {
    e?.stopPropagation()
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === tabId)
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId)
      
      if (filteredTabs.length === 0) {
        // If closing last tab, open index
        navigate('/')
        return [{ id: 'index', path: '/', label: 'index.jsx', isActive: true }]
      }

      // If closing active tab, activate another one
      if (tabToClose?.isActive) {
        const newActiveIndex = Math.max(0, filteredTabs.length - 1)
        const newTabs = filteredTabs.map((tab, index) => ({
          ...tab,
          isActive: index === newActiveIndex
        }))
        navigate(newTabs[newActiveIndex].path)
        return newTabs
      }

      return filteredTabs
    })
  }, [navigate])

  const switchTab = useCallback((tabId) => {
    setTabs(prevTabs => {
      const tab = prevTabs.find(t => t.id === tabId)
      if (tab) {
        navigate(tab.path)
        return prevTabs.map(t => ({
          ...t,
          isActive: t.id === tabId
        }))
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

