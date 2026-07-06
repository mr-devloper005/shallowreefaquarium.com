import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
        <section className={`relative ${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-14 py-20 lg:grid-cols-[1fr_0.9fr]`}>
          <div>
            <p className={dc.type.eyebrow}>{pagesContent.auth.login.badge}</p>
            <h1 className={`editable-display mt-6 max-w-xl ${dc.type.sectionTitle}`}>
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-7 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Access</p>
            <h2 className="editable-display mt-3 text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {pagesContent.auth.login.createCta}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
