import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px] lg:p-12">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.4)_0%,rgba(13,13,13,0.92)_100%)]" />
        <div className="editable-glow pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70" aria-hidden="true" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={dc.badge.accentPill}>/ {label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-[clamp(2.2rem,4vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.03em] text-white">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/70 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent-hover)]">
            Read story <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[16/10] border-0`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
        <span className="editable-mono absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={dc.type.eyebrow}>/ {getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-4 line-clamp-3 text-xl font-medium leading-snug tracking-[-0.02em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 130)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
          Read <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="editable-mono flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)] text-xs text-[var(--slot4-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={dc.type.eyebrow}>/ {getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-lg font-medium leading-snug tracking-[-0.02em] ${pal.panelText}`}>
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] border-0 sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-6">
        <p className={dc.type.eyebrow}>/ Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-medium leading-tight tracking-[-0.02em] ${pal.panelText} sm:text-3xl`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[15px] leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent)]">
          Open article <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
