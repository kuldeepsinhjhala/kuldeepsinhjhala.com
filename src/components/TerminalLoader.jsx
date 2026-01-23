import { useState, useEffect, useRef } from 'react'
import logo from '../assets/logo.png'

function TerminalLoader({ 
  lines = [
    '[INFO] Booting Node.js runtime environment',
    '[INFO] Sequelize: Authenticating database handshake',
    '[INFO] Establishing connection to MSSQL Express',
    '[INFO] Syncing models and Stored Procedures',
    '[INFO] Warming up local LLM (Gemini-Engine)',
    '[INFO] Context window initialized',
  '[INFO] Application ready: Portfolio is live'
  ],
  speed = 30,
  show = true,
  className = '',
  onComplete
}) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)
  const linesRef = useRef(lines)
  const currentLineIndexRef = useRef(0)
  const currentCharIndexRef = useRef(0)

  // Update lines ref when prop changes
  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  useEffect(() => {
    if (!show) {
      // Reset state when hidden
      setDisplayedLines([])
      currentLineIndexRef.current = 0
      currentCharIndexRef.current = 0
      setCurrentLineIndex(0)
      setCurrentCharIndex(0)
      setIsTyping(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    // Reset and start typing animation
    setDisplayedLines([])
    currentLineIndexRef.current = 0
    currentCharIndexRef.current = 0
    setCurrentLineIndex(0)
    setCurrentCharIndex(0)
    setIsTyping(true)

    const typeNextChar = () => {
      const lineIdx = currentLineIndexRef.current
      const charIdx = currentCharIndexRef.current
      const currentLine = linesRef.current[lineIdx]
      
      if (!currentLine) {
        setIsTyping(false)
        return
      }

      if (charIdx < currentLine.length) {
        // Still typing current line
        const currentLineText = currentLine.substring(0, charIdx + 1)
        setDisplayedLines((prevLines) => {
          const newLines = [...prevLines]
          newLines[lineIdx] = currentLineText
          return newLines
        })
        currentCharIndexRef.current = charIdx + 1
        setCurrentCharIndex(charIdx + 1)
      } else {
        // Finished current line
        if (lineIdx < linesRef.current.length - 1) {
          // Wait before starting next line
          clearInterval(intervalRef.current)
          timeoutRef.current = setTimeout(() => {
            const nextLineIndex = lineIdx + 1
            currentLineIndexRef.current = nextLineIndex
            currentCharIndexRef.current = 0
            setCurrentLineIndex(nextLineIndex)
            setCurrentCharIndex(0)
            intervalRef.current = setInterval(typeNextChar, speed)
          }, 150) // Wait 150ms between lines
        } else {
          // All lines completed
          setIsTyping(false)
          clearInterval(intervalRef.current)
          // Wait a moment, then fade out terminal and show logo
          timeoutRef.current = setTimeout(() => {
            setTerminalVisible(false)
            // Show logo after terminal fades out
            setTimeout(() => {
              setShowLogo(true)
              // Call onComplete after logo is shown
          if (onComplete) {
            timeoutRef.current = setTimeout(() => {
              onComplete()
                }, 2000) // Show logo for 2 seconds
          }
            }, 300) // Small delay for fade transition
          }, 1000) // Wait 1 second after terminal completes
        }
      }
    }

    // Start typing first line
    intervalRef.current = setInterval(typeNextChar, speed)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [show, speed, onComplete])

  if (!show) {
    return null
  }

  const currentLine = linesRef.current[currentLineIndex] || ''
  const isCurrentLineComplete = currentCharIndex >= currentLine.length
  const allLinesComplete = !isTyping && currentLineIndex >= linesRef.current.length - 1 && isCurrentLineComplete

  // Show logo screen after terminal
  if (showLogo) {
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
        style={{ 
          backgroundColor: 'var(--c-shadow)',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 166, 107, 0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Light background highlights */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201, 166, 107, 0.08) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(230, 241, 255, 0.05) 0%, transparent 60%)'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 35% at 70% 70%, rgba(201, 166, 107, 0.06) 0%, transparent 55%)'
          }}
        />
        
        {/* Logo with simple animation */}
        <div className="relative">
          <img 
            src={logo} 
            alt="Kuldeepsinh Jhala Logo" 
            className="h-32 md:h-48 lg:h-64 w-auto object-contain opacity-0"
            style={{
              filter: 'brightness(0) invert(1) sepia(100%) saturate(200%) hue-rotate(20deg)',
              animation: 'simpleFadeIn 0.8s ease-out 0.2s forwards'
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      style={{ 
        backgroundColor: 'var(--c-shadow)',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 166, 107, 0.05) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* Terminal Window */}
      <div 
        className={`w-full max-w-3xl mx-4 md:mx-8 transition-opacity duration-300 ${
          terminalVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Terminal Header */}
        <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-t-lg px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            {/* Terminal Window Controls */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-body text-xs font-mono ml-2">terminal</span>
          </div>
          <div className="text-body/50 text-xs font-mono">
            kuldeepsinhjhala.com
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          className="bg-card/90 backdrop-blur-sm border-l border-r border-b border-gold/20 rounded-b-lg p-6 md:p-8 shadow-2xl"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 166, 107, 0.1)'
          }}
        >
          {/* Terminal Content */}
          <div className="text-gold text-sm md:text-base leading-relaxed" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
              <div className="space-y-1.5 md:space-y-2">
              {displayedLines.map((line, index) => {
                  // Split line to separate [INFO] from the rest
                  const infoMatch = line.match(/^(\[INFO\])(.*)$/)
                  const infoPart = infoMatch ? infoMatch[1] + ' ' : ''
                  const textPart = infoMatch ? infoMatch[2] : line
                  
                if (index === currentLineIndex && isTyping) {
                  // Current line being typed
                  return (
                    <div key={index} className="flex items-center group">
                        {infoPart && (
                          <span style={{ color: '#3fb950', fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>{infoPart}</span>
                        )}
                        <span className="text-gold" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>{textPart}</span>
                      {!isCurrentLineComplete && (
                          <span className="inline-block text-gold ml-1 animate-blink-cursor" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>▌</span>
                      )}
                    </div>
                  )
                }
                // Completed lines
                return (
                  <div key={index} className="flex items-center opacity-90">
                      {infoPart && (
                        <span style={{ color: '#3fb950', fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>{infoPart}</span>
                      )}
                      <span className="text-gold" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>{textPart}</span>
                  </div>
                )
              })}
              
              {allLinesComplete && (
                  <div className="flex items-center mt-2">
                    <span className="inline-block text-gold ml-0 animate-blink-cursor" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>▌</span>
              </div>
            )}
              </div>
          </div>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201, 166, 107, 0.03) 0%, transparent 70%)'
        }}
      ></div>
    </div>
  )
}

export default TerminalLoader
