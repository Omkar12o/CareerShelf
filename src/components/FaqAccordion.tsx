import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FaqEntry = {
  question: string
  answer: string
}

const DEFAULT_FAQS: FaqEntry[] = [
  {
    question: 'Do I get the source code with every project?',
    answer:
      'Yes. Every ready-made project ships with the complete source code — clean, commented, and runnable. You also get the presentation, documentation, setup guide, and viva questions for the ones marked with viva support.',
  },
  {
    question: 'What documents are included for college submission?',
    answer:
      'Each project kit includes an abstract, SRS, ER and sequence diagrams, test cases, a user manual, the PPT for your review presentation, and a step-by-step setup guide.',
  },
  {
    question: 'How do I receive the files after payment?',
    answer:
      'Payment is verified automatically through the gateway webhook. As soon as the order is marked paid, the download link appears on your dashboard and is also emailed to you.',
  },
  {
    question: 'Can I get a project built for my exact topic?',
    answer:
      'Yes. Use the Request a Project form with your topic, tech stack, deadline, and budget. You will get a plan, timeline, and fixed price before any work starts — you only pay once the scope is agreed.',
  },
  {
    question: 'What if the project does not match my requirement?',
    answer:
      'Ready-made kits are covered by a 30-day refund policy. Custom projects are scoped and approved by you before development begins, so expectations are fixed up front.',
  },
  {
    question: 'Do you help with interview preparation and referrals?',
    answer:
      'Yes. The Interview Prep section covers technical and HR question banks, and the Careers section covers referrals, HR contacts, and internship leads for final-year students and passouts.',
  },
]

type FaqAccordionProps = {
  items?: FaqEntry[]
  title?: string
  subtitle?: string
  className?: string
}

export function FaqAccordion({
  items = DEFAULT_FAQS,
  title = 'Frequently asked questions',
  subtitle,
  className = '',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-xl text-center text-base leading-relaxed text-gray-500">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-10 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`

            return (
              <div key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none sm:px-6"
                  >
                    <span className="text-base font-semibold text-gray-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 text-sm leading-relaxed text-gray-600 sm:px-6"
                >
                  {item.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
