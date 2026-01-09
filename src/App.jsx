import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Loader from './components/Loader'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  return (
    <BrowserRouter>
      {isLoading ? (
        <Loader onComplete={handleLoaderComplete} />
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  )
}

export default App