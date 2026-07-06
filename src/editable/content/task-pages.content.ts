import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field Notes',
    headline: 'Long-form reading with a calmer editorial pace.',
    description: 'Essays, guides and explainers that step outside the noise. Slow reads, worth the scroll.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading first — everything else is grouped so it stays out of the way.',
    chips: ['Editorial rhythm', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Open Offers',
    headline: 'Time-sensitive listings you can act on today.',
    description: 'Practical, fast-moving posts — priced, dated and ready to move.',
    filterLabel: 'Filter offers',
    secondaryNote: 'Optimised for urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Priced', 'Actionable'],
  },
  sbm: {
    eyebrow: 'Signal Shelf',
    headline: 'Curated links, tools and resources worth keeping close.',
    description: 'A calm reading list — websites, references, and resources sorted for return visits.',
    filterLabel: 'Filter shelf',
    secondaryNote: 'Curated resources with grouping and quiet metadata.',
    chips: ['Curated', 'Reference-first', 'Return-worthy'],
  },
  profile: {
    eyebrow: 'Roster',
    headline: 'The people, teams and studios behind what you see.',
    description: 'Discover creators, businesses and profiles with the context that helps you decide.',
    filterLabel: 'Filter roster',
    secondaryNote: 'Identity and credibility, visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Creator + business'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Downloadable guides, reports and reference material.',
    description: 'A shelf of references — each previewed inline, with quick facts and a straight-line download.',
    filterLabel: 'Filter references',
    secondaryNote: 'Every entry previewed inline before you download.',
    chips: ['Inline preview', 'Guides + reports', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Verified local places, ready when you are.',
    description: 'Every entry with hours, contact, location and the context you need before you walk in.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Location, hours, and verified details up front.',
    chips: ['Verified', 'Local-first', 'Ready to visit'],
  },
  image: {
    eyebrow: 'Visual Index',
    headline: 'Image posts, sequenced for slow scrolling.',
    description: 'A gallery-led feed with room for context — visual first, note second.',
    filterLabel: 'Filter gallery',
    secondaryNote: 'Let the image carry the page before the text arrives.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
