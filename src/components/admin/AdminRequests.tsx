import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  Inbox,
  Mail,
  MessageCircle,
  Search,
  Send,
  UserRound,
  Wallet,
} from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { Button } from '../Button'
import { Modal } from './Modal'
import { useToast } from './toast-context'
import { formatDate, formatDateTime } from './utils'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  STATUS_TONE,
  isRequestStatus,
  type ProjectRequestRow,
  type RequestStatus,
} from '../../data/projectRequests'

type StatusFilter = 'all' | RequestStatus

function digits(value: string): string {
  return value.replace(/\D/g, '')
}

function whatsappHref(value: string): string {
  const clean = digits(value)
  const withCountry = clean.length === 10 ? `91${clean}` : clean
  return `https://wa.me/${withCountry}`
}

export function AdminRequests() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<ProjectRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<ProjectRequestRow | null>(null)
  const [note, setNote] = useState('')
  const [detailStatus, setDetailStatus] = useState<RequestStatus>('new')
  const [detailSaving, setDetailSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error: loadError } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<ProjectRequestRow[]>()

      if (cancelled) return

      if (loadError) {
        setError(
          /does not exist|could not find the table|schema cache/i.test(
            loadError.message,
          )
            ? 'The project_requests table does not exist yet. Run supabase/project_requests.sql in the Supabase SQL editor, then reload this page.'
            : loadError.message,
        )
        setLoading(false)
        return
      }

      setRequests(data ?? [])
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: requests.length,
      new: 0,
      contacted: 0,
      in_progress: 0,
      done: 0,
    }
    for (const request of requests) {
      if (isRequestStatus(request.status)) base[request.status] += 1
    }
    return base
  }, [requests])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return requests
      .filter((request) => statusFilter === 'all' || request.status === statusFilter)
      .filter((request) => {
        if (!needle) return true
        return [
          request.full_name,
          request.email,
          request.whatsapp,
          request.college ?? '',
          request.course ?? '',
          request.year_of_study ?? '',
          request.project_type ?? '',
          request.tech_stack ?? '',
          request.description,
          request.source_project ?? '',
        ].some((value) => value.toLowerCase().includes(needle))
      })
  }, [requests, statusFilter, query])

  const applyStatus = async (request: ProjectRequestRow, status: RequestStatus) => {
    if (request.status === status) return
    const previous = requests
    setSavingId(request.id)
    setRequests((rows) =>
      rows.map((row) => (row.id === request.id ? { ...row, status } : row)),
    )

    const { error: updateError } = await supabase
      .from('project_requests')
      .update({ status })
      .eq('id', request.id)

    setSavingId(null)

    if (updateError) {
      setRequests(previous)
      toast('error', `Could not update status: ${updateError.message}`)
      return
    }

    toast('success', `Marked as ${STATUS_LABELS[status].toLowerCase()}.`)
    setSelected((current) =>
      current && current.id === request.id ? { ...current, status } : current,
    )
  }

  const openDetail = (request: ProjectRequestRow) => {
    setSelected(request)
    setNote(request.admin_note ?? '')
    setDetailStatus(isRequestStatus(request.status) ? request.status : 'new')
    setCopied(false)
  }

  const closeDetail = () => {
    setSelected(null)
    setCopied(false)
  }

  const saveDetail = async () => {
    if (!selected) return
    setDetailSaving(true)

    const patch = { status: detailStatus, admin_note: note.trim() || null }
    const { error: updateError } = await supabase
      .from('project_requests')
      .update(patch)
      .eq('id', selected.id)

    setDetailSaving(false)

    if (updateError) {
      toast('error', `Could not save: ${updateError.message}`)
      return
    }

    setRequests((rows) =>
      rows.map((row) => (row.id === selected.id ? { ...row, ...patch } : row)),
    )
    setSelected({ ...selected, ...patch })
    toast('success', 'Request updated.')
  }

  const copyContact = async (request: ProjectRequestRow) => {
    const text = [
      request.full_name,
      request.email,
      request.whatsapp,
      request.college ?? '',
    ]
      .filter(Boolean)
      .join(' · ')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('error', 'Clipboard access is blocked in this browser.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Project requests
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Custom project enquiries submitted from the website. Set a status as you
        work through them.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() =>
              setStatusFilter((current) => (current === status ? 'all' : status))
            }
            className={`rounded-xl border p-4 text-left transition-colors ${
              statusFilter === status
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {STATUS_LABELS[status]}
            </span>
            <span className="mt-1 block text-2xl font-extrabold tracking-tight text-gray-900">
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          aria-label="Filter by status"
          className="input w-auto"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        >
          <option value="all">All statuses ({counts.all})</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]} ({counts[status]})
            </option>
          ))}
        </select>
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            aria-label="Search requests"
            placeholder="Search by name, email, college, topic…"
            className="input pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReloadKey((key) => key + 1)}
          className="sm:ml-auto"
        >
          Refresh
        </Button>
      </div>

      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span role="status" aria-label="Loading requests" className="spinner" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <p className="text-sm font-semibold text-gray-900">
              Couldn&apos;t load requests
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              {error}
            </p>
            <Button onClick={() => setReloadKey((key) => key + 1)} className="mt-6">
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Inbox className="size-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-sm font-semibold text-gray-900">
              {requests.length === 0 ? 'No requests yet' : 'No matching requests'}
            </p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {requests.length === 0
                ? 'When a student submits the request form, the enquiry will appear here.'
                : 'Try a different status or clear the search box.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Requirement</th>
                  <th className="px-5 py-3 font-semibold">Deadline</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((request) => (
                  <tr key={request.id} className="align-top hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openDetail(request)}
                        className="text-left font-semibold text-gray-900 hover:text-indigo-700"
                      >
                        {request.full_name}
                      </button>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {[request.course, request.year_of_study]
                          .filter(Boolean)
                          .join(' · ') || 'Course not given'}
                      </p>
                      <p className="mt-0.5 max-w-48 truncate text-xs text-gray-400">
                        {request.college ?? '—'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${request.email}`}
                        className="block max-w-56 truncate text-sm text-indigo-600 hover:underline"
                      >
                        {request.email}
                      </a>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {request.whatsapp}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatDate(request.created_at)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="max-w-64 truncate font-medium text-gray-900">
                        {request.project_type ?? 'Not specified'}
                      </p>
                      <p className="mt-0.5 max-w-64 truncate text-xs text-gray-500">
                        {request.tech_stack ?? 'No stack specified'}
                      </p>
                      <p className="mt-0.5 max-w-64 truncate text-xs text-gray-400">
                        {request.budget ?? 'No budget given'}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {request.deadline ? formatDate(request.deadline) : 'Flexible'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Status for ${request.full_name}`}
                          disabled={savingId === request.id}
                          value={
                            isRequestStatus(request.status)
                              ? request.status
                              : 'new'
                          }
                          onChange={(event) =>
                            void applyStatus(
                              request,
                              event.target.value as RequestStatus,
                            )
                          }
                          className="input w-auto min-w-36 py-1.5 text-xs font-semibold"
                        >
                          {STATUS_ORDER.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(request)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Showing {filtered.length} of {requests.length} request
        {requests.length === 1 ? '' : 's'}. Only the admin account can read or
        update these rows.
      </p>

      <Modal
        open={selected !== null}
        onClose={closeDetail}
        title={selected ? selected.full_name : 'Project request'}
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                  STATUS_TONE[
                    isRequestStatus(selected.status) ? selected.status : 'new'
                  ]
                }`}
              >
                {STATUS_LABELS[
                  isRequestStatus(selected.status) ? selected.status : 'new'
                ]}
              </span>
              <span className="text-xs text-gray-400">
                Submitted {formatDateTime(selected.created_at)}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <UserRound className="size-3.5" /> Student
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selected.full_name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600">
                  <GraduationCap className="size-3.5 text-gray-400" />
                  {[selected.course, selected.year_of_study]
                    .filter(Boolean)
                    .join(' · ') || 'Course not given'}
                </p>
                <p className="mt-0.5 text-sm text-gray-600">
                  {selected.college ?? 'College not given'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Contact
                </p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 flex items-center gap-1.5 break-all text-sm font-medium text-indigo-600 hover:underline"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {selected.email}
                </a>
                <a
                  href={whatsappHref(selected.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
                >
                  <MessageCircle className="size-3.5 shrink-0" />
                  {selected.whatsapp}
                </a>
                <button
                  type="button"
                  onClick={() => void copyContact(selected)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy contact details
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Requirement
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {selected.project_type ? (
                  <span className="rounded-full bg-navy-900 px-2.5 py-1 font-semibold text-white">
                    {selected.project_type}
                  </span>
                ) : null}
                {selected.budget ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                    <Wallet className="size-3.5" />
                    {selected.budget}
                  </span>
                ) : null}
                {selected.deadline ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                    <CalendarDays className="size-3.5" />
                    Due {formatDate(selected.deadline)}
                  </span>
                ) : null}
              </div>

              {selected.needs && selected.needs.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.needs.map((need) => (
                    <span
                      key={need}
                      className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              ) : null}

              {selected.tech_stack ? (
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Stack: </span>
                  {selected.tech_stack}
                </p>
              ) : null}

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {selected.description}
              </p>

              {selected.reference_url ? (
                <a
                  href={selected.reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 break-all text-sm font-medium text-indigo-600 hover:underline"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  {selected.reference_url}
                </a>
              ) : null}

              {selected.source_project ? (
                <p className="mt-3 text-xs text-gray-400">
                  Prefilled from project: {selected.source_project}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-gray-200 p-3">
              <label
                htmlFor="request-detail-status"
                className="text-[11px] font-bold uppercase tracking-wider text-gray-400"
              >
                Status
              </label>
              <select
                id="request-detail-status"
                className="input mt-1.5"
                value={detailStatus}
                onChange={(event) =>
                  setDetailStatus(event.target.value as RequestStatus)
                }
              >
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>

              <label
                htmlFor="request-detail-note"
                className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-gray-400"
              >
                Internal note
              </label>
              <textarea
                id="request-detail-note"
                rows={3}
                className="input mt-1.5 resize-y"
                placeholder="Quoted ₹4,500, delivery in 5 days. Follow up Friday."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <a
                href={whatsappHref(selected.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                <Send className="size-4" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => void saveDetail()}
                disabled={detailSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {detailSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
