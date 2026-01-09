import { useState, useRef, useEffect } from 'react'
import { useCopilot } from '../context/CopilotContext'

function CopilotPanel() {
  const { isOpen, setIsOpen } = useCopilot()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you explore this portfolio?' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I understand you\'re asking about: "' + input + '". This is a demo response. In a real implementation, this would connect to an AI service.'
      }
      setMessages(prev => [...prev, aiMessage])
    }, 500)
  }

  return (
    <>

      <div className={`hidden lg:flex flex-col bg-card border-l border-gold/20 w-80 h-screen fixed right-0 top-0 transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                  : 'bg-bg text-body border border-gold/20'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <div className="p-4 border-t border-gold/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 bg-bg border border-gold/20 rounded text-head text-sm placeholder:text-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gold text-bg rounded hover:bg-gold/90 transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CopilotPanel

