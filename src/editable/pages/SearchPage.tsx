import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { taskThemes } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function taskDisplayLabel(key: TaskKey | null, fallback: string) {
  if (!key) return fallback
  return taskThemes[key]?.kicker || fallback
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const displayLabel = taskDisplayLabel(task, 'Entry')
  const strong = index % 5 === 0

  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className={`group block h-full overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:border-[var(--slot4-accent)]/40 hover:-translate-y-1 ${strong ? 'md:col-span-2' : ''}`}
      >
        {image ? (
          <div className={`relative overflow-hidden ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0)_0%,rgba(13,13,13,0.7)_100%)]" />
            <span className="editable-mono absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
              / {displayLabel}
            </span>
          </div>
        ) : null}
        <div className="p-7 sm:p-8">
          {!image ? (
            <span className="editable-mono inline-flex rounded-full border border-[var(--editable-border)] bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
              / {displayLabel}
            </span>
          ) : null}
          <h2 className="editable-display mt-5 line-clamp-3 text-2xl font-medium leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)]">
            {post.title}
          </h2>
          {summary ? <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
            Open result <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

const fieldClass =
  'rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-[500px]" aria-hidden="true" />
          <div className={`relative ${dc.shell.section} pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32`}>
            <EditableReveal index={0}>
              <p className={dc.type.eyebrow}>{pagesContent.search.hero.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`editable-display mt-6 max-w-4xl text-balance ${dc.type.heroTitle}`}>
                {pagesContent.search.hero.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.search.hero.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <form action="/search" className="mt-10 rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 sm:p-6">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                    <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                  </label>
                  <select name="task" defaultValue={task} className={fieldClass}>
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{taskDisplayLabel(item.key as TaskKey, item.label)}</option>)}
                  </select>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)]" type="submit">
                    Search <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </EditableReveal>
          </div>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <EditableReveal index={0}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">/ {results.length} results</p>
                <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                  {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
                </h2>
              </div>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-14 text-center">
              <p className="editable-display text-2xl font-medium tracking-[-0.02em]">No matching entries found.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, content type, or category.</p>
            </div>
          )}

          {/* Footer ad — exactly one on Search */}
          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
