import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, PackageSearch, Search, X } from 'lucide-react'
import { ProjectCard } from '../components/ProjectCard'
import { FaqAccordion } from '../components/FaqAccordion'
import {
  PROJECTS,
  YEAR_LABELS,
  YEAR_ORDER,
  isProjectYear,
  type ProjectYear,
} from '../data/projects'
import { usePageMeta } from '../lib/seo'

type DomainGroup = 'All' | 'Web' | 'AI & ML' | 'Mobile'

const domainGroups: DomainGroup[] = ['All', 'Web', 'AI & ML', 'Mobile']

function domainGroupOf(domain: string): DomainGroup {
  const value = domain.toLowerCase()
  if (value.startsWith('ai')) return 'AI & ML'
  if (value.startsWith('web')) return 'Web'
  if (value.startsWith('mobile')) return 'Mobile'
  return 'All'
}

export function ProjectsPage() {
  usePageMeta({
    title: 'College projects with source code, docs & PPT',
    description:
      'Browse ready-made mini and final-year projects for BCA, MCA, BSc CS and BE/BTech — filtered by year, domain and technology. Source code, documentation, PPT and viva Q&A included.',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const yearParam = searchParams.get('year')
  const activeYear: ProjectYear | 'all' = isProjectYear(yearParam)
    ? yearParam
    : 'all'

  const domainParam = searchParams.get('domain')
  const activeDomain: DomainGroup =
    domainParam && (domainGroups as string[]).includes(domainParam)
      ? (domainParam as DomainGroup)
      : 'All'

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return PROJECTS.filter((project) => {
      if (activeYear !== 'all' && project.year !== activeYear) return false
      if (
        activeDomain !== 'All' &&
        domainGroupOf(project.domain) !== activeDomain
      ) {
        return false
      }
      if (!search) return true
      return (
        project.title.toLowerCase().includes(search) ||
        project.tagline.toLowerCase().includes(search) ||
        project.domain.toLowerCase().includes(search) ||
        project.tech.some((tech) => tech.toLowerCase().includes(search))
      )
    })
  }, [activeYear, activeDomain, query])

  const updateParam = (key: 'year' | 'domain', value: string) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all' || value === 'All') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next)
  }

  const resetFilters = () => {
    setQuery('')
    setSearchParams(new URLSearchParams())
  }

  const hasFilters =
    activeYear !== 'all' || activeDomain !== 'All' || query.trim() !== ''

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-24 size-[26rem] rounded-full bg-indigo-100/70 blur-3xl"
        />
        <div className="container-page relative py-14 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Project library
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Projects that get you marks — and interviews
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Ready-made kits for every year, packaged with source code,
              documentation, PPT, and viva answers. Pick one, submit on time, and
              actually understand what you built.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, technology, or domain…"
                aria-label="Search projects"
                className="input py-3 pl-11 pr-11"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section-padding-small bg-gray-50">
        <div className="container-page">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateParam('year', 'all')}
                aria-pressed={activeYear === 'all'}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  activeYear === 'all'
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100'
                }`}
              >
                All years
              </button>
              {YEAR_ORDER.map((year) => {
                const isActive = activeYear === year
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => updateParam('year', year)}
                    aria-pressed={isActive}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-navy-900 text-white'
                        : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {YEAR_LABELS[year]}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Domain
              </span>
              {domainGroups.map((group) => {
                const isActive = activeDomain === group
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => updateParam('domain', group)}
                    aria-pressed={isActive}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {group}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'project' : 'projects'}
              {activeYear !== 'all' ? ` · ${YEAR_LABELS[activeYear]}` : ''}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <X className="size-4" />
                Clear filters
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <PackageSearch className="size-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-gray-900">
                No projects match those filters
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                Try a different year or domain, clear the search box, or request
                a project built to your exact topic.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Reset filters
                </button>
                <Link
                  to="/request-project"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Request this project
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}

          {/* Custom project CTA */}
          <div className="mt-12 overflow-hidden rounded-2xl bg-navy-900 p-8 text-white sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Need something specific?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-200 sm:text-base">
                  Tell us your topic, tech stack, and deadline. You will get a
                  fixed plan and price before any work starts.
                </p>
              </div>
              <Link
                to="/request-project"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 transition-transform hover:-translate-y-0.5"
              >
                Request a project
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <FaqAccordion
          title="Project questions, answered"
          subtitle="What is included, how delivery works, and what happens after payment."
        />
      </div>
    </>
  )
}
