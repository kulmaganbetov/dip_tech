import { Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// Three-dot "AI is typing" bubble shown while waiting for a reply.
export default function TypingIndicator() {
  const { t } = useLanguage()
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <Sparkles size={16} />
      </div>
      <div className="flex flex-col">
        <div className="mb-1 text-xs font-medium text-ink-400">
          {t('ai.assistant')} · {t('ai.thinking')}
        </div>
        <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-3 dark:bg-ink-800">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ink-400"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
