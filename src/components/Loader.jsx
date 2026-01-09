import { useEffect, useState } from 'react'

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2.5 // 100% in 4 seconds (40 intervals of 100ms)
      })
    }, 100)

    const timer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-head text-2xl font-bold mb-4">Loading Portfolio</h2>
        <div className="w-64 h-2 bg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-body mt-4">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

export default Loader

