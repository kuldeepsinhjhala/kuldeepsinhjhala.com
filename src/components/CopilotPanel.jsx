import { useState, useRef, useEffect } from 'react'
import { useCopilot } from '../context/CopilotContext'

const API_BASE_URL = 'http://localhost:3000'

function CopilotPanel() {
  const { isOpen, setIsOpen } = useCopilot()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you explore this portfolio?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Handle panel state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 768) {
        // Auto-open on screens >= 768px
        setIsOpen(true)
      } else {
        // Auto-close on screens < 768px
        setIsOpen(false)
      }
    }

    // Check on mount - ensure panel opens if screen is >= 768px
    const initialWidth = window.innerWidth
    if (initialWidth >= 768) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }

    // Listen for resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() }
    const currentInput = input.trim()
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build conversation history (exclude the initial welcome message and current message)
      // Format: array of { role: 'user' | 'assistant', content: string }
      const conversationHistory = messages
        .filter(msg => msg.id !== 1) // Exclude initial welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      let response
      try {
        response = await fetch(`${API_BASE_URL}/api/kuldeep-copilot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: conversationHistory
          }),
        })
      } catch (fetchError) {
        // Network error - server is likely down or unreachable
        console.error('Network error - backend server unreachable:', fetchError)
        throw new Error('NETWORK_ERROR')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.message) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error sending message to AI:', error)
      
      // Show comprehensive error message with contact information
      // This will show for any error (network, API, or other)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'error', // Special marker for error message
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Render error message component
  const renderErrorMessage = () => (
    <div className="space-y-4">
      <div className="text-sm text-body leading-relaxed">
        <p className="mb-3">
          I apologize, but I'm currently experiencing some technical difficulties connecting to Kuldeep's portfolio AI backend server. 
          This might be a temporary issue, and I would be grateful if you could try again after some time.
        </p>
        <p className="mb-4">
          In the meantime, I would be delighted if you could reach out to Kuldeep directly. He would be very happy to hear from you and assist with any questions or opportunities you might have.
        </p>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-head uppercase tracking-wider mb-2">Direct Contact</div>
        
        <a 
          href="mailto:kuldeephjhala@gmail.com" 
          className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="group-hover:underline">kuldeephjhala@gmail.com</span>
        </a>
        
        <a 
          href="tel:+919726413743" 
          className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="group-hover:underline">+91 9726413743</span>
        </a>
      </div>

      {/* Social Media Profiles */}
      <div className="space-y-3 pt-2 border-t border-gold/10">
        <div className="text-xs font-semibold text-head uppercase tracking-wider mb-2">Connect on Social Media</div>
        
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/kuldeepsinhjhala"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="group-hover:underline">GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/kuldeepsinhjhala"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="group-hover:underline">LinkedIn</span>
          </a>

          <a
            href="https://twitter.com/kuldepsinhjhala"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
            aria-label="Twitter"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="group-hover:underline">Twitter</span>
          </a>

          <a
            href="https://medium.com/@kuldeepsinhjhala"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-body hover:text-gold transition-colors group"
            aria-label="Medium"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
            <span className="group-hover:underline">Medium</span>
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Overlay for mobile screens (≤425px) */}
      {isOpen && (
        <div 
          className="hidden max-[425px]:block fixed inset-0 bg-shadow/80 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className={`flex flex-col bg-card border-l border-gold/20 w-80 max-[425px]:w-full max-[425px]:border-l-0 h-screen fixed right-0 top-0 transition-transform duration-300 z-50 rounded-tl-2xl rounded-bl-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--c-card)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <h2 className="text-head text-sm font-semibold">Copilot</h2>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-body hover:text-head transition-colors p-1 rounded hover:bg-bg"
            aria-label={isOpen ? 'Close panel' : 'Open panel'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-gold text-bg'
                  : message.isError
                  ? 'bg-bg text-body border border-error/30'
                  : 'bg-bg text-body border border-gold/20'
              }`}
            >
              {message.isError ? (
                renderErrorMessage()
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-3 py-2 bg-bg text-body border border-gold/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-body">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <div className="p-4 border-t border-gold/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Thinking..." : "Ask me anything..."}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-bg border border-gold/20 rounded text-head text-sm placeholder:text-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-gold text-bg rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CopilotPanel

