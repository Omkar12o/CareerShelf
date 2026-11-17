export type RequestStatus = 'new' | 'contacted' | 'in_progress' | 'done'

export type ProjectRequestRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  whatsapp: string
  college: string | null
  year_of_study: string | null
  course: string | null
  needs: string[] | null
  project_type: string | null
  tech_stack: string | null
  description: string
  deadline: string | null
  budget: string | null
  reference_url: string | null
  status: RequestStatus
  admin_note: string | null
  source_project: string | null
}

export type ProjectRequestInput = {
  full_name: string
  email: string
  whatsapp: string
  college: string
  year_of_study: string
  course: string
  needs: string[]
  project_type: string
  tech_stack: string
  description: string
  deadline: string
  budget: string
  reference_url: string
  source_project: string | null
}

export const EMPTY_REQUEST: ProjectRequestInput = {
  full_name: '',
  email: '',
  whatsapp: '',
  college: '',
  year_of_study: '',
  course: '',
  needs: [],
  project_type: '',
  tech_stack: '',
  description: '',
  deadline: '',
  budget: '',
  reference_url: '',
  source_project: null,
}

export const YEAR_OPTIONS = [
  '1st year',
  '2nd year',
  '3rd year',
  'Final year',
  'Passout',
  'Other',
]

export const COURSE_OPTIONS = [
  'BCA',
  'MCA',
  'BSc Computer Science',
  'BSc IT',
  'BE / BTech CSE',
  'BE / BTech IT',
  'BE / BTech (other branch)',
  'Diploma',
  'Other',
]

export const NEED_OPTIONS = [
  'Ready-made project kit',
  'Custom project development',
  'Mini project',
  'Final-year project',
  'Documentation / report',
  'PPT + viva preparation',
  'UI/UX design',
  'Interview preparation',
  'Referral / HR contacts',
  'Internship support',
  'Setup or bug fixing help',
]

export const PROJECT_TYPE_OPTIONS = [
  'Mini project',
  'Final-year project',
  'Big / custom project',
  'Website or portfolio',
  'Mobile app',
  'AI / ML project',
  'Documentation only',
  'Not sure yet',
]

export const BUDGET_OPTIONS = [
  'Under ₹3,000',
  '₹3,000 – ₹6,000',
  '₹6,000 – ₹10,000',
  '₹10,000 – ₹20,000',
  '₹20,000+',
  'Not sure yet',
]

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In progress',
  done: 'Done',
}

export const STATUS_ORDER: RequestStatus[] = [
  'new',
  'contacted',
  'in_progress',
  'done',
]

export const STATUS_TONE: Record<RequestStatus, string> = {
  new: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  in_progress: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  done: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
}

export function isRequestStatus(value: unknown): value is RequestStatus {
  return (
    value === 'new' ||
    value === 'contacted' ||
    value === 'in_progress' ||
    value === 'done'
  )
}

export type RequestFieldErrors = Partial<
  Record<keyof ProjectRequestInput, string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function validateProjectRequest(
  input: ProjectRequestInput,
): RequestFieldErrors {
  const errors: RequestFieldErrors = {}

  if (input.full_name.trim().length < 2) {
    errors.full_name = 'Enter your full name.'
  }

  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Enter a valid email address, for example you@college.edu.'
  }

  const phone = digitsOnly(input.whatsapp)
  if (phone.length < 10 || phone.length > 13) {
    errors.whatsapp = 'Enter a valid WhatsApp number with country code (10–13 digits).'
  }

  if (input.college.trim().length < 2) {
    errors.college = 'Enter your college or university name.'
  }

  if (!input.year_of_study) {
    errors.year_of_study = 'Select your current year.'
  }

  if (!input.course) {
    errors.course = 'Select your course.'
  }

  if (input.needs.length === 0) {
    errors.needs = 'Pick at least one thing you need help with.'
  }

  if (!input.project_type) {
    errors.project_type = 'Select the type of project you need.'
  }

  if (input.description.trim().length < 20) {
    errors.description =
      'Describe your project in at least 20 characters so we can quote accurately.'
  }

  if (input.description.trim().length > 2000) {
    errors.description = 'Keep the description under 2000 characters.'
  }

  if (!input.budget) {
    errors.budget = 'Select a budget range.'
  }

  const reference = input.reference_url.trim()
  if (reference && !/^https?:\/\/\S+\.\S+/i.test(reference)) {
    errors.reference_url =
      'Enter a full link starting with https:// (or leave it blank).'
  }

  return errors
}

export function toProjectRequestPayload(input: ProjectRequestInput) {
  const trimmed = (value: string) => {
    const result = value.trim()
    return result === '' ? null : result
  }

  return {
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp.trim(),
    college: trimmed(input.college),
    year_of_study: trimmed(input.year_of_study),
    course: trimmed(input.course),
    needs: input.needs,
    project_type: trimmed(input.project_type),
    tech_stack: trimmed(input.tech_stack),
    description: input.description.trim(),
    deadline: trimmed(input.deadline),
    budget: trimmed(input.budget),
    reference_url: trimmed(input.reference_url),
    source_project: trimmed(input.source_project ?? ''),
  }
}
