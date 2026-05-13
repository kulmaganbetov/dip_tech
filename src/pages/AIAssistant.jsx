import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, AlertTriangle } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import TypingIndicator from '../components/TypingIndicator'
import { useLanguage } from '../context/LanguageContext'
import { chatWithAI, demoReply, hasOpenAIKey } from '../utils/openai'

export default function AIAssistant() {
  const { t, lang } = useLanguage()
  const keyAvailable = hasOpenAIKey()

  // Conversation state. The first assistant message is a greeting.
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('ai.welcome') },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  // Keep the chat scrolled to the bottom on new messages.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending])

  // If language changes, refresh the welcome line.
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].role === 'assistant'
        ? [{ role: 'assistant', content: t('ai.welcome') }]
        : m
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const examples = [t('ai.example1'), t('ai.example2'), t('ai.example3')]

  const send = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || sending) return

    setError(null)
    setInput('')
    const nextHistory = [...messages, { role: 'user', content: text }]
    setMessages(nextHistory)
    setSending(true)

    try {
      let reply
      if (keyAvailable) {
        reply = await chatWithAI(messages, text)
      } else {
        // Simulate latency for a nicer demo feel.
        await new Promise((r) => setTimeout(r, 900))
        reply = demoReply(text, lang)
      }
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unknown error')
      // Always fall back to demo so the UI never feels broken.
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: demoReply(text, lang) },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="container-x py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <span className="chip">
          <Sparkles size={12} className="text-brand-500" />
          AI Beta
        </span>
        <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl dark:text-white">
          {t('ai.title')}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-ink-500 dark:text-ink-300">
          {t('ai.subtitle')}
        </p>
      </motion.div>

      {!keyAvailable && (
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{t('ai.missingKey')}</span>
          </div>
        </div>
      )}

      {/* Chat surface */}
      <div className="mx-auto mt-8 flex max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-700">
        <div
          ref={scrollRef}
          className="flex h-[55vh] flex-col gap-5 overflow-y-auto p-6 sm:h-[60vh]"
        >
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}
          {sending && <TypingIndicator />}
        </div>

        {/* Quick suggestion chips */}
        {messages.length <= 1 && (
          <div className="border-t border-ink-100 px-6 py-4 dark:border-ink-700">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
              {t('ai.examples')}
            </div>
            <div className="flex flex-wrap gap-2">
              {examples.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="chip cursor-pointer hover:bg-brand-500 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-2 border-t border-ink-100 p-3 dark:border-ink-700"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder')}
            className="input border-transparent bg-ink-50 focus:bg-white dark:bg-ink-900 dark:focus:bg-ink-900"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="btn-accent disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t('ai.send')}
          >
            <Send size={16} />
            <span className="hidden sm:inline">{t('ai.send')}</span>
          </button>
        </form>
      </div>

      {error && (
        <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-red-500">
          {error}
        </p>
      )}
    </section>
  )
}
