import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Clock, Download, ExternalLink,
  FileText, Globe2, Layers, Mail, MapPin, Phone, ShieldCheck, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------- helpers ------------------------------- */

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const tagsOf = (post: SitePost) => (Array.isArray(post.tags) ? post.tags.filter((t): t is string => Boolean(t)) : []).slice(0, 6)

/* -------------------------------- Router ------------------------------- */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------- shared UI ----------------------------- */

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-accent-soft)] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tk-accent)]" />
      {theme.kicker}
      {children ? <><span className="text-[var(--tk-muted)]">·</span><span className="text-[var(--tk-muted)]">{children}</span></> : null}
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] text-[var(--tk-muted)] transition duration-500 hover:text-[var(--tk-accent)]">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to {theme.kicker}
    </Link>
  )
}

function QuickFactsStrip({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-line)] sm:grid-cols-2 lg:grid-cols-4">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="bg-[var(--tk-surface)] p-5">
          <div className="editable-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-2 break-words text-[15px] font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function TagChips({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="editable-mono rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">
          / {tag}
        </span>
      ))}
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

/* --------------------------------- Article ----------------------------- */

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-8 sm:py-24">
        <BackLink task="article" />
        <EditableReveal index={0}>
          <div className="mt-10"><Kicker task="article">{categoryOf(post, 'Field notes')}</Kicker></div>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-display mt-6 text-balance text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.03em]">{post.title}</h1>
        </EditableReveal>
        {images[0] ? (
          <EditableReveal index={2}>
            <img src={images[0]} alt="" className="mt-12 aspect-[16/9] w-full rounded-2xl border border-[var(--tk-line)] object-cover" />
          </EditableReveal>
        ) : null}
        <BodyContent post={post} />
        <TagChips tags={tagsOf(post)} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* -------------------------- Listing (rich record) ---------------------- */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 9)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'timing', 'openHours', 'opens'])
  const mapSrc = mapSrcFor(post)
  const category = categoryOf(post, 'Directory entry')
  const verified = Boolean(getField(post, ['verified', 'isVerified']))

  return (
    <>
      {/* Hero band — full-bleed image with dark scrim */}
      {hero ? (
        <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
          <div className="relative h-[52vh] min-h-[380px] w-full">
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.4)_0%,rgba(13,13,13,0.92)_100%)]" />
            <div className="editable-glow pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true" />
            <div className="relative mx-auto flex h-full max-w-[var(--editable-container)] flex-col justify-end px-4 pb-12 sm:px-8 sm:pb-16 lg:px-20 lg:pb-20">
              <EditableReveal index={0}>
                <Kicker task="listing">{category}</Kicker>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className="editable-display mt-6 max-w-4xl text-balance text-[clamp(2.6rem,6vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
                  {post.title}
                </h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {address ? (
                    <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
                      <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {address}
                    </span>
                  ) : null}
                  {phone ? (
                    <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
                      <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
                    </span>
                  ) : null}
                  <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-accent)]/40 bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-accent)]">
                    <ShieldCheck className="h-3.5 w-3.5" /> {verified ? 'Verified' : 'On the directory'}
                  </span>
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-[var(--tk-line)] px-4 py-16 sm:px-8 lg:px-20">
          <div className="mx-auto max-w-[var(--editable-container)]">
            <BackLink task="listing" />
            <div className="mt-10"><Kicker task="listing">{category}</Kicker></div>
            <h1 className="editable-display mt-6 text-balance text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1.04] tracking-[-0.03em]">{post.title}</h1>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 sm:py-20 lg:px-20 lg:py-24">
        <div className="mb-10">
          <BackLink task="listing" />
        </div>

        {/* Quick-facts strip */}
        <EditableReveal index={0}>
          <QuickFactsStrip items={[
            ['Location', address, MapPin],
            ['Phone', phone, Phone],
            ['Hours', hours, Clock],
            ['Verified', verified ? 'Yes' : 'On directory', ShieldCheck],
          ]} />
        </EditableReveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_400px]">
          <article className="min-w-0">
            {leadText(post) ? (
              <EditableReveal index={1}>
                <p className="editable-display max-w-2xl text-[clamp(1.4rem,2vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em] text-[var(--tk-text)]">
                  <span className="text-[var(--tk-accent)]">“</span>{leadText(post)}<span className="text-[var(--tk-accent)]">”</span>
                </p>
              </EditableReveal>
            ) : null}

            <EditableReveal index={2}>
              <h2 className="editable-display mt-14 text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                About this <span className="italic text-[var(--tk-accent)]">place</span>.
              </h2>
            </EditableReveal>
            <BodyContent post={post} />
            <TagChips tags={tagsOf(post)} />

            {gallery.length ? (
              <EditableReveal index={3}>
                <section className="mt-14">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Gallery</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {gallery.map((image, i) => (
                      <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full rounded-xl border border-[var(--tk-line)] object-cover" />
                    ))}
                  </div>
                </section>
              </EditableReveal>
            ) : null}

            {mapSrc ? (
              <EditableReveal index={4}>
                <section className="mt-14 overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <div className="flex items-center gap-2 border-b border-[var(--tk-line)] p-5 editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> On the map
                  </div>
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[380px] w-full border-0" />
                </section>
              </EditableReveal>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Contact card */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Contact</p>
              <div className="mt-5 divide-y divide-[var(--tk-line)]">
                {address ? (
                  <ContactRow icon={MapPin} label="Address" value={address} />
                ) : null}
                {phone ? (
                  <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} />
                ) : null}
                {email ? (
                  <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
                ) : null}
                {website ? (
                  <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '').replace(/\/$/, '')} href={website} external />
                ) : null}
                {hours ? (
                  <ContactRow icon={Clock} label="Hours" value={hours} />
                ) : null}
              </div>
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                  Visit website <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : phone ? (
                <a href={`tel:${phone}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                  Call now <Phone className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            {/* Trust panel */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Trust</p>
              <ul className="mt-5 grid gap-3 text-sm text-[var(--tk-muted)]">
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> Contact verified</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> Listed on {SITE_CONFIG.name}</li>
                <li className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> Community reviewed</li>
              </ul>
            </div>

            {/* Sidebar ad — exactly one on listing detail */}
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="w-full" />
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <div className="flex items-start gap-3 py-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-0.5 break-words text-[14px] font-medium text-[var(--tk-text)]">{value}</p>
      </div>
      {href ? <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--tk-muted)] transition duration-500 group-hover:text-[var(--tk-accent)]" /> : null}
    </div>
  )
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="group block first:pt-0">
        {inner}
      </a>
    )
  }
  return <div className="first:pt-0">{inner}</div>
}

/* -------------------------- PDF / Reference Library -------------------- */

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const category = categoryOf(post, 'Reference')
  const pages = getField(post, ['pages', 'pageCount'])
  const fileSize = getField(post, ['size', 'fileSize', 'filesize'])
  const format = getField(post, ['format', 'fileFormat']) || 'PDF'
  const uploader = getField(post, ['author', 'uploader', 'uploadedBy']) || SITE_CONFIG.name
  const lead = leadText(post)
  const insideList = getContent(post).sections
  const sections = Array.isArray(insideList) ? insideList.filter((s): s is string => typeof s === 'string').slice(0, 6) : []

  return (
    <>
      {/* Chip row top */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
        <div className="editable-glow pointer-events-none absolute inset-x-0 -top-20 h-96" aria-hidden="true" />
        <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 sm:py-24 lg:px-20 lg:py-32">
          <BackLink task="pdf" />
          <EditableReveal index={0}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Kicker task="pdf">Reference guide</Kicker>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                <FileText className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {format}
              </span>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                / {category}
              </span>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <h1 className="editable-display mt-10 max-w-5xl text-balance text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em]">
              {post.title}
            </h1>
          </EditableReveal>

          {lead ? (
            <EditableReveal index={2}>
              <blockquote className="editable-display mt-12 max-w-3xl border-l-2 border-[var(--tk-accent)] pl-6 text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)]">
                <span className="text-[var(--tk-accent)]">“</span>{lead}<span className="text-[var(--tk-accent)]">”</span>
              </blockquote>
            </EditableReveal>
          ) : null}

          <EditableReveal index={3}>
            <div className="mt-10 flex flex-wrap gap-3">
              {fileUrl ? (
                <>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                    Download {format} <Download className="h-4 w-4" />
                  </Link>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-medium text-[var(--tk-text)] transition duration-500 hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </Link>
                </>
              ) : null}
            </div>
          </EditableReveal>

          <EditableReveal index={4}>
            <div className="mt-14" style={{ gridColumn: 'span 4' }}>
              <QuickFactsStrip items={[
                ['Pages', pages, Layers],
                ['File size', fileSize, FileText],
                ['Format', format, Tag],
                ['Publisher', uploader, ShieldCheck],
              ]} />
            </div>
          </EditableReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 sm:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="min-w-0">
            {/* PDF iframe centerpiece */}
            {fileUrl ? (
              <EditableReveal index={0}>
                <div className="overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-5">
                    <span className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Live preview</span>
                    <Link href={fileUrl} target="_blank" rel="noreferrer" className="editable-mono inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                      Download <Download className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[85vh] w-full bg-[var(--tk-raised)]" />
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={1}>
              <h2 className="editable-display mt-16 text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.03em]">
                What&rsquo;s in this <span className="italic text-[var(--tk-accent)]">reference</span>.
              </h2>
            </EditableReveal>

            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <BodyContent post={post} />
              </div>
              <aside className="lg:pt-12">
                <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Quick summary</p>
                  <p className="mt-5 text-[15px] leading-7 text-[var(--tk-muted)]">
                    A {category?.toLowerCase() || 'reference'} guide — previewed above and available for download. Skim the sections in the sidebar, or open the file in a new tab for full-screen reading.
                  </p>
                </div>
              </aside>
            </div>

            <TagChips tags={tagsOf(post)} />

            {/* Article-bottom ad — exactly one on PDF detail */}
            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>

            {/* Repeated CTA — mirrors reference's "support-cta" band */}
            {fileUrl ? (
              <EditableReveal index={2}>
                <div className="mt-14 overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10 sm:p-14">
                  <div className="editable-glow pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true" />
                  <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Take it with you</p>
                  <h3 className="editable-display mt-5 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                    Grab the full <span className="italic text-[var(--tk-accent)]">{format}</span> to keep on your machine.
                  </h3>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                      Download {format} <Download className="h-4 w-4" />
                    </Link>
                    <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-medium text-[var(--tk-text)] transition duration-500 hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
                      Open in new tab <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </EditableReveal>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Identity block (icon glyph, no img) */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <div className="editable-display flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="editable-display mt-6 text-lg font-medium leading-snug tracking-[-0.02em]">{post.title}</h3>
              <div className="mt-6 divide-y divide-[var(--tk-line)] text-sm">
                <MetaRow label="Category" value={category} />
                {pages ? <MetaRow label="Pages" value={pages} /> : null}
                {fileSize ? <MetaRow label="File size" value={fileSize} /> : null}
                <MetaRow label="Publisher" value={uploader} />
                <MetaRow label="Format" value={format} />
              </div>
              {fileUrl ? (
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
                  Download <Download className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {/* What's inside */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ What&rsquo;s inside</p>
              <ul className="mt-5 grid gap-3 text-sm text-[var(--tk-muted)]">
                {(sections.length ? sections : ['Overview', 'Core sections', 'Reference tables', 'Notes and appendices']).map((s) => (
                  <li key={s} className="inline-flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--tk-accent)]" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <RelatedPdfStrip related={related} />
    </>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="editable-mono text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</span>
      <span className="text-right text-[14px] font-medium text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

/* Related references strip — glyphs only, no photography */
function RelatedPdfStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const theme = getTaskTheme('pdf')
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-panel-bg,var(--tk-surface))]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 sm:py-24 lg:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ More references</p>
            <h2 className="editable-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em]">More from the {theme.kicker.toLowerCase()}</h2>
          </div>
          <Link href={taskConfig?.route || '/pdf'} className="editable-mono inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const href = `${taskConfig?.route || '/pdf'}/${item.slug}`
            const size = getField(item, ['size', 'fileSize', 'filesize'])
            const cat = categoryOf(item, 'Reference')
            return (
              <Link key={item.id || item.slug} href={href} className="group flex h-full flex-col rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:border-[color:var(--tk-accent)]/40 hover:-translate-y-1">
                <div className="editable-display flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="editable-display mt-6 line-clamp-3 text-base font-medium leading-snug tracking-[-0.01em]">{item.title}</h3>
                <p className="editable-mono mt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                  / {cat}{size ? ` · ${size}` : ''}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Classified detail ------------------------- */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])

  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
            <Kicker task="classified">{categoryOf(post, 'Offer')}</Kicker>
            <h1 className="editable-display mt-6 text-[clamp(1.8rem,3vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">{post.title}</h1>
            <p className="editable-display mt-8 text-[clamp(2.2rem,4vw,3.4rem)] font-medium tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-8 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition duration-500 hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.slice(0, 4).map((image, i) => (
                <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full rounded-2xl border border-[var(--tk-line)] object-cover" />
              ))}
            </div>
          ) : null}
          <BodyContent post={post} />
          <TagChips tags={tagsOf(post)} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ---------------------------- Image detail ----------------------------- */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 sm:py-24 lg:px-20">
        <BackLink task="image" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-6 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, i) => (
              <figure key={`${image}-${i}`} className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">Visual story</Kicker>
            <h1 className="editable-display mt-8 text-[clamp(2.4rem,4vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.03em]">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <TagChips tags={tagsOf(post)} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* --------------------------- Bookmark detail --------------------------- */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 sm:py-24">
        <BackLink task="sbm" />
        <div className="editable-display mt-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm">Signal</Kicker></div>
        <h1 className="editable-display mt-6 text-[clamp(2.4rem,4vw,3.8rem)] font-medium leading-[1.04] tracking-[-0.03em]">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <TagChips tags={tagsOf(post)} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* --------------------------- Profile detail ---------------------------- */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 sm:py-24 lg:px-20">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-medium tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="editable-mono mt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">/ {role}</p> : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-sm font-medium text-[var(--tk-on-accent)] transition duration-500 hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
                {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2 text-sm font-medium transition duration-500 hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <TagChips tags={tagsOf(post)} />
            {images.length > 1 ? (
              <section className="mt-14">
                <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Gallery</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.slice(1, 7).map((image, i) => (
                    <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full rounded-xl border border-[var(--tk-line)] object-cover" />
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* -------------------------- Shared building blocks --------------------- */

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm">
      <span className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 sm:py-24 lg:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">/ Keep going</p>
            <h2 className="editable-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em]">
              More {theme.kicker.toLowerCase()}
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block h-full overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:border-[color:var(--tk-accent)]/40 hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><Camera className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-2 text-base font-medium leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
