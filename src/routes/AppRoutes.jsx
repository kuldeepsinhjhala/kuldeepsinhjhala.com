import { useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Seo from '../components/Seo'
import { TabProvider } from '../context/TabContext'
import { UnifiedPortfolioScroll } from './UnifiedPortfolioScroll'
import { CopilotProvider } from '../context/CopilotContext'
import { NavbarProvider } from '../context/NavbarContext'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import TabBar from '../components/TabBar'
import CustomCursor from '../components/CustomCursor'
import CopilotButton from '../components/CopilotButton'
import CopilotPanel from '../components/CopilotPanel'
function AppContent() {
  const mainRef = useRef(null)

  return (
    <div className="flex h-screen overflow-hidden">
      <CustomCursor />
      <Navbar />
      <div 
        className="flex-1 flex flex-col h-screen min-h-0 overflow-hidden transition-all duration-300"
        style={{ 
          marginLeft: 'var(--navbar-width, 0px)'
        }}
      >
          <div className="flex-shrink-0">
            <SearchBar />
            <TabBar />
          </div>
          <main
            ref={mainRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-auto"
          >
            <Routes>
              <Route path="*" element={<UnifiedPortfolioScroll scrollContainerRef={mainRef} />} />
            </Routes>
          </main>
        </div>
        <CopilotButton />
        <CopilotPanel />
      </div>
  )
}

function AppRoutes() {
  return (
    <TabProvider>
      <Seo />
      <CopilotProvider>
        <NavbarProvider>
          <AppContent />
        </NavbarProvider>
      </CopilotProvider>
    </TabProvider>
  )
}

export default AppRoutes

