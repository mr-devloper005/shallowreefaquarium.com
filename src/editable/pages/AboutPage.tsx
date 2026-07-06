import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
          <div className={`relative ${dc.shell.section} ${dc.shell.sectionY}`}>
            <EditableReveal index={0}>
              <p className={dc.type.eyebrow}>{pagesContent.about.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`editable-display mt-6 max-w-4xl text-balance ${dc.type.heroTitle}`}>
                {pagesContent.about.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <article className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 lg:p-14">
              <div className="grid gap-6 text-[16px] leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <p className="editable-mono mt-10 text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                / {SITE_CONFIG.name}
              </p>
            </article>
            <div className="grid gap-4">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-7 transition duration-500 hover:border-[var(--slot4-accent)]/40">
                    <span className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                      0{i + 1}
                    </span>
                    <h2 className="editable-display mt-4 text-2xl font-medium tracking-[-0.02em]">{value.title}</h2>
                    <p className="mt-4 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
