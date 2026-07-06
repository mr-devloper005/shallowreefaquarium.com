'use client'

import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  as?: ElementType
  className?: string
  delay?: number
}

/**
 * IntersectionObserver-driven fade + slide-up.
 * Hidden state is applied only after mount, so JS-off visitors see content immediately.
 * Per-item stagger via `index` (multiplied by 60ms). Respects prefers-reduced-motion via CSS.
 */
export function EditableReveal({ children, index = 0, as, className = '', delay }: EditableRevealProps) {
  const Tag: ElementType = as || 'div'
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const stagger = (delay ?? index * 60) + 'ms'
  const style: CSSProperties | undefined = mounted ? { transitionDelay: stagger } : undefined
  const cls = mounted ? `editable-reveal ${visible ? 'is-visible' : ''} ${className}` : className

  return (
    <Tag ref={ref as never} className={cls} style={style}>
      {children}
    </Tag>
  )
}
