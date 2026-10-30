import { Radio, CheckCircle } from 'lucide-react'

export interface PaymentMethodCardProps {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  selected: boolean
  badge?: string
  onSelect: () => void
  children?: React.ReactNode
}

export function PaymentMethodCard({
  id,
  title,
  subtitle,
  icon,
  selected,
  badge,
  onSelect,
  children,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/30 focus-visible:ring-offset-1 ${
        selected
          ? 'border-[#141414] bg-[#F4EFE6] shadow-xs'
          : 'border-[#DDD5C7] bg-white hover:border-[#C9C1B5] hover:shadow-sm'
      }`}
      aria-pressed={selected}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-1">
          {selected ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#141414] flex items-center justify-center">
              <CheckCircle className="w-3 h-3 fill-[#141414]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-[#DDD5C7] bg-white flex items-center justify-center">
              <Radio className="w-2.5 h-2.5 text-[#DDD5C7]" />
            </div>
          )}
          {badge && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#15803d] text-[10px] font-bold text-white rounded">
              {badge}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-[#141414]">{title}</span>
            {subtitle && <span className="text-xs text-[#736E66]">{subtitle}</span>}
          </div>
          {icon && <div className="mt-1">{icon}</div>}
        </div>
      </div>
      {children && (
        <div className="mt-3 pt-3 border-t border-[#F0EAE1]">
          {children}
        </div>
      )}
    </button>
  )
}