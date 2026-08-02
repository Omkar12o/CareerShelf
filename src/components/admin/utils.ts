import { parseCategories } from '../../data/products'

export const PRODUCT_FILES_BUCKET = 'product-files'

export const ADMIN_CATEGORY_OPTIONS = [
  'hr-contacts',
  'interview-question-sets',
  'digital-ebooks',
  'cheatsheet',
  'consultancy',
  'resume-guides',
  'reference-referrals',
] as const

const CATEGORY_OPTION_BY_KEY: Record<string, string> = {
  contacts: 'hr-contacts',
  interview: 'interview-question-sets',
  ebook: 'digital-ebooks',
  cheatsheet: 'cheatsheet',
  consultancy: 'consultancy',
  resume: 'resume-guides',
  referral: 'reference-referrals',
}

export function categoryOptionValue(
  raw: string | string[] | null | undefined,
): string {
  const canonical = parseCategories(raw)[0]
  return canonical ? (CATEGORY_OPTION_BY_KEY[canonical] ?? canonical) : ''
}

export function categoryOptionLabel(
  raw: string | string[] | null | undefined,
): string {
  const value = categoryOptionValue(raw)
  return value || '—'
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
