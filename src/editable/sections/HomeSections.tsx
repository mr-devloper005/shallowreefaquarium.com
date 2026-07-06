import Link from 'next/link'
import { ArrowUpRight, MapPin, FileText, Compass, Search, Sparkles, ShieldCheck, Layers, Download } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, getEditableCategory, getEditableExcerpt } from '@/editable/cards/PostCards'
import { taskThemes } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = dc.shell.section

function taskDisplayLabel(key: string, fallback: string) {
  return taskThemes[key as keyof typeof taskThemes]?.kicker || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- Hero --------------------------------- */

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `A calmer way to discover ${SITE_CONFIG.name}.`
  const primaryLabel = taskDisplayLabel(primaryTask, primaryTask)
  const featured = posts[0]

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[640px]" aria-hidden="true" />
      <div className={`relative ${container} pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32`}>
        <div className="mx-auto max-w-4xl text-center">
          <EditableReveal index={0}>
            <p className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-accent-soft)] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
              {pagesContent.home.hero.badge || `Live on ${SITE_CONFIG.name}`}
            </p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`editable-display mt-8 text-balance text-white ${dc.type.heroTitle}`}>
              {heroTitle}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)] sm:text-xl">
              {pagesContent.home.hero.description}
            </p>
          </EditableReveal>
          <EditableReveal index={3}>
            <form action="/search" className="mx-auto mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-1.5 shadow-[0_28px_90px_-40px_rgba(7,241,206,0.5)]">
              <Search className="ml-4 h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder || 'Search places, guides, references…'}
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)]">
                Search <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </EditableReveal>
          <EditableReveal index={4}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={primaryRoute} className={dc.button.primary}>
                Browse {primaryLabel} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={dc.button.secondary}>
                How it works
              </Link>
            </div>
          </EditableReveal>
        </div>

        {/* Editorial feature strip under the hero — like Ooto's platform-features */}
        {featured ? (
          <EditableReveal index={5}>
            <div className="mx-auto mt-24 grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Link href={postHref(primaryTask, featured, primaryRoute)} className="group relative block overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
                <div className="relative aspect-[16/10]">
                  <img src={getEditablePostImage(featured)} alt={featured.title} className={`h-full w-full object-cover ${dc.motion.zoom}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(13,13,13,0.9))]" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Now trending</p>
                    <h3 className="editable-display mt-3 max-w-xl text-2xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                      {featured.title}
                    </h3>
                  </div>
                </div>
              </Link>
              <div className="grid gap-3 rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ Latest picks</p>
                {posts.slice(1, 4).map((post, i) => (
                  <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group flex items-start gap-4 border-b border-[var(--editable-border)] pb-3 last:border-0 last:pb-0">
                    <span className="editable-mono mt-1 shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">
                      0{i + 2}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="editable-display line-clamp-2 text-base font-medium leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-500 group-hover:text-[var(--slot4-accent)]">
                        {post.title}
                      </h4>
                      <p className="mt-1 text-xs text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------ Feature triad (01/02/03) --------------------- */

const FEATURES = [
  {
    icon: Compass,
    title: 'Discover places nearby',
    body: 'A curated local directory — every entry with hours, contact details, and the context you need before you walk in.',
  },
  {
    icon: FileText,
    title: 'Download reference guides',
    body: 'Guides, reports and references — previewed inline before you download, and organised so you can find them again later.',
  },
  {
    icon: Sparkles,
    title: 'One connected surface',
    body: 'Places and references live side-by-side, so a business you find can hand you the guide that explains what it does.',
  },
]

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  return (
    <section className="relative border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`${container} ${dc.shell.sectionYTight}`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <EditableReveal index={0}>
            <div className="max-w-xl">
              <p className={dc.type.eyebrow}>/ What lives here</p>
              <h2 className={`editable-display mt-5 ${dc.type.sectionTitle}`}>
                A directory <span className="text-[var(--slot4-accent)]">and</span> a reference library, held together by one clean rhythm.
              </h2>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <Link href={primaryRoute} className={dc.button.secondary}>
              Explore the platform <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <EditableReveal key={f.title} index={i + 2}>
              <div className={`${dc.surface.card} h-full p-8 transition duration-500 hover:border-[var(--slot4-accent)]/40`}>
                <div className="flex items-center justify-between">
                  <span className="editable-mono text-[13px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                    0{i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-accent)]">
                    <f.icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="editable-display mt-8 text-2xl font-medium leading-tight tracking-[-0.02em] sm:text-[1.75rem]">
                  {f.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{f.body}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------- Slide/showcase — feed rail ------------------------ */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 9)
  if (!pool.length) return null

  return (
    <section className="relative border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} ${dc.shell.sectionYTight}`}>
        <EditableReveal index={0}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={`justify-center ${dc.type.eyebrow}`}>/ In the feed</p>
            <h2 className={`editable-display mt-5 ${dc.type.sectionTitle}`}>
              Fresh from the platform.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">
              A rolling snapshot of the newest places, references and finds — everything below is live.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pool.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i + 1}>
              <Link
                href={postHref(primaryTask, post, primaryRoute)}
                className={`group block h-full overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
              >
                <div className={`${dc.media.frame} aspect-[16/10] border-0`}>
                  <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
                  <span className="editable-mono absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
                    {getEditableCategory(post)}
                  </span>
                </div>
                <div className="p-7">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">
                    0{i + 1} / {String(pool.length).padStart(2, '0')}
                  </p>
                  <h3 className="editable-display mt-3 line-clamp-2 text-xl font-medium leading-tight tracking-[-0.02em] text-[var(--slot4-page-text)] transition duration-500 group-hover:text-[var(--slot4-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
                    {getEditableExcerpt(post, 130)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
                    Open <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------- Split feature block (platform) ------------------ */

const PLATFORM_POINTS = [
  { icon: MapPin, label: 'Location-aware', body: 'Every listing carries address, hours and contact.' },
  { icon: ShieldCheck, label: 'Verified entries', body: 'Records are reviewed before they publish.' },
  { icon: Layers, label: 'Reference-ready', body: 'Every guide previews inline before download.' },
]

function PlatformSplit() {
  return (
    <section className="relative border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <EditableReveal index={0}>
            <div>
              <p className={dc.type.eyebrow}>/ Platform</p>
              <h2 className={`editable-display mt-5 ${dc.type.sectionTitle}`}>
                Built for people who actually want to <span className="italic text-[var(--slot4-accent)]">read</span> before they visit.
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-[var(--slot4-muted-text)]">
                Directories that only list phone numbers get old fast. {SITE_CONFIG.name} keeps a business record next to the guide that explains it — so you can decide, not just find.
              </p>
              <div className="mt-10 grid gap-3">
                {PLATFORM_POINTS.map((p, i) => (
                  <EditableReveal key={p.label} index={i + 1}>
                    <div className="flex items-start gap-4 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <p.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">/ {p.label}</p>
                        <p className="mt-1 text-[14px] text-[var(--slot4-page-text)]">{p.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8">
              <div className="editable-glow pointer-events-none absolute inset-x-0 top-0 h-64" aria-hidden="true" />
              <div className="relative grid gap-4">
                <div className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-6">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">/ Sample record</p>
                  <div className="mt-4 flex items-start gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <MapPin className="h-6 w-6" />
                    </span>
                    <div>
                      <h4 className="editable-display text-lg font-medium tracking-[-0.01em]">Shoreline Reef Studio</h4>
                      <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">Local guide · Verified · Open today</p>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <span className="editable-mono rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">Reef care</span>
                    <span className="editable-mono rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">In-store</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-6">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">/ Paired reference</p>
                  <div className="mt-4 flex items-start gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <Download className="h-6 w-6" />
                    </span>
                    <div>
                      <h4 className="editable-display text-lg font-medium tracking-[-0.01em]">The reef-keeper handbook</h4>
                      <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">Guide · 32 pages · Updated recently</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time collections — three bands ------------------ */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: '/ This week', title: 'Fresh in the last 7 days' },
  browse: { eyebrow: '/ Trending', title: 'Popular this month' },
  index: { eyebrow: '/ Archive', title: 'Reach further back' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      <PlatformSplit />

      {visible.map((section) => {
        const copy = sectionCopy[section.key] || { eyebrow: '/ More', title: 'More to explore' }
        return (
          <section key={section.key} className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
            <div className={`${container} ${dc.shell.sectionYTight}`}>
              <EditableReveal index={0}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className={`editable-display mt-4 ${dc.type.sectionTitle}`}>{copy.title}</h2>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                    See all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i + 1}>
                    <Link
                      href={postHref(primaryTask, post, primaryRoute)}
                      className={`group block h-full overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
                    >
                      <div className={`${dc.media.frame} aspect-[3/2] border-0`}>
                        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
                      </div>
                      <div className="p-5">
                        <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                          / {getEditableCategory(post)}
                        </p>
                        <h3 className="editable-display mt-3 line-clamp-2 text-lg font-medium leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-500 group-hover:text-[var(--slot4-accent)]">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
                          {getEditableExcerpt(post, 105)}
                        </p>
                      </div>
                    </Link>
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA ---------------------------------- */

export function EditableHomeCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="editable-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={`relative ${container} ${dc.shell.sectionY}`}>
        <EditableReveal index={0}>
          <div className="relative mx-auto flex max-w-4xl flex-col items-center rounded-[2.5rem] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] p-10 text-center sm:p-16">
            <p className={dc.type.eyebrow}>/ Contribute</p>
            <h2 className={`editable-display mt-6 text-white ${dc.type.sectionTitle}`}>
              Have a place, a guide or a reference worth adding?
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[var(--slot4-muted-text)] sm:text-base">
              Submit a listing or upload a guide to the shared reference library — {SITE_CONFIG.name} is meant to grow with the people using it.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/create" className={dc.button.primary}>
                Submit an entry <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className={dc.button.secondary}>
                Get in touch
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
