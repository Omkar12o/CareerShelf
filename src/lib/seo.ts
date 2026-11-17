import { useEffect } from 'react'

type PageMeta = {
  title: string
  description?: string
}

const DEFAULT_TITLE = 'CareerShelf — Projects, interview prep & careers for tech students'
const DEFAULT_DESCRIPTION =
  'Ready-made college projects with source code, documentation, PPT and viva Q&A — plus interview preparation and career support for BCA, MCA, BSc CS and BE/BTech students.'

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  )
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.content = content
}

/**
 * Sets the document title plus the description and social preview tags per page.
 * Keeps SEO predictable without pulling in a head-management dependency.
 */
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} · CareerShelf` : DEFAULT_TITLE
    const summary = description ?? DEFAULT_DESCRIPTION

    document.title = fullTitle

    upsertMeta('name', 'description', summary)
    upsertMeta('property', 'og:site_name', 'CareerShelf')
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', summary)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', window.location.href)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', summary)
  }, [title, description])
}
