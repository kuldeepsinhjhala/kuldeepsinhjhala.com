import { Routes, Route } from 'react-router-dom'
import { TabProvider } from '../context/TabContext'
import { CopilotProvider, useCopilot } from '../context/CopilotContext'
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
import Tech from '../sections/tech/Tech'
import Projects from '../sections/projects/Projects'
import Resume from '../sections/resume/Resume'
import Blog from '../sections/blog/Blog'
import Contact from '../sections/contact/Contact'
import Extra from '../sections/extra/Extra'

function AppContent() {
  const { isOpen } = useCopilot()
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div 
        className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden transition-all duration-300"
        style={{ marginRight: isOpen ? '320px' : '0' }}
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
              <Route path="/tech" element={<Tech />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/extra" element={<Extra />} />
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
        <AppContent />
      </CopilotProvider>
    </TabProvider>
  )
}

export default AppRoutes

