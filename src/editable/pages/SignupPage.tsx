import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden">
        <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
        <section className={`relative ${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-14 py-20 lg:grid-cols-[0.9fr_1fr]`}>
          <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Get started</p>
            <h1 className="editable-display mt-3 text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {pagesContent.auth.signup.loginCta}
              </Link>
            </p>
          </div>
          <div>
            <p className={dc.type.eyebrow}>{pagesContent.auth.signup.badge}</p>
            <h2 className={`editable-display mt-6 max-w-xl ${dc.type.sectionTitle}`}>
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-7 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
