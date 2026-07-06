'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { taskThemes } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function taskDisplayLabel(key: string, fallback: string) {
  return taskThemes[key as keyof typeof taskThemes]?.kicker || fallback
}

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="relative overflow-hidden border-b border-[var(--editable-border)]">
        <div className="editable-glow pointer-events-none absolute inset-x-0 -top-40 h-96" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-20 lg:py-24">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ start exploring</p>
            <h2 className="editable-display mt-5 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.03em]">
              A single surface for every place, listing and reference worth keeping.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)]">
              Search everything <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-20 lg:py-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-10" />
            <span className="editable-display text-xl font-medium tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description || `${SITE_CONFIG.name} is a local directory and reference library — one place to find businesses nearby and download the guides that make them useful.`}
          </p>
          
        </div>

        <div>
          <h3 className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Discover</h3>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="inline-flex items-center justify-between gap-2 text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]"
              >
                {taskDisplayLabel(task.key, task.label)}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Resources</h3>
          <div className="mt-5 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Account</h3>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]">Submit</Link>
                <button type="button" onClick={logout} className="text-left text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]">Sign in</Link>
                <Link href="/signup" className="text-[14px] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:text-[var(--slot4-page-text)]">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-4 py-6 text-[12px] text-[var(--slot4-soft-muted-text)] sm:flex-row sm:px-8 lg:px-20">
          <span className="editable-mono uppercase tracking-[0.16em]">© {year} {SITE_CONFIG.name}</span>
          <span className="editable-mono uppercase tracking-[0.16em]">All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
