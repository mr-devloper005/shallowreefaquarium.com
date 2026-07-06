import type { CSSProperties } from 'react'

/*
  Ooto reference — dark surface, cyan accent, Outfit display + Geist Mono labels.
  Every downstream component consumes these tokens via CSS vars.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#0d0d0d',
  '--slot4-page-text': '#fcfdfc',
  '--slot4-panel-bg': '#141414',
  '--slot4-surface-bg': '#1e1e1e',
  '--slot4-raised-bg': '#242424',
  '--slot4-muted-text': '#c9cdca',
  '--slot4-soft-muted-text': '#8c8f8d',
  '--slot4-accent': '#07f1ce',
  '--slot4-accent-fill': '#07f1ce',
  '--slot4-accent-hover': '#2cf3d5',
  '--slot4-accent-soft': 'rgba(7,241,206,0.12)',
  '--slot4-on-accent': '#0d0d0d',
  '--slot4-accent-2': '#a984e0',
  '--slot4-accent-3': '#ff6e5f',
  '--slot4-dark-bg': '#0d0d0d',
  '--slot4-dark-text': '#fcfdfc',
  '--slot4-media-bg': '#1e1e1e',
  '--slot4-cream': '#1e1e1e',
  '--slot4-warm': '#141414',
  '--slot4-lavender': '#141414',
  '--slot4-gray': '#242424',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#0d0d0d',
  '--editable-page-text': '#fcfdfc',
  '--editable-container': '1500px',
  '--editable-border': 'rgba(252,253,252,0.14)',
  '--editable-border-strong': 'rgba(252,253,252,0.32)',
  '--editable-nav-bg': 'rgba(13,13,13,0.86)',
  '--editable-nav-text': '#fcfdfc',
  '--editable-nav-active': '#07f1ce',
  '--editable-nav-active-text': '#0d0d0d',
  '--editable-cta-bg': '#07f1ce',
  '--editable-cta-text': '#0d0d0d',
  '--editable-search-bg': '#1e1e1e',
  '--editable-footer-bg': '#0d0d0d',
  '--editable-footer-text': '#fcfdfc',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_0_rgba(255,255,255,0.03)]',
  shadowStrong: 'shadow-[0_28px_60px_-30px_rgba(7,241,206,0.35)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(13,13,13,0)_0%,rgba(13,13,13,0.86)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-8 lg:px-20',
    sectionY: 'py-16 sm:py-24 lg:py-32',
    sectionYTight: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    // Mono eyebrows/labels — Ooto's signature "code-like" chip
    eyebrow: 'editable-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]',
    // Huge Outfit display, tight -0.03em tracking, clamp scale
    heroTitle: 'font-medium leading-[1.02] tracking-[-0.03em] text-[clamp(2.6rem,6vw,5.4rem)]',
    sectionTitle: 'font-medium leading-[1.06] tracking-[-0.03em] text-[clamp(2rem,4vw,3.6rem)]',
    subTitle: 'font-medium leading-[1.12] tracking-[-0.02em] text-2xl sm:text-3xl',
    body: 'text-[15px] leading-relaxed text-[var(--slot4-muted-text)]',
    emphasis: 'italic text-[var(--slot4-accent)]',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl border border-white/10 ${editablePalette.darkBg} ${editablePalette.darkText}`,
    raised: `rounded-2xl border ${editablePalette.border} bg-[var(--slot4-raised-bg)]`,
  },
  button: {
    // Pill primary — cyan on dark
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-accent-hover)]',
    ghost:
      'inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 hover:text-[var(--slot4-accent)]',
  },
  badge: {
    pill: 'editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-transparent px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]',
    accentPill:
      'editable-mono inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl border ${editablePalette.border} ${editablePalette.mediaBg}`,
    frameFull: 'relative overflow-hidden rounded-3xl border border-white/10',
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:border-[var(--editable-border-strong)] hover:-translate-y-1',
    fade: 'transition duration-500 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change palette via editableRootStyle first; every downstream component consumes those CSS vars.',
  'Ooto identity: dark #0d0d0d bg, cyan #07f1ce accent, Outfit display, Geist Mono labels, pill buttons.',
  'Use editableDesignContract.type.eyebrow (mono) for kickers/labels; heroTitle for hero H1; sectionTitle for section H2.',
  'Wrap section headers + grid items in <EditableReveal index={i}> for staggered fade-up.',
  'Keep dynamic post fetching intact; use postHref() for all post links.',
] as const
