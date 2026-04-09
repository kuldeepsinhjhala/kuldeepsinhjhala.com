import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from "@vercel/speed-insights/react"
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <SpeedInsights />
    <App />
  </HelmetProvider>
)
