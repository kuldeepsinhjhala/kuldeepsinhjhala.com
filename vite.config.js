import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import resumeData from './src/data/resume.json'

const resumeUrl = new URL(resumeData.resumeLink)
const resumeProxy = {
  '/resume-file': {
    target: resumeUrl.origin,
    changeOrigin: true,
    secure: true,
    rewrite: () => `${resumeUrl.pathname}${resumeUrl.search}`,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: resumeProxy,
    // Fieldstone saves with a file swap. Polling lets this dev server see those writes on Windows.
    watch: { usePolling: true, interval: 1000 },
  },
  preview: { proxy: resumeProxy },
})
