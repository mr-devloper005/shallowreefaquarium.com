'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const authLinks = session
    ? [{ label: 'Submit', href: '/create' }]
    : [
        { label: 'Sign in', href: '/login' },
        { label: 'Get started', href: '/signup' },
      ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex items-center">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-10" />
          </div>
          <span className="editable-display block max-w-[220px] truncate text-lg font-medium leading-none tracking-[-0.02em]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editable-mono text-[12px] uppercase tracking-[0.16em] transition duration-500 ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition duration-500 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {authLinks.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                i === authLinks.length - 1
                  ? 'hidden items-center gap-1.5 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[13px] font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)] sm:inline-flex'
                  : 'hidden text-[13px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)] sm:inline-flex'
              }
            >
              {item.label}
              {i === authLinks.length - 1 ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="hidden text-[13px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)] sm:inline-flex"
            >
              Logout
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-6 md:hidden">
          <div className="grid gap-1">
            {[...NAV_LINKS, ...authLinks].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`editable-mono rounded-2xl px-4 py-3 text-[13px] uppercase tracking-[0.16em] ${
                    active ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="editable-mono rounded-2xl px-4 py-3 text-left text-[13px] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
