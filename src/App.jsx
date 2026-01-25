import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import TerminalLoader from './components/TerminalLoader'
import AppRoutes from './routes/AppRoutes'
import CustomCursor from './components/CustomCursor'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  return (
    <BrowserRouter>
      <CustomCursor />
      {isLoading ? (
        <TerminalLoader onComplete={handleLoaderComplete} />
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  )
}

export default App