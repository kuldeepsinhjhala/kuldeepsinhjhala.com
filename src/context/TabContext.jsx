import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FIRST_VISIBLE_SECTION, isPathVisible } from '../config/sectionFlow'

const TabContext = createContext()

export const useTabs = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabs must be used within TabProvider')
  }
  return context
}

function fallbackTab() {
  const section = FIRST_VISIBLE_SECTION
  if (!section) {
    return { id: 'index', path: '/', label: 'index.jsx', isActive: true }
  }
  return {
    id: section.id,
    path: section.path,
    label: section.label,
    isActive: true,
  }
}

function visibleTabsOnly(tabs) {
  const kept = (Array.isArray(tabs) ? tabs : []).filter((tab) => isPathVisible(tab.path))
  if (kept.length === 0) return [fallbackTab()]
  if (!kept.some((tab) => tab.isActive)) {
    return kept.map((tab, index) => ({ ...tab, isActive: index === 0 }))
  }
  return kept
}

export const TabProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Initialize tabs - check if first load or refresh
  const initializeTabs = () => {
    const home = fallbackTab()
    const isFirstLoad = !localStorage.getItem('hasVisited')
    const savedTabs = localStorage.getItem('savedTabs')
    const savedActivePath = localStorage.getItem('activePath')
    
    if (isFirstLoad) {
      localStorage.setItem('hasVisited', 'true')
      localStorage.setItem('savedTabs', JSON.stringify([home]))
      localStorage.setItem('activePath', home.path)
      return [home]
    } else if (savedTabs && savedActivePath) {
      try {
        const parsedTabs = JSON.parse(savedTabs)
        const restoredTabs = visibleTabsOnly(parsedTabs.map(tab => ({
          ...tab,
          isActive: tab.path === savedActivePath && isPathVisible(tab.path)
        })))
        const active = restoredTabs.find((tab) => tab.isActive) || restoredTabs[0]
        localStorage.setItem('savedTabs', JSON.stringify(restoredTabs))
        localStorage.setItem('activePath', active.path)
        return restoredTabs
      } catch {
        return [home]
      }
    }
    
    return [home]
  }

  const [tabs, setTabs] = useState(initializeTabs)
  const isOpeningTabRef = useRef(false)

  // Handle first load vs refresh
  useEffect(() => {
    const home = fallbackTab()
    const savedActivePath = localStorage.getItem('activePath')
    const targetPath = isPathVisible(savedActivePath) ? savedActivePath : home.path

    if (targetPath && targetPath !== location.pathname) {
      navigate(targetPath, { replace: true })
    } else if (!isPathVisible(location.pathname)) {
      navigate(home.path, { replace: true })
    }
  }, []) // Only run on mount

  // Sync active tab with current route and save to localStorage
  useEffect(() => {
    // Skip if we're in the middle of opening a tab (to prevent duplicates)
    if (isOpeningTabRef.current) {
      isOpeningTabRef.current = false
      return
    }

    if (!isPathVisible(location.pathname)) {
      return
    }

    setTabs(prevTabs => {
      const currentPath = location.pathname
      const visiblePrev = visibleTabsOnly(prevTabs)
      const hasTab = visiblePrev.some(tab => tab.path === currentPath)
      
      let updatedTabs
      if (hasTab) {
        updatedTabs = visiblePrev.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      } else {
        updatedTabs = visiblePrev.map(tab => ({
          ...tab,
          isActive: tab.path === currentPath
        }))
      }
      
      localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
      localStorage.setItem('activePath', currentPath)
      
      return updatedTabs
    })
  }, [location.pathname])

  const openTab = useCallback((path, label, options) => {
    const targetPath = isPathVisible(path) ? path : fallbackTab().path
    const targetLabel = isPathVisible(path) ? label : fallbackTab().label

    isOpeningTabRef.current = true
    
    setTabs(prevTabs => {
      const visiblePrev = visibleTabsOnly(prevTabs)
      const existingTab = visiblePrev.find(tab => tab.path === targetPath)
      let updatedTabs
      
      if (existingTab) {
        updatedTabs = visiblePrev.map(tab => ({
          ...tab,
          isActive: tab.path === targetPath
        }))
      } else {
        const newTab = { id: targetPath.replace('/', '') || 'index', path: targetPath, label: targetLabel, isActive: true }
        updatedTabs = visiblePrev.map(tab => ({ ...tab, isActive: false })).concat(newTab)
      }
      
      localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
      localStorage.setItem('activePath', targetPath)
      
      return updatedTabs
    })
    const navOpts = {}
    if (options?.replace) navOpts.replace = true
    if (options?.state !== undefined) navOpts.state = options.state
    navigate(targetPath, Object.keys(navOpts).length ? navOpts : undefined)
  }, [navigate])

  const closeTab = useCallback((tabId, e) => {
    e?.stopPropagation()
    setTabs(prevTabs => {
      const visiblePrev = visibleTabsOnly(prevTabs)
      const tabToClose = visiblePrev.find(tab => tab.id === tabId)
      const filteredTabs = visiblePrev.filter(tab => tab.id !== tabId)
      let updatedTabs
      
      if (filteredTabs.length === 0) {
        const home = fallbackTab()
        updatedTabs = [home]
        localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
        localStorage.setItem('activePath', home.path)
        navigate(home.path)
        return updatedTabs
      }

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
      const visiblePrev = visibleTabsOnly(prevTabs)
      const tab = visiblePrev.find(t => t.id === tabId)
      if (tab && isPathVisible(tab.path)) {
        const updatedTabs = visiblePrev.map(t => ({
          ...t,
          isActive: t.id === tabId
        }))
        localStorage.setItem('savedTabs', JSON.stringify(updatedTabs))
        localStorage.setItem('activePath', tab.path)
        navigate(tab.path)
        return updatedTabs
      }
      return visiblePrev
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
