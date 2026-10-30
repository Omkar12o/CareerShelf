import {
  BookOpen,
  Users,
  MessagesSquare,
  PhoneCall,
  FileText,
  Link2,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'
import type { ProductCategory } from '../data/products'

const iconMap: Record<ProductCategory, LucideIcon> = {
  ebook: BookOpen,
  contacts: Users,
  interview: MessagesSquare,
  consultancy: PhoneCall,
  resume: FileText,
  cheatsheet: ClipboardList,
  referral: Link2,
  service: ClipboardList,
}

const colorMap: Record<
  ProductCategory,
  { bg: string; text: string }
> = {
  ebook: { bg: 'bg-amber-100', text: 'text-amber-700' },
  contacts: { bg: 'bg-accent-100', text: 'text-accent-700' },
  interview: { bg: 'bg-brand-100', text: 'text-brand-700' },
  consultancy: { bg: 'bg-violet-100', text: 'text-violet-700' },
  resume: { bg: 'bg-sky-100', text: 'text-sky-700' },
  cheatsheet: { bg: 'bg-teal-100', text: 'text-teal-700' },
  referral: { bg: 'bg-rose-100', text: 'text-rose-700' },
  service: { bg: 'bg-brand-100', text: 'text-brand-700' },
}

type ProductIconProps = {
  category: ProductCategory
  size?: number
  className?: string
}

export function ProductIcon({
  category,
  size = 24,
  className = '',
}: ProductIconProps) {
  const Icon = iconMap[category]
  return <Icon size={size} strokeWidth={1.8} className={className} />
}

export function ProductIconBadge({
  category,
  className = '',
}: ProductIconProps) {
  const { bg, text } = colorMap[category]
  return (
    <span
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl ${bg} ${text} ${className}`}
    >
      <ProductIcon category={category} size={24} />
    </span>
  )
}
