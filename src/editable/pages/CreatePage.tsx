'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Image as ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { taskThemes } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowUpRight,
}

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((t) => t.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = taskThemes[task]?.kicker || activeTask?.label || 'entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="relative overflow-hidden">
          <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
          <section className={`relative ${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-14 py-20 md:grid-cols-[0.9fr_1.1fr]`}>
            <div className="flex h-full min-h-72 items-center justify-center rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
              <h1 className={`editable-display mt-6 ${dc.type.heroTitle}`}>{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-7 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/signup" className={dc.button.secondary}>Get started</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
          <div className={`relative ${dc.shell.section} pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32`}>
            <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
            <h1 className={`editable-display mt-6 max-w-4xl ${dc.type.heroTitle}`}>{pagesContent.create.hero.title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
          </div>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Choose content type</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item, i) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const label = taskThemes[item.key as keyof typeof taskThemes]?.kicker || item.label
                  return (
                    <EditableReveal key={item.key} index={i}>
                      <button
                        type="button"
                        onClick={() => setTask(item.key as TaskKey)}
                        className={`w-full rounded-2xl border p-5 text-left transition duration-500 ${
                          active
                            ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)]'
                            : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-accent)]/40'
                        }`}
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="editable-display mt-4 block text-base font-medium tracking-[-0.01em]">{label}</span>
                        <span className="mt-1 block text-xs text-[var(--slot4-muted-text)]">{item.description}</span>
                      </button>
                    </EditableReveal>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ New {activeLabel.toLowerCase()}</p>
                  <h2 className="editable-display mt-3 text-3xl font-medium tracking-[-0.03em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="editable-mono rounded-full border border-[var(--editable-border)] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-52`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-2xl border border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent)]">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
