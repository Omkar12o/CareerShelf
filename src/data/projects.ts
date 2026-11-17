export type ProjectYear =
  | '1st-year'
  | '2nd-year'
  | '3rd-year'
  | 'final-year'
  | 'passout'

export type ProjectLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type StudentProject = {
  slug: string
  title: string
  tagline: string
  year: ProjectYear
  domain: string
  tech: string[]
  level: ProjectLevel
  summary: string
  problem: string
  features: string[]
  deliverables: string[]
  price: number
  originalPrice?: number
  duration: string
  featured?: boolean
}

export const YEAR_LABELS: Record<ProjectYear, string> = {
  '1st-year': '1st Year',
  '2nd-year': '2nd Year',
  '3rd-year': '3rd Year',
  'final-year': 'Final Year',
  passout: 'Passout',
}

export const YEAR_ORDER: ProjectYear[] = [
  '1st-year',
  '2nd-year',
  '3rd-year',
  'final-year',
  'passout',
]

export function isProjectYear(value: string | null): value is ProjectYear {
  return value !== null && (YEAR_ORDER as string[]).includes(value)
}

export const PROJECTS: StudentProject[] = [
  {
    slug: 'college-result-management-system',
    title: 'College Result Management System',
    tagline: 'Marks entry, grade calculation, and printable marksheets',
    year: '3rd-year',
    domain: 'Web · Java',
    tech: ['Java', 'Spring Boot', 'MySQL', 'HTML/CSS'],
    level: 'Intermediate',
    summary:
      'A role-based system where faculty enter internal and external marks, grades are computed automatically, and students download a formatted marksheet.',
    problem:
      'Most colleges still consolidate results in spreadsheets, which causes duplicate entries and manual grade errors at the end of every semester.',
    features: [
      'Admin, faculty, and student logins with separate dashboards',
      'Subject-wise marks entry with validation rules',
      'Automatic SGPA / CGPA and grade calculation',
      'Printable PDF marksheet per semester',
      'Bulk marks import from CSV',
      'Audit log for every marks change',
    ],
    deliverables: [
      'Complete Spring Boot + MySQL source code',
      'ER diagram and normalized schema',
      'SRS document',
      'Setup guide for local run',
      'PPT for review presentation',
      'Viva questions with answers',
    ],
    price: 1499,
    originalPrice: 1999,
    duration: '3–4 days delivery',
    featured: true,
  },
  {
    slug: 'library-management-system',
    title: 'Library Management System',
    tagline: 'Issue, return, fines, and inventory in one dashboard',
    year: '2nd-year',
    domain: 'Web · Python',
    tech: ['Python', 'Django', 'SQLite', 'Bootstrap'],
    level: 'Beginner',
    summary:
      'A complete library workflow: catalogue books, issue them to students, calculate overdue fines, and track stock without a single spreadsheet.',
    problem:
      'Small college libraries track issues in registers, so lost books and unpaid fines are discovered months later.',
    features: [
      'Book catalogue with ISBN and copy counts',
      'Issue and return with due-date tracking',
      'Automatic fine calculation for late returns',
      'Member management with borrowing limits',
      'Search by title, author, or category',
      'Monthly circulation report export',
    ],
    deliverables: [
      'Django project source code',
      'SQLite database with sample records',
      'ER diagram and data dictionary',
      'Project report and abstract',
      'Setup and run instructions',
    ],
    price: 899,
    originalPrice: 1199,
    duration: '2–3 days delivery',
  },
  {
    slug: 'personal-portfolio-cms',
    title: 'Personal Portfolio with Admin CMS',
    tagline: 'A portfolio you can update without touching code',
    year: '1st-year',
    domain: 'Web · Frontend',
    tech: ['React', 'Vite', 'Tailwind CSS', 'LocalStorage'],
    level: 'Beginner',
    summary:
      'A modern personal portfolio with an admin panel to add projects, skills, and certificates — perfect for a first-year submission or internship application.',
    problem:
      'Students rebuild their portfolio every semester instead of updating content in one place.',
    features: [
      'Hero, about, skills, projects, and contact sections',
      'Admin panel to add or edit projects',
      'Responsive layout on mobile, tablet, and desktop',
      'Light and dark theme toggle',
      'Smooth scroll and reveal animations',
      'Contact form with validation',
    ],
    deliverables: [
      'React source code with clean components',
      'Editable content schema',
      'Deployment guide (Vercel / Netlify)',
      'Project report',
      'PPT with screenshots',
    ],
    price: 599,
    duration: '1–2 days delivery',
    featured: true,
  },
  {
    slug: 'ai-resume-screening',
    title: 'AI Resume Screening & Ranking',
    tagline: 'Rank candidate resumes against a job description',
    year: 'final-year',
    domain: 'AI/ML',
    tech: ['Python', 'Flask', 'scikit-learn', 'NLTK', 'Pandas'],
    level: 'Advanced',
    summary:
      'Upload a job description and a batch of resumes; the system extracts skills, scores relevance, and returns a ranked shortlist with reasons.',
    problem:
      'Recruiters manually scan hundreds of resumes, wasting hours and missing qualified candidates.',
    features: [
      'Resume parsing for PDF and DOCX',
      'Skill and keyword extraction with NLP',
      'TF-IDF + cosine similarity ranking',
      'Match score with matched and missing skills',
      'Batch upload with a ranked results table',
      'Export shortlist to CSV',
    ],
    deliverables: [
      'Flask application source code',
      'Trained model and preprocessing pipeline',
      'Sample resume dataset',
      'SRS and architecture diagrams',
      'Research-style report and PPT',
      'Viva Q&A',
    ],
    price: 3499,
    originalPrice: 4499,
    duration: '5–7 days delivery',
    featured: true,
  },
  {
    slug: 'mern-ecommerce-store',
    title: 'E-Commerce Store on MERN',
    tagline: 'Catalogue, cart, orders, and admin dashboard',
    year: 'final-year',
    domain: 'Web · Full stack',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    level: 'Advanced',
    summary:
      'A production-shaped storefront with product management, cart, checkout, order tracking, and a full admin panel — the classic final-year full-stack build.',
    problem:
      'Most MERN submissions stop at a product grid and never implement real order lifecycles or admin control.',
    features: [
      'Product catalogue with search, filter, and pagination',
      'Cart and checkout with address management',
      'JWT authentication with role-based access',
      'Order lifecycle: placed, packed, shipped, delivered',
      'Admin dashboard for products, orders, and users',
      'Sales analytics summary',
    ],
    deliverables: [
      'Full MERN source code (client + server)',
      'REST API documentation',
      'MongoDB schema design and ER diagram',
      'SRS, test cases, and user manual',
      'Deployment guide',
      'PPT and viva Q&A',
    ],
    price: 3999,
    originalPrice: 4999,
    duration: '6–8 days delivery',
    featured: true,
  },
  {
    slug: 'face-recognition-attendance',
    title: 'Face Recognition Attendance System',
    tagline: 'Mark attendance automatically from a webcam',
    year: 'final-year',
    domain: 'AI · Computer vision',
    tech: ['Python', 'OpenCV', 'face_recognition', 'Tkinter', 'MySQL'],
    level: 'Advanced',
    summary:
      'A desktop application that recognises enrolled students from a live camera feed and logs attendance with timestamps into a database.',
    problem:
      'Manual roll calls waste class time and proxy attendance is easy.',
    features: [
      'Student enrollment with multiple face samples',
      'Live webcam recognition under 2 seconds',
      'Automatic timestamped attendance logging',
      'Duplicate-marking prevention per session',
      'Defaulter report by attendance percentage',
      'CSV export for each subject',
    ],
    deliverables: [
      'Python source code with trained encodings',
      'Database schema and sample data',
      'Installation guide for camera setup',
      'Project report and PPT',
      'Viva Q&A focused on OpenCV and encodings',
    ],
    price: 2999,
    duration: '4–6 days delivery',
  },
  {
    slug: 'hospital-management-system',
    title: 'Hospital Management System',
    tagline: 'Appointments, patients, billing, and pharmacy',
    year: '3rd-year',
    domain: 'Web · Java',
    tech: ['Java', 'JSP', 'Servlets', 'MySQL', 'Bootstrap'],
    level: 'Intermediate',
    summary:
      'A multi-role hospital system covering reception, doctors, pharmacy stock, and billing — a reliable classic for university submission.',
    problem:
      'Hospitals run appointments on paper while pharmacy stock and billing live in separate systems.',
    features: [
      'Reception, doctor, and admin role dashboards',
      'Appointment booking with slot availability',
      'Patient history and prescriptions',
      'Pharmacy inventory with low-stock alerts',
      'Invoice generation with payment status',
      'Daily and monthly reports',
    ],
    deliverables: [
      'JSP/Servlet source code',
      'MySQL schema with seed data',
      'ER diagram and DFDs',
      'SRS and user manual',
      'Setup guide and PPT',
    ],
    price: 1799,
    originalPrice: 2299,
    duration: '3–5 days delivery',
  },
  {
    slug: 'fake-news-detection',
    title: 'Fake News Detection with ML',
    tagline: 'Classify news articles as real or misleading',
    year: 'final-year',
    domain: 'AI/ML · NLP',
    tech: ['Python', 'scikit-learn', 'Pandas', 'Streamlit', 'TF-IDF'],
    level: 'Intermediate',
    summary:
      'Train and compare classifiers on a labelled news dataset, then expose the best model through a simple web interface with confidence scores.',
    problem:
      'Misinformation spreads faster than manual fact-checking can keep up.',
    features: [
      'Text cleaning, stopword removal, and stemming',
      'TF-IDF feature extraction',
      'Naive Bayes, Logistic Regression, and SVM comparison',
      'Confusion matrix and accuracy report',
      'Streamlit UI for live prediction',
      'Confidence score with top contributing terms',
    ],
    deliverables: [
      'Jupyter notebooks for training and evaluation',
      'Streamlit app source code',
      'Cleaned dataset and model files',
      'Research report with accuracy comparison',
      'PPT and viva Q&A',
    ],
    price: 2499,
    duration: '4–5 days delivery',
  },
  {
    slug: 'expense-tracker-flutter',
    title: 'Expense Tracker Mobile App',
    tagline: 'Track spending offline with charts and budgets',
    year: '2nd-year',
    domain: 'Mobile',
    tech: ['Flutter', 'Dart', 'Firebase', 'fl_chart'],
    level: 'Intermediate',
    summary:
      'A cross-platform mobile app for logging expenses, setting monthly budgets, and visualising category-wise spending.',
    problem:
      'Students overspend because they have no quick way to see where money actually goes.',
    features: [
      'Add, edit, and delete expense entries',
      'Category-wise monthly budget limits',
      'Pie and bar charts for spending trends',
      'Offline-first storage with Firebase sync',
      'Login with email and password',
      'Monthly PDF summary export',
    ],
    deliverables: [
      'Flutter source code',
      'Firebase project setup guide',
      'APK build for demonstration',
      'Project report and UI screenshots',
      'PPT and setup instructions',
    ],
    price: 1899,
    duration: '3–4 days delivery',
  },
  {
    slug: 'crop-recommendation-system',
    title: 'Crop Recommendation System',
    tagline: 'Suggest the best crop from soil and weather data',
    year: 'final-year',
    domain: 'AI/ML · Agriculture',
    tech: ['Python', 'Flask', 'scikit-learn', 'Pandas', 'Chart.js'],
    level: 'Intermediate',
    summary:
      'A decision-support tool that takes soil nutrients and climate values and recommends the most suitable crop with expected yield notes.',
    problem:
      'Farmers pick crops by habit rather than soil data, which lowers yield and wastes fertiliser.',
    features: [
      'Random Forest model trained on soil and climate data',
      'Input form for N, P, K, pH, rainfall, and temperature',
      'Top-three crop recommendations with confidence',
      'Fertiliser suggestion per recommendation',
      'Historical accuracy and feature-importance charts',
      'Responsive Flask web interface',
    ],
    deliverables: [
      'Flask application and trained model',
      'Dataset with preprocessing notebook',
      'Project report with model evaluation',
      'ER diagram and architecture',
      'PPT and viva Q&A',
    ],
    price: 2799,
    duration: '4–5 days delivery',
  },
  {
    slug: 'college-enquiry-chatbot',
    title: 'College Enquiry Chatbot',
    tagline: 'Answers admission and course questions 24×7',
    year: '3rd-year',
    domain: 'AI · NLP',
    tech: ['Python', 'NLTK', 'Flask', 'JSON intents', 'HTML/CSS'],
    level: 'Intermediate',
    summary:
      'A chatbot that answers the questions admission offices keep repeating — fees, eligibility, deadlines, hostel, and placements.',
    problem:
      'Admission desks answer the same twenty questions all day and still miss enquiries after office hours.',
    features: [
      'Intent-based natural language matching',
      'Course, fee, eligibility, and hostel knowledge base',
      'Fallback handling for unknown questions',
      'Admin editor for the FAQ knowledge base',
      'Conversation logging for review',
      'Embeddable chat widget',
    ],
    deliverables: [
      'Flask + NLTK source code',
      'Intent and response JSON dataset',
      'Knowledge base admin guide',
      'Project report and architecture diagram',
      'PPT and viva Q&A',
    ],
    price: 1999,
    duration: '3–4 days delivery',
  },
  {
    slug: 'weather-dashboard-react',
    title: 'Weather Dashboard (React)',
    tagline: 'Live forecasts with charts and city search',
    year: '1st-year',
    domain: 'Web · Frontend',
    tech: ['React', 'OpenWeather API', 'Tailwind CSS', 'Recharts'],
    level: 'Beginner',
    summary:
      'A fast, responsive weather dashboard that pulls live data from a public API and visualises the next five days.',
    problem:
      'A first-year project that proves you can consume APIs, handle loading and error states, and build reusable components.',
    features: [
      'City search with debounced API calls',
      'Current conditions and five-day forecast',
      'Temperature and humidity charts',
      'Geolocation-based default city',
      'Loading skeletons and error handling',
      'Fully responsive layout',
    ],
    deliverables: [
      'React source code',
      'API key setup instructions',
      'Component architecture notes',
      'Project report',
      'PPT with screenshots',
    ],
    price: 499,
    duration: '1–2 days delivery',
  },
  {
    slug: 'inventory-billing-system',
    title: 'Inventory & Billing System',
    tagline: 'Stock control, GST invoices, and low-stock alerts',
    year: '3rd-year',
    domain: 'Web · Full stack',
    tech: ['Node.js', 'Express', 'React', 'PostgreSQL', 'PDFKit'],
    level: 'Advanced',
    summary:
      'A small-business inventory system with GST-ready invoicing, purchase entries, and reorder alerts — a strong resume project beyond CRUD.',
    problem:
      'Small shops lose money on stock-outs and billing mistakes because everything is tracked in one notebook.',
    features: [
      'Product, supplier, and customer master data',
      'Purchase entry that updates stock automatically',
      'GST invoice generation with PDF download',
      'Low-stock and expiry alerts',
      'Sales and profit reports by period',
      'Role-based access for owner and staff',
    ],
    deliverables: [
      'Full-stack source code',
      'PostgreSQL schema and migrations',
      'API documentation',
      'SRS, ER diagram, and test cases',
      'PPT and viva Q&A',
    ],
    price: 3299,
    originalPrice: 3999,
    duration: '5–6 days delivery',
  },
  {
    slug: 'interview-prep-tracker',
    title: 'Interview Prep Tracker',
    tagline: 'DSA progress, mock scores, and revision reminders',
    year: 'passout',
    domain: 'Web · Product',
    tech: ['React', 'Supabase', 'Tailwind CSS', 'Recharts'],
    level: 'Intermediate',
    summary:
      'A personal preparation dashboard that tracks solved problems by topic, mock interview scores, and what to revise next.',
    problem:
      'Freshers study randomly and cannot tell which topics are actually weak before an interview.',
    features: [
      'Problem log by topic and difficulty',
      'Spaced-repetition revision queue',
      'Mock interview score tracking',
      'Weekly progress charts',
      'Company-wise application pipeline',
      'Row-level security so each user sees only their data',
    ],
    deliverables: [
      'React + Supabase source code',
      'Database schema and RLS policies',
      'Dashboard screenshots',
      'Project report',
      'Setup and deployment guide',
    ],
    price: 2299,
    duration: '4–5 days delivery',
    featured: true,
  },
]

export function getProjectBySlug(slug: string): StudentProject | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

export function projectCountByYear(year: ProjectYear): number {
  return PROJECTS.filter((project) => project.year === year).length
}
