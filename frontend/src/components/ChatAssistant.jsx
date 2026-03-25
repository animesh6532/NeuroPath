import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ChatAssistant.css'

const cannedReplies = {
  intro: 'Hi there! I can help you interpret your resume analysis, suggest skill growth plans, and refine your interview prep path.',
  skills: 'Based on your last analysis, focus on problem-solving, communication, and domain-specific AI tools. An advanced portfolio project is a great next step.',
  careers: 'If your top matches are in Machine Learning and Data Science, consider writing a specialization roadmap and contributing to open-source model evaluation toolkits.',
}

function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome to AiAssist! Ask me about your resume results or career pathway.' },
  ])
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const question = input.trim()
    setMessages((prev) => [...prev, { from: 'user', text: question }])
    setInput('')
    setSending(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const lower = question.toLowerCase()
    let reply = cannedReplies.intro
    if (lower.includes('skill')) reply = cannedReplies.skills
    else if (lower.includes('career')) reply = cannedReplies.careers
    else if (lower.includes('score')) reply = 'A score above 75% is good; you can reach 90% by improving missing skills and domain experiences.'

    setMessages((prev) => [...prev, { from: 'bot', text: reply }])
    setSending(false)
  }

  return (
    <div className="chat-assistant">
      <button className="chat-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '✕' : '💬'} AI Assistant
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.from}`}>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                type="text"
                value={input}
                placeholder="Ask about your resume insights..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              />
              <button onClick={handleSend} disabled={sending || !input.trim()}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatAssistant
