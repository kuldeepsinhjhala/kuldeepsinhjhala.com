import { useState, useEffect, useRef } from 'react'

function TerminalLoader({ 
  lines = [
    '> initializing app',
    '> connecting to server',
    '> loading modules...',
    '> compiling assets',
    '> optimizing performance',
    '> setting up environment',
    '> ready to launch'
  ],
  speed = 50,
  show = true,
  className = '',
  onComplete
}) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
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
          }, 500) // Wait 500ms between lines
        } else {
          // All lines completed
          setIsTyping(false)
          clearInterval(intervalRef.current)
          // Call onComplete after a brief delay to show the final cursor
          if (onComplete) {
            timeoutRef.current = setTimeout(() => {
              onComplete()
            }, 1000) // Wait 1 second after completion before calling onComplete
          }
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
      <div className="w-full max-w-3xl mx-4 md:mx-8 animate-fade-in">
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
          <div className="font-mono text-gold text-sm md:text-base leading-relaxed">
            {/* Welcome Message */}
            <div className="text-gold/80 mb-4 text-xs md:text-sm">
              <span className="text-gold/60">┌─</span>
              <span className="mx-2">Welcome to Kuldeep's Portfolio v1.0</span>
              <span className="text-gold/60">─┐</span>
            </div>
            
            <div className="space-y-2.5 md:space-y-3">
              {displayedLines.map((line, index) => {
                if (index === currentLineIndex && isTyping) {
                  // Current line being typed
                  return (
                    <div key={index} className="flex items-center group">
                      <span className="text-gold/60 mr-2 select-none">$</span>
                      <span className="text-gold">{line}</span>
                      {!isCurrentLineComplete && (
                        <span className="inline-block w-2.5 h-5 bg-gold ml-1.5 animate-blink-cursor shadow-[0_0_8px_rgba(201,166,107,0.8)]"></span>
                      )}
                    </div>
                  )
                }
                // Completed lines
                return (
                  <div key={index} className="flex items-center opacity-90">
                    <span className="text-gold/60 mr-2 select-none">$</span>
                    <span className="text-gold">{line}</span>
                  </div>
                )
              })}
              
              {allLinesComplete && (
                <div className="flex items-center mt-4 pt-4 border-t border-gold/10">
                  <span className="text-gold/60 mr-2 select-none">$</span>
                  <span className="inline-block w-2.5 h-5 bg-gold ml-1.5 animate-blink-cursor shadow-[0_0_8px_rgba(201,166,107,0.8)]"></span>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            {isTyping && (
              <div className="mt-6 pt-4 border-t border-gold/10">
                <div className="flex items-center gap-2 text-gold/60 text-xs">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></div>
                  <span>Processing...</span>
                </div>
              </div>
            )}
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
