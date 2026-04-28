import { basePrompt } from '../data/prompt.js'

const API_URL = 'http://localhost:5000/api/ask-gemini'
const BASE_PROMPT = basePrompt

function buildPrompt(conversationMessages) {
  const history = conversationMessages.slice(0, -1)
  const currentInput = conversationMessages[conversationMessages.length - 1]?.content ?? ''

  let prompt = BASE_PROMPT

  if (history.length > 0) {
    prompt += '\n\nCONVERSATION HISTORY:\n'
    history.forEach((msg) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant'
      prompt += `${role}: ${msg.content}\n`
    })
    prompt += '\n'
  }

  prompt += `CURRENT USER MESSAGE:\n${currentInput}\n\nPlease respond as the Virtual Teams & Solutions assistant:`

  return prompt
}

function unwrap(value, depth = 0) {
  if (depth > 5) return { text: String(value), category: 'Unknown' }

  if (typeof value === 'object' && value !== null) {
    const category = value.category ?? 'Unknown'
    const candidate =
      value.response ??
      value.answer ??
      value.text ??
      value.content ??
      value.candidates?.[0]?.content?.parts?.[0]?.text ??
      null

    if (candidate != null) {
      const inner = unwrap(candidate, depth + 1)
      return {
        text: inner.text,
        category: inner.category !== 'Unknown' ? inner.category : category,
      }
    }

    return { text: String(value), category }
  }

  if (typeof value !== 'string') return { text: String(value), category: 'Unknown' }

  let str = value.trim()

  if (str.startsWith('```')) {
    str = str.replace(/^```[\w]*\s*([\s\S]*?)\s*```\s*$/, '$1').trim()
  }

  if (str.startsWith('{')) {
    try {
      return unwrap(JSON.parse(str), depth + 1)
    } catch {
      // Not valid JSON, return as plain text below.
    }
  }

  return { text: str, category: 'Unknown' }
}

export async function sendChatMessage(conversationMessages) {
  const prompt = buildPrompt(conversationMessages)

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? err?.error ?? `Server error (${res.status})`)
  }

  const raw = await res.text()
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = raw
  }

  const result = unwrap(parsed)
  return result.text
    ? result
    : { text: 'Sorry, I could not get a response.', category: 'Unknown' }
}
