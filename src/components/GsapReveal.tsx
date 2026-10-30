import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type GsapRevealProps = {
  children: ReactNode
  className?: string
  y?: number
  duration?: number
  stagger?: number
  delay?: number
}

export function GsapReveal({
  children,
  className = '',
  y = 24,
  duration = 0.8,
  stagger = 0.1,
  delay = 0,
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(node, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.from(node.children.length ? node.children : node, {
        opacity: 0,
        y,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }, node)

    return () => ctx.revert()
  }, [y, duration, stagger, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
