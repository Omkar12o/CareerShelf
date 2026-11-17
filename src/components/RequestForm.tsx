import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  CircleAlert,
  CircleCheckBig,
  LoaderCircle,
  MessageCircle,
  Send,
} from 'lucide-react'
import { supabase } from '../supabaseClient'
import {
  BUDGET_OPTIONS,
  COURSE_OPTIONS,
  EMPTY_REQUEST,
  NEED_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  YEAR_OPTIONS,
  toProjectRequestPayload,
  validateProjectRequest,
  type ProjectRequestInput,
  type RequestFieldErrors,
} from '../data/projectRequests'

const WHATSAPP_URL =
  'https://wa.me/919209315645?text=' +
  encodeURIComponent(
    "Hi, I just submitted a project request on CareerShelf and I'd like to discuss it.",
  )

type RequestFormProps = {
  initialValues?: Partial<ProjectRequestInput>
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; name: string }
  | { status: 'error'; message: string }

function friendlyError(message: string, code?: string): string {
  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    /relation .*project_requests.* does not exist/i.test(message) ||
    /could not find the table .*project_requests/i.test(message)
  ) {
    return 'The request inbox is not set up yet. Run the project_requests SQL in Supabase, then submit again.'
  }
  if (/row-level security|permission denied/i.test(message)) {
    return 'The request could not be saved because of a permissions policy. Please contact us on WhatsApp instead.'
  }
  return message
}

export function RequestForm({ initialValues }: RequestFormProps) {
  const formId = useId()
  const [values, setValues] = useState<ProjectRequestInput>({
    ...EMPTY_REQUEST,
    ...initialValues,
    needs: initialValues?.needs ?? [],
  })
  const [errors, setErrors] = useState<RequestFieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  const update = <K extends keyof ProjectRequestInput>(
    key: K,
    value: ProjectRequestInput[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const toggleNeed = (need: string) => {
    setValues((prev) => {
      const has = prev.needs.includes(need)
      return {
        ...prev,
        needs: has
          ? prev.needs.filter((item) => item !== need)
          : [...prev.needs, need],
      }
    })
    setErrors((prev) => {
      if (!prev.needs) return prev
      const next = { ...prev }
      delete next.needs
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submit.status === 'submitting') return

    const nextErrors = validateProjectRequest(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmit({
        status: 'error',
        message: 'Please fix the highlighted fields and submit again.',
      })
      const firstKey = Object.keys(nextErrors)[0]
      document
        .querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.focus()
      return
    }

    setSubmit({ status: 'submitting' })

    const { error } = await supabase
      .from('project_requests')
      .insert(toProjectRequestPayload(values))

    if (error) {
      setSubmit({
        status: 'error',
        message: friendlyError(error.message, error.code),
      })
      return
    }

    setSubmit({ status: 'success', name: values.full_name.trim().split(' ')[0] })
    setValues({ ...EMPTY_REQUEST, needs: [], source_project: values.source_project })
    setErrors({})
  }

  if (submit.status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-10">
        <span className="inline-grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CircleCheckBig className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
          Request received, {submit.name}.
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600">
          Your details are with us. We reply within one working day with a
          scope, a fixed price, and a delivery date — usually much sooner.
        </p>

        <ol className="mt-6 space-y-3">
          {[
            'We review your requirement and check what is already available.',
            'You get a message on WhatsApp or email with scope and price.',
            'You approve the plan, then development and delivery start.',
          ].map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
          >
            <MessageCircle className="size-4" />
            Message us on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setSubmit({ status: 'idle' })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  const busy = submit.status === 'submitting'

  const fieldError = (key: keyof ProjectRequestInput) =>
    errors[key] ? (
      <p id={`${formId}-${key}-error`} className="mt-1.5 text-xs font-medium text-red-600">
        {errors[key]}
      </p>
    ) : null

  const inputClass = (key: keyof ProjectRequestInput) =>
    `input ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : ''}`

  const aria = (key: keyof ProjectRequestInput) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${formId}-${key}-error` : undefined,
    'data-field': key,
  })

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      {submit.status === 'error' ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">{submit.message}</p>
        </div>
      ) : null}

      {/* About you */}
      <fieldset className="space-y-5" disabled={busy}>
        <legend className="text-lg font-bold tracking-tight text-gray-900">
          About you
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              autoComplete="name"
              className={inputClass('full_name')}
              value={values.full_name}
              onChange={(event) => update('full_name', event.target.value)}
              placeholder="Omkar Mohite"
              {...aria('full_name')}
            />
            {fieldError('full_name')}
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              className={inputClass('email')}
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="you@college.edu"
              {...aria('email')}
            />
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor={`${formId}-whatsapp`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              WhatsApp number <span className="text-red-500">*</span>
            </label>
            <input
              id={`${formId}-whatsapp`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass('whatsapp')}
              value={values.whatsapp}
              onChange={(event) => update('whatsapp', event.target.value)}
              placeholder="+91 98765 43210"
              {...aria('whatsapp')}
            />
            {fieldError('whatsapp')}
          </div>

          <div>
            <label htmlFor={`${formId}-college`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              College / university <span className="text-red-500">*</span>
            </label>
            <input
              id={`${formId}-college`}
              type="text"
              autoComplete="organization"
              className={inputClass('college')}
              value={values.college}
              onChange={(event) => update('college', event.target.value)}
              placeholder="Savitribai Phule Pune University"
              {...aria('college')}
            />
            {fieldError('college')}
          </div>

          <div>
            <label htmlFor={`${formId}-year`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Year of study <span className="text-red-500">*</span>
            </label>
            <select
              id={`${formId}-year`}
              className={inputClass('year_of_study')}
              value={values.year_of_study}
              onChange={(event) => update('year_of_study', event.target.value)}
              {...aria('year_of_study')}
            >
              <option value="">Select your year</option>
              {YEAR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError('year_of_study')}
          </div>

          <div>
            <label htmlFor={`${formId}-course`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              id={`${formId}-course`}
              className={inputClass('course')}
              value={values.course}
              onChange={(event) => update('course', event.target.value)}
              {...aria('course')}
            >
              <option value="">Select your course</option>
              {COURSE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError('course')}
          </div>
        </div>
      </fieldset>

      <hr className="my-8 border-gray-100" />

      {/* What you need */}
      <fieldset className="space-y-5" disabled={busy}>
        <legend className="text-lg font-bold tracking-tight text-gray-900">
          What you need
        </legend>

        <div>
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            I need help with <span className="text-red-500">*</span>
          </span>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Things you need help with"
            aria-describedby={errors.needs ? `${formId}-needs-error` : undefined}
          >
            {NEED_OPTIONS.map((need) => {
              const checked = values.needs.includes(need)
              return (
                <label
                  key={need}
                  className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    checked
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleNeed(need)}
                  />
                  {need}
                </label>
              )
            })}
          </div>
          {errors.needs ? (
            <p id={`${formId}-needs-error`} className="mt-2 text-xs font-medium text-red-600">
              {errors.needs}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-type`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Project type <span className="text-red-500">*</span>
            </label>
            <select
              id={`${formId}-type`}
              className={inputClass('project_type')}
              value={values.project_type}
              onChange={(event) => update('project_type', event.target.value)}
              {...aria('project_type')}
            >
              <option value="">Select a project type</option>
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError('project_type')}
          </div>

          <div>
            <label htmlFor={`${formId}-tech`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Preferred tech stack
            </label>
            <input
              id={`${formId}-tech`}
              type="text"
              className={inputClass('tech_stack')}
              value={values.tech_stack}
              onChange={(event) => update('tech_stack', event.target.value)}
              placeholder="React, Node.js, MySQL, Python…"
              {...aria('tech_stack')}
            />
            {fieldError('tech_stack')}
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-description`} className="mb-1.5 block text-sm font-semibold text-gray-700">
            Describe your project <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`${formId}-description`}
            rows={6}
            className={`${inputClass('description')} resize-y`}
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Topic, the problem it solves, the main features you need, and anything your college guide has asked for."
            {...aria('description')}
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            {fieldError('description') ?? <span />}
            <span
              className={`shrink-0 text-xs ${
                values.description.length > 2000 ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {values.description.length}/2000
            </span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-deadline`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Submission deadline
            </label>
            <input
              id={`${formId}-deadline`}
              type="date"
              className={inputClass('deadline')}
              value={values.deadline}
              onChange={(event) => update('deadline', event.target.value)}
              {...aria('deadline')}
            />
            {fieldError('deadline')}
            <p className="mt-1.5 text-xs text-gray-400">
              Leave blank if you are still planning.
            </p>
          </div>

          <div>
            <label htmlFor={`${formId}-budget`} className="mb-1.5 block text-sm font-semibold text-gray-700">
              Budget <span className="text-red-500">*</span>
            </label>
            <select
              id={`${formId}-budget`}
              className={inputClass('budget')}
              value={values.budget}
              onChange={(event) => update('budget', event.target.value)}
              {...aria('budget')}
            >
              <option value="">Select a budget range</option>
              {BUDGET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError('budget')}
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-reference`} className="mb-1.5 block text-sm font-semibold text-gray-700">
            Reference link
          </label>
          <input
            id={`${formId}-reference`}
            type="url"
            inputMode="url"
            className={inputClass('reference_url')}
            value={values.reference_url}
            onChange={(event) => update('reference_url', event.target.value)}
            placeholder="https://github.com/… or a similar project you like"
            {...aria('reference_url')}
          />
          {fieldError('reference_url')}
          <p className="mt-1.5 text-xs text-gray-400">
            Optional. A GitHub repo, paper, or example project helps us match your
            expectation exactly.
          </p>
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-gray-400">
          We use these details only to reply about your request. No spam, no
          sharing with third parties.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-60"
        >
          {busy ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending request…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send my request
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
