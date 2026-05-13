import { motion } from 'framer-motion'
import { Sparkles, User } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

/**
 * A single chat message bubble.
 * role: 'user' | 'assistant'
 */
export default function ChatMessage({ role, content }) {
  const { t } = useLanguage()
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
          isUser
            ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
            : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
        }`}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : ''} flex flex-col`}>
        <div className="mb-1 text-xs font-medium text-ink-400">
          {isUser ? t('ai.you') : t('ai.assistant')}
        </div>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-brand-500 text-white shadow-soft'
              : 'rounded-tl-sm bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-ink-50'
          }`}
        >
          {content}
        </div>
      </div>
    </motion.div>
  )
}
