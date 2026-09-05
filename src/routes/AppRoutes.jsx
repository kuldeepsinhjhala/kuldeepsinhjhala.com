import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import Navbar from '../components/Navbar'
import SocialIcons from '../components/SocialIcons'
import { VISIBLE_SECTION_FLOW, FIRST_VISIBLE_SECTION } from '../config/sectionFlow'
import { SECTION_COMPONENTS } from './sectionComponents'

function ScrollToTop({ scrollRef }) {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [pathname, scrollRef])

  return null
}

function AppRoutes() {
  const fallbackPath = FIRST_VISIBLE_SECTION?.path || '/'
  const mainRef = useRef(null)

  return (
    <>
      <Seo />
      <ScrollToTop scrollRef={mainRef} />
      <div className="h-full flex flex-col bg-bg overflow-hidden">
        <Navbar />
        <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <Routes>
            {VISIBLE_SECTION_FLOW.map(({ path }) => {
              const Page = SECTION_COMPONENTS[path]
              if (!Page) return null
              return <Route key={path} path={path} element={<Page />} />
            })}
            <Route path="*" element={<Navigate to={fallbackPath} replace />} />
          </Routes>
        </main>
        <footer className="shrink-0 bg-deep text-white">
          <div className="site-shell py-2.5 flex items-center justify-center">
            <SocialIcons />
          </div>
        </footer>
      </div>
    </>
  )
}

export default AppRoutes
