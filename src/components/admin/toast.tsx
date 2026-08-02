import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { ToastContext, type ToastTone } from './toast-context'

type ToastItem = {
  id: number
  tone: ToastTone
  message: string
}

const toneStyles: Record<
  ToastTone,
  { icon: ReactNode; iconClass: string }
> = {
  success: {
    icon: <CheckCircle2 className="size-5" />,
    iconClass: 'text-accent-400',
  },
  error: {
    icon: <AlertTriangle className="size-5" />,
    iconClass: 'text-red-400',
  },
  info: {
    icon: <Info className="size-5" />,
    iconClass: 'text-sky-400',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (tone: ToastTone, message: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setItems((prev) => [...prev, { id, tone, message }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {items.map((item) => {
          const style = toneStyles[item.tone]
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
            >
              <span className={`mt-0.5 shrink-0 ${style.iconClass}`}>
                {style.icon}
              </span>
              <p className="min-w-0 flex-1 leading-snug">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-gray-400 transition-colors hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
