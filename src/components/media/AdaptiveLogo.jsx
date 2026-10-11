import { useEffect, useState } from 'react'

const SAMPLE = 24
const LIGHT_MARK = 200

function plateForImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = SAMPLE
        canvas.height = SAMPLE
        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (!context) {
          resolve('light')
          return
        }
        context.drawImage(img, 0, 0, SAMPLE, SAMPLE)
        const { data } = context.getImageData(0, 0, SAMPLE, SAMPLE)
        let luminance = 0
        let count = 0
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]
          if (alpha < 16) continue
          const red = data[i]
          const green = data[i + 1]
          const blue = data[i + 2]
          luminance += (0.2126 * red + 0.7152 * green + 0.0722 * blue) * (alpha / 255)
          count += 1
        }
        if (!count) {
          resolve('light')
          return
        }
        resolve(luminance / count >= LIGHT_MARK ? 'dark' : 'light')
      } catch {
        resolve('light')
      }
    }
    img.onerror = () => resolve('light')
    img.src = src
  })
}

export default function AdaptiveLogo({
  src,
  alt = '',
  className = '',
  imgClassName = 'h-full w-full object-contain p-1',
  plate: plateProp,
}) {
  const [detected, setDetected] = useState('light')
  const plate = plateProp || detected

  useEffect(() => {
    if (!src || plateProp) return undefined
    let active = true
    setDetected('light')
    plateForImage(src).then((next) => {
      if (active) setDetected(next)
    })
    return () => {
      active = false
    }
  }, [src, plateProp])

  if (!src) return null

  const plateClass = plate === 'black' ? 'bg-black' : plate === 'dark' ? 'bg-deep' : 'bg-white'

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden border border-gold/15 ${plateClass} ${className}`}
    >
      <img src={src} alt={alt} className={imgClassName} loading="lazy" decoding="async" />
    </span>
  )
}
