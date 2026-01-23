import { Routes, Route } from 'react-router-dom'
import { TabProvider } from '../context/TabContext'
import { CopilotProvider, useCopilot } from '../context/CopilotContext'
import { NavbarProvider } from '../context/NavbarContext'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import TabBar from '../components/TabBar'
import CopilotButton from '../components/CopilotButton'
import CopilotPanel from '../components/CopilotPanel'
import Landing from '../sections/landing/Landing'
import Journey from '../sections/journey/Journey'
import Experience from '../sections/experience/Experience'
import Education from '../sections/education/Education'
import Skills from '../sections/skills/Skills'
import Projects from '../sections/projects/Projects'
import Resume from '../sections/resume/Resume'
// import Blog from '../sections/blog/Blog' // Temporarily disabled blog section
import Contact from '../sections/contact/Contact'
import Achievements from '../sections/achievement/Achievements'

function AppContent() {
  const { isOpen } = useCopilot()
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div 
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
        style={{ 
          marginLeft: 'var(--navbar-width, 0px)'
        }}
      >
          <div className="flex-shrink-0">
            <SearchBar />
            <TabBar />
          </div>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              {/* <Route path="/blog" element={<Blog />} /> // Temporarily disabled blog route */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/achievements" element={<Achievements />} />
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
      <CopilotProvider>
        <NavbarProvider>
          <AppContent />
        </NavbarProvider>
      </CopilotProvider>
    </TabProvider>
  )
}

export default AppRoutes

