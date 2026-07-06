import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Ooto reference — one shared dark visual language across every task.
  Only kicker/note copy varies per task. All --tk-* tokens track the
  root Ooto palette (cyan accent, dark surfaces, Outfit + Geist Mono).
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  fontMono: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const OOTO_DISPLAY = "'Outfit', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const OOTO_MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const base = {
  dark: true,
  fontDisplay: OOTO_DISPLAY,
  fontBody: OOTO_DISPLAY,
  fontMono: OOTO_MONO,
  bg: '#0d0d0d',
  surface: '#1e1e1e',
  raised: '#242424',
  text: '#fcfdfc',
  muted: '#c9cdca',
  line: 'rgba(252,253,252,0.14)',
  accent: '#07f1ce',
  accentSoft: 'rgba(7,241,206,0.12)',
  onAccent: '#0d0d0d',
  glow: 'rgba(7,241,206,0.28)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field Notes', note: 'Long-form essays, guides and stories worth your time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Discover, compare and connect with verified places nearby.' },
  classified: { ...base, kicker: 'Open Offers', note: 'Time-sensitive listings and offers, ready to act on.' },
  image: { ...base, kicker: 'Visual Index', note: 'A curated visual feed of standout galleries and images.' },
  sbm: { ...base, kicker: 'Signal Shelf', note: 'Bookmarks and resources worth keeping close.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable guides, reports and reference documents.' },
  profile: { ...base, kicker: 'Roster', note: 'Creators, businesses and profiles making it happen.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    '--editable-font-mono': t.fontMono,
    fontFamily: t.fontBody,
  } as CSSProperties
}
