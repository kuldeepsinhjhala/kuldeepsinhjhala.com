import { createRoot } from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"  
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
    <>
    <SpeedInsights />
    <App />
    </>
)
