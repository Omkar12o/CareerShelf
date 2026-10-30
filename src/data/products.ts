export type ProductCategory =
  | 'ebook'
  | 'contacts'
  | 'interview'
  | 'consultancy'
  | 'resume'
  | 'cheatsheet'
  | 'referral'
  | 'service'

export type Product = {
  id: string
  slug: string
  title: string
  tagline: string
  shortDescription: string
  description: string[]
  price: number
  originalPrice?: number
  category: ProductCategory
  badge?: string
  featured?: boolean
  includes: string[]
  rating: number
  reviewCount: number
  downloadType: string
  updatedAt: string
  duration?: string
  slotsLeft?: number
  'pdf-url'?: string
  // Service-specific fields
  serviceType?: string
  features?: string[]
  techStack?: string[]
  deliverables?: string[]
  whatsIncluded?: string[]
  deliveryTime?: string
  documentation?: string[]
  faq?: { q: string; a: string }[]
  pricingNote?: string
}

export type ProductRow = {
  id: string | number
  created_at: string
  title: string
  description: string
  price: number
  categories: string | string[]
  'pdf-url': string
}

export type OrderRow = {
  id: string | number
  user_id: string
  product_id: string
  amount: number
  status: string
  created_at: string
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'hr-contact-list-saas',
    title: 'The Complete HR Contact List',
    tagline: '2,400+ verified HR emails across SaaS & tech',
    shortDescription:
      'A ready-to-use spreadsheet of HR and TA contacts at 1,800+ companies, so you can reach the right person without cold-outreach guesswork.',
    description: [
      'Reaching a real human in HR is the single biggest bottleneck in a modern job search. This list compiles 2,400+ verified HR and Talent Acquisition contacts across 1,800+ SaaS, fintech, and startup companies.',
      'Every entry includes the contact name, title, verified email, company, and industry, plus a "source" column so you always know where it came from. All emails were validated at time of export using deliverability checks.',
      'You get the full spreadsheet in Google Sheets (auto-refreshing) and CSV format, plus a short guide on how to write an outreach message that actually gets replied to.',
    ],
    price: 49,
    originalPrice: 79,
    category: 'contacts',
    badge: 'Bestseller',
    featured: true,
    includes: [
      '2,400+ verified HR & TA email contacts',
      'Google Sheets access (live-updated) + CSV export',
      'Contact name, title, company & industry columns',
      'Deliverability-validated at export',
      'Outreach message templates guide',
      'Free lifetime updates',
    ],
    rating: 4.9,
    reviewCount: 312,
    downloadType: 'Spreadsheet (Google Sheets + CSV)',
    updatedAt: 'Jul 2026',
  },
  {
    id: '2',
    slug: 'product-manager-interview-questions',
    title: '150 PM Interview Questions & Answers',
    tagline: 'Crack product management interviews',
    shortDescription:
      '150 real-world product manager questions across strategy, execution, and behavioral rounds, with frameworks and sample answers.',
    description: [
      'Product interviews test how you think, not what you memorized. This guide walks through 150 questions grouped by round — product sense, execution, product design, and behavioral — each with a framework to structure your answer.',
      'Every answer includes a fill-in-the-blank template, a strong example, and the "stumble points" that candidates hit. You will also get a one-week prep plan and a live mock-interview script.',
    ],
    price: 29,
    originalPrice: 45,
    category: 'interview',
    featured: true,
    includes: [
      '150 questions across 4 interview rounds',
      'Step-by-step answer frameworks',
      'Strong example answers for each',
      'Common mistakes to avoid',
      '1-week interview prep plan',
      'Mock interview script + scorecard',
    ],
    rating: 4.8,
    reviewCount: 187,
    downloadType: 'PDF (128 pages)',
    updatedAt: 'Jun 2026',
  },
  {
    id: '3',
    slug: 'hr-resume-ebook',
    title: 'The HR-Friendly Resume Blueprint',
    tagline: 'A resume template that passes ATS scans',
    shortDescription:
      'Learn to write a resume that clears applicant tracking systems and gets you to the top of the pile, with templates and before/after examples.',
    description: [
      'Most resumes are rejected by software before a human ever reads them. This ebook explains exactly how ATS parsers work and how to structure your resume so you pass every scan — while still reading beautifully to a hiring manager.',
      'You will find three downloadable templates, 12 rewritten before/after examples across roles, and a checklist you can run on your final draft in five minutes.',
    ],
    price: 19,
    category: 'ebook',
    includes: [
      'ATS algorithm explainer (simple terms)',
      '3 downloadable resume templates',
      '12 before/after real-world examples',
      'Keyword and action-verb playbook',
      '5-minute final checklist',
      'Cover letter quick-template bonus',
    ],
    rating: 4.7,
    reviewCount: 94,
    downloadType: 'PDF (76 pages)',
    updatedAt: 'May 2026',
  },
  {
    id: '4',
    slug: 'software-engineer-interview-set',
    title: 'Software Engineer Interview Question Set',
    tagline: 'Coding, system design & behavioral prep',
    shortDescription:
      'A structured set of 120 questions with worked solutions and system-design walkthroughs to prepare for FAANG-style loops.',
    description: [
      'A single, well-organized set covering the three pillars of modern software interviews: data structures & algorithms, system design, and behavioral/situational questions.',
      'Each coding problem includes hints, a brute-force to optimal solution path, and time/space complexity analysis. System design questions come with diagram walkthroughs you can adapt to any company.',
    ],
    price: 39,
    originalPrice: 59,
    category: 'interview',
    featured: true,
    includes: [
      '60 curated coding problems + solutions',
      '30 system design walkthroughs',
      '30 behavioral & situational questions',
      'Complexity analysis on every answer',
      'Study schedule (4-week track)',
      'Mock interview scoring rubric',
    ],
    rating: 4.9,
    reviewCount: 228,
    downloadType: 'PDF (210 pages)',
    updatedAt: 'Jul 2026',
  },
  {
    id: '5',
    slug: 'hr-contact-list-startups',
    title: 'HR Contacts for Early-Stage Startups',
    tagline: '620 startup HR contacts, seed to Series C',
    shortDescription:
      'A focused list of HR leaders at 620 fast-growing startups — the companies most likely to hire quickly and reply to candidates.',
    description: [
      'Startups hire faster, respond more often, and care more about a genuine personal note. This list targets 620 HR and People leaders at seed-to-Series-C startups, sourced and verified in the last quarter.',
      'It pairs perfectly with the full HR contact list when you want to prioritize high-movement companies first.',
    ],
    price: 29,
    category: 'contacts',
    includes: [
      '620 HR & People contacts at startups',
      'Seed to Series C company filter',
      'Verified emails + LinkedIn URLs',
      'Founding-team size & funding data',
      'Outreach sequence for startups',
      'Quarterly refresh included',
    ],
    rating: 4.6,
    reviewCount: 58,
    downloadType: 'Spreadsheet (Google Sheets + CSV)',
    updatedAt: 'Jun 2026',
  },
  {
    id: '6',
    slug: 'data-analyst-interview-questions',
    title: 'Data Analyst Interview Questions',
    tagline: 'SQL, stats & case studies with solutions',
    shortDescription:
      '100 data analyst interview questions with SQL exercises, statistics refreshers, and full case-study breakdowns.',
    description: [
      'Data analyst interviews mix SQL drills, statistics questions, and open-ended case studies. This set covers all three, with 40 SQL exercises you can run, a statistics cheat sheet, and five fully worked case studies.',
    ],
    price: 24,
    category: 'interview',
    includes: [
      '40 practical SQL exercises',
      '30 statistics & probability questions',
      '5 fully worked case studies',
      'Statistics cheat sheet',
      'A/B testing primer',
      'Dashboard-portfolio guide',
    ],
    rating: 4.7,
    reviewCount: 76,
    downloadType: 'PDF (98 pages)',
    updatedAt: 'Apr 2026',
  },
  {
    id: '7',
    slug: 'career-strategy-sprint',
    title: 'Career Strategy Sprint',
    tagline: '30-minute focused call on targets, gaps & next steps',
    shortDescription:
      'A structured 30-minute call to sharpen your job target, spot the biggest gaps in your search, and leave with a prioritized 30-day plan.',
    description: [
      'A 30-minute, agenda-driven call where we take your current situation and turn it into a clear plan. Expect honest feedback on your resume, target roles, and which channels will actually get you replies.',
      'You will receive a short written recap with your personalized next steps and a 30-day action checklist you can start on the same day.',
    ],
    price: 79,
    category: 'consultancy',
    badge: 'New',
    duration: '30 min call',
    slotsLeft: 4,
    includes: [
      '30-minute 1-on-1 video call',
      'Pre-call questionnaire to prep your context',
      'Honest review of your current approach',
      'Personalized 30-day action plan',
      'Written recap + checklist after the call',
    ],
    rating: 5.0,
    reviewCount: 23,
    downloadType: '1-on-1 video call',
    updatedAt: 'Jul 2026',
  },
  {
    id: '8',
    slug: 'resume-linkedin-deep-review',
    title: 'Resume & LinkedIn Deep Review',
    tagline: '45-minute screen-share review with line-by-line notes',
    shortDescription:
      'A 45-minute walkthrough of your resume and LinkedIn profile with recruiters-eye feedback and a rewritten summary line.',
    description: [
      'We review your resume and LinkedIn profile on a live screen share, so you see exactly what a recruiter scans for — and what they skip. I flag ATS problems, weak bullets, and missing keywords in real time.',
      'You leave the call with your summary line rewritten, your bullet structure fixed, and a written list of concrete edits for the rest of the document.',
    ],
    price: 99,
    category: 'consultancy',
    badge: 'New',
    duration: '45 min call',
    slotsLeft: 2,
    includes: [
      '45-minute live screen-share review',
      'Resume + LinkedIn dual pass',
      'ATS and keyword audit',
      'Rewritten professional summary line',
      'Line-by-line written edit notes',
    ],
    rating: 4.9,
    reviewCount: 41,
    downloadType: '1-on-1 video call',
    updatedAt: 'Jul 2026',
  },
  {
    id: '9',
    slug: 'mock-interview-and-feedback',
    title: 'Mock Interview + Feedback',
    tagline: '60-minute mock interview with recruiter-grade feedback',
    shortDescription:
      'A realistic 60-minute mock interview for your target role, followed by a scored breakdown of where you shined and where you need work.',
    description: [
      'A full-length mock interview run like the real thing — structured questions, follow-ups, and no mercy. Choose your track: product, engineering, data, or general behavioral.',
      'Afterward, we score each answer on a rubric and you get a written feedback sheet plus a prioritized list of the two or three things to fix before the real interview.',
    ],
    price: 129,
    category: 'consultancy',
    badge: 'Bestseller',
    featured: true,
    duration: '60 min call',
    slotsLeft: 3,
    includes: [
      '60-minute realistic mock interview',
      'Your choice of role track',
      'Scored answer rubric',
      'Written feedback sheet',
      'Prioritized improvement list',
    ],
    rating: 4.9,
    reviewCount: 87,
    downloadType: '1-on-1 video call',
    updatedAt: 'Jul 2026',
  },
  {
    id: '10',
    slug: 'ats-resume-template-pack',
    title: 'ATS Resume Template Pack',
    tagline: '5 field-tested templates that pass the scanners',
    shortDescription:
      'Five clean, ATS-safe resume templates in Word and PDF, built on the exact structure that gets through applicant tracking systems.',
    description: [
      'A set of five resume templates designed around how ATS parsers actually read documents: single-column layouts, standard section headers, and clean tables-free formatting.',
      'Each template comes in editable Word and PDF formats, with placeholder content and a one-page guide on customizing it for your role in under twenty minutes.',
    ],
    price: 15,
    category: 'resume',
    badge: 'New',
    includes: [
      '5 ATS-safe resume templates',
      'Word + PDF formats for each',
      'Editable placeholder content',
      '20-minute customization guide',
      'ATS checklist per template',
    ],
    rating: 4.6,
    reviewCount: 33,
    downloadType: 'Templates (Word + PDF)',
    updatedAt: 'Jun 2026',
  },
  {
    id: '11',
    slug: 'resume-cover-letter-combo',
    title: 'Resume & Cover Letter Combo Guide',
    tagline: 'Resume framework + cover letter formulas in one bundle',
    shortDescription:
      'The resume framework and cover letter formulas together — build a complete, consistent application package from one bundle.',
    description: [
      'This bundle pairs the resume blueprint with a cover letter formula section, so your application reads as one coherent story rather than two documents that were written separately.',
      'It includes three resume structures, four cover letter templates for different situations (cold apply, referral, career change), and a fill-in-the-blank worksheet for each.',
    ],
    price: 22,
    originalPrice: 29,
    category: 'resume',
    includes: [
      '3 resume structures + examples',
      '4 cover letter templates',
      'Cold apply / referral / career-change variants',
      'Fill-in-the-blank worksheets',
      'Quick consistency checklist',
    ],
    rating: 4.7,
    reviewCount: 52,
    downloadType: 'PDF (64 pages)',
    updatedAt: 'May 2026',
  },
  {
    id: '12',
    slug: 'referral-connection-saas',
    title: 'Referral Connection — SaaS Companies',
    tagline: 'Warm intro to a hiring manager at a SaaS company',
    shortDescription:
      'A paid referral connection: we make a warm, personalized introduction to a hiring manager at a SaaS company matching your background.',
    description: [
      'A warm referral is the highest-converting application channel that exists. We match your profile against our network of SaaS hiring managers and send a personalized introduction on your behalf.',
      'You receive the connection, a short brief on the company and role, and the outreach message we sent — so you can follow up with the right context. Delivery within 5 business days.',
    ],
    price: 99,
    category: 'referral',
    badge: 'New',
    includes: [
      'Profile match against SaaS hiring managers',
      'Personalized warm introduction',
      'Company + role brief',
      'Copy of the outreach message',
      'Delivery within 5 business days',
    ],
    rating: 4.8,
    reviewCount: 19,
    downloadType: 'Referral connection',
    updatedAt: 'Jul 2026',
  },
  {
    id: '13',
    slug: 'referral-intro-product-roles',
    title: 'Referral Intro — Product Roles',
    tagline: 'Referred introduction for product manager roles',
    shortDescription:
      'A referred introduction to a product leader for PM roles, with a customized pitch and follow-up support for your application.',
    description: [
      'Product roles are among the hardest to get without an internal advocate. This referral service connects you to a product leader at a company that is actively hiring for your level and background.',
      'We craft the introduction around your specific experience, send it on your behalf, and include a one-week follow-up — plus a short how-to-respond guide so you make the most of the intro.',
    ],
    price: 119,
    originalPrice: 149,
    category: 'referral',
    badge: 'New',
    featured: true,
    includes: [
      'Match against active PM roles',
      'Customized referral pitch',
      'Warm introduction to a product leader',
      'One-week automated follow-up',
      'How-to-respond guide',
    ],
    rating: 4.9,
    reviewCount: 27,
    downloadType: 'Referral connection',
    updatedAt: 'Jul 2026',
  },
  {
    id: '14',
    slug: 'cheat-sheets-bundle',
    title: 'Interview & Resume Cheat Sheets',
    tagline: 'One-page quick-reference sheets for last-minute prep',
    shortDescription:
      'Condensed one-pagers covering resume keywords, STAR answers, SQL, statistics, and system design — everything you need in 30 seconds.',
    description: [
      'Sometimes you do not need a 200-page guide — you need the right answer in 30 seconds. These cheat sheets condense the highest-yield material into five scannable one-pagers.',
      'You get a resume keyword cheat sheet, a behavioral STAR answer map, a SQL command reference, a statistics glossary, and a system-design checklist.',
    ],
    price: 12,
    category: 'cheatsheet',
    badge: 'New',
    includes: [
      '5 one-page cheat sheets (PDF)',
      'Resume keyword + STAR answer map',
      'SQL command quick reference',
      'Statistics glossary',
      'System-design checklist',
    ],
    rating: 4.7,
    reviewCount: 41,
    downloadType: 'PDF (5 pages)',
    updatedAt: 'Jul 2026',
  },
  {
    id: 'svc-1',
    slug: 'normal-project',
    title: 'Normal Project',
    tagline: 'Starting from ₹3,000 + documentation',
    shortDescription: 'A focused single-purpose project with full documentation and setup support.',
    description: [
      'A focused project tailored to your requirements, delivered with complete documentation.',
      'Includes source code, setup guide, and post-delivery support.',
    ],
    price: 3000,
    category: 'service',
    badge: 'New',
    featured: true,
    includes: ['Source code', 'Documentation', 'Setup support'],
    rating: 5,
    reviewCount: 0,
    downloadType: 'Project delivery',
    updatedAt: 'Oct 2026',
    serviceType: 'Normal Project',
    features: ['Custom scope', 'Clean codebase', 'Documentation included'],
    techStack: ['React', 'Node.js', 'Tailwind'],
    deliverables: ['Source code', 'SRS', 'Setup guide', 'User manual'],
    whatsIncluded: ['Source code', 'Documentation', 'Setup support'],
    deliveryTime: '1-2 weeks',
    documentation: ['SRS', 'ER diagram', 'API docs', 'Setup guide', 'User manual', 'PPT'],
    pricingNote: 'Starting from ₹3,000',
  },
  {
    id: 'svc-2',
    slug: 'frontend-backend-project',
    title: 'Frontend + Backend Project',
    tagline: 'Starting from ₹8,000 + documentation',
    shortDescription: 'Full-stack project with frontend and backend, fully documented.',
    description: ['Complete full-stack application with frontend and backend, delivered with documentation.'],
    price: 8000,
    category: 'service',
    badge: 'New',
    featured: true,
    includes: ['Source code', 'Documentation', 'Setup support'],
    rating: 5,
    reviewCount: 0,
    downloadType: 'Project delivery',
    updatedAt: 'Oct 2026',
    serviceType: 'Frontend + Backend',
    features: ['Full-stack', 'API integration', 'Documentation included'],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    deliverables: ['Source code', 'SRS', 'API docs', 'Setup guide'],
    whatsIncluded: ['Source code', 'Documentation', 'Setup support'],
    deliveryTime: '2-4 weeks',
    documentation: ['SRS', 'ER diagram', 'API docs', 'Setup guide', 'User manual', 'PPT'],
    pricingNote: 'Starting from ₹8,000',
  },
  {
    id: 'svc-3',
    slug: 'big-custom-project',
    title: 'Big / Custom Project',
    tagline: 'Contact for quote',
    shortDescription: 'Large or custom project scoped to your needs. Price set after consultation.',
    description: ['Custom large-scale project. Contact for a quote tailored to your requirements.'],
    price: 0,
    category: 'service',
    badge: 'Custom',
    includes: ['Source code', 'Documentation', 'Setup support'],
    rating: 5,
    reviewCount: 0,
    downloadType: 'Project delivery',
    updatedAt: 'Oct 2026',
    serviceType: 'Big / Custom',
    features: ['Custom scope', 'Dedicated support'],
    techStack: ['Custom'],
    deliverables: ['Source code', 'Documentation'],
    whatsIncluded: ['Source code', 'Documentation', 'Setup support'],
    deliveryTime: 'As agreed',
    documentation: ['SRS', 'ER diagram', 'API docs', 'Setup guide', 'User manual', 'PPT'],
    pricingNote: 'Contact for quote',
  },
  {
    id: 'svc-4',
    slug: 'ui-ux-design',
    title: 'UI/UX Design for Application',
    tagline: '₹2,000',
    shortDescription: 'Professional UI/UX design for your application.',
    description: ['Complete UI/UX design deliverables for your app.'],
    price: 2000,
    category: 'service',
    badge: 'New',
    includes: ['Design files', 'Documentation'],
    rating: 5,
    reviewCount: 0,
    downloadType: 'Design delivery',
    updatedAt: 'Oct 2026',
    serviceType: 'UI/UX Design',
    features: ['Wireframes', 'High-fidelity designs', 'Design system'],
    techStack: ['Figma'],
    deliverables: ['Design files', 'Style guide'],
    whatsIncluded: ['Design files', 'Documentation'],
    deliveryTime: '1 week',
    documentation: ['Design spec', 'Style guide'],
    pricingNote: '₹2,000',
  },
  {
    id: 'svc-5',
    slug: 'flutter-mobile-app',
    title: 'Flutter Mobile App',
    tagline: 'Starting from ₹6,000 + documentation',
    shortDescription: 'Cross-platform mobile app built with Flutter, with documentation.',
    description: ['Flutter mobile application delivered with full documentation.'],
    price: 6000,
    category: 'service',
    badge: 'New',
    includes: ['Source code', 'Documentation', 'Setup support'],
    rating: 5,
    reviewCount: 0,
    downloadType: 'App delivery',
    updatedAt: 'Oct 2026',
    serviceType: 'Flutter Mobile App',
    features: ['Cross-platform', 'Documentation included'],
    techStack: ['Flutter', 'Dart'],
    deliverables: ['Source code', 'APK', 'Documentation'],
    whatsIncluded: ['Source code', 'Documentation', 'Setup support'],
    deliveryTime: '2-3 weeks',
    documentation: ['SRS', 'Setup guide', 'User manual'],
    pricingNote: 'Starting from ₹6,000',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ebook: 'Digital Ebooks',
  contacts: 'HR Contact Lists',
  interview: 'Interview Question Sets',
  consultancy: 'Consultancy',
  resume: 'Resume Guides',
  cheatsheet: 'Cheat Sheets',
  referral: 'Reference / Referrals',
  service: 'Projects & Services',
}

export const isBookable = (product: Product): boolean =>
  product.category === 'consultancy' || product.category === 'referral'

const VALID_CATEGORIES: readonly ProductCategory[] = [
  'ebook',
  'contacts',
  'interview',
  'consultancy',
  'resume',
  'cheatsheet',
  'referral',
]

const CATEGORY_ALIASES: Record<string, ProductCategory> = {
  ebook: 'ebook',
  contacts: 'contacts',
  interview: 'interview',
  consultancy: 'consultancy',
  resume: 'resume',
  cheatsheet: 'cheatsheet',
  referral: 'referral',
  'hr-contacts': 'contacts',
  'hr_contacts': 'contacts',
  'hr contacts': 'contacts',
  'hr contact list': 'contacts',
  'hr contact lists': 'contacts',
  'contact list': 'contacts',
  'contact lists': 'contacts',
  contactlist: 'contacts',
  'interview-questions': 'interview',
  'interview_questions': 'interview',
  'interview questions': 'interview',
  'interview question set': 'interview',
  'interview question sets': 'interview',
  'interview-question-sets': 'interview',
  'question set': 'interview',
  'question sets': 'interview',
  ebooks: 'ebook',
  'digital ebook': 'ebook',
  'digital ebooks': 'ebook',
  'digital-ebook': 'ebook',
  'digital-ebooks': 'ebook',
  'digital_ebook': 'ebook',
  consulting: 'consultancy',
  consultation: 'consultancy',
  'consultancy calls': 'consultancy',
  'career calls': 'consultancy',
  calls: 'consultancy',
  resumes: 'resume',
  'resume guide': 'resume',
  'resume guides': 'resume',
  'resume-guide': 'resume',
  'resume-guides': 'resume',
  'resume_guides': 'resume',
  'resume template': 'resume',
  'resume templates': 'resume',
  'resume-template': 'resume',
  'resume-templates': 'resume',
  cv: 'resume',
  'cover letter': 'resume',
  cheatsheets: 'cheatsheet',
  'cheat sheet': 'cheatsheet',
  'cheat sheets': 'cheatsheet',
  'cheat-sheet': 'cheatsheet',
  'cheat-sheets': 'cheatsheet',
  'cheat_sheet': 'cheatsheet',
  'cheat_sheets': 'cheatsheet',
  referrals: 'referral',
  reference: 'referral',
  references: 'referral',
  'reference / referrals': 'referral',
  'reference-referrals': 'referral',
  'referral connection': 'referral',
}

export function parseCategories(
  value: string | string[] | null | undefined,
): ProductCategory[] {
  const parts = Array.isArray(value)
    ? value
    : (value ?? '')
        .replace(/[[]{}]/g, '')
        .replaceAll('"', '')
        .split(',')
  return parts
    .map((part) => part.trim().toLowerCase())
    .map((part) => CATEGORY_ALIASES[part] ?? part)
    .filter((part): part is ProductCategory =>
      (VALID_CATEGORIES as readonly string[]).includes(part),
    )
}

export function normalizeCategory(
  value: string | null | undefined,
): ProductCategory | 'all' {
  const raw = (value ?? '').trim().toLowerCase()
  const normalized = CATEGORY_ALIASES[raw] ?? raw
  return (VALID_CATEGORIES as readonly string[]).includes(normalized)
    ? (normalized as ProductCategory)
    : 'all'
}

function formatUpdatedAt(createdAt: string): string {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

export function productFromRow(row: ProductRow): Product {
  const description = row.description || row.title
  const categories = parseCategories(row.categories)
  return {
    id: String(row.id),
    slug: String(row.id),
    title: row.title,
    tagline: '',
    shortDescription: description,
    description: [description],
    price: Number(row.price) || 0,
    category: categories[0] ?? 'ebook',
    includes: [],
    rating: 5,
    reviewCount: 0,
    downloadType: 'Instant download',
    updatedAt: formatUpdatedAt(row.created_at),
    'pdf-url': row['pdf-url'],
  }
}
