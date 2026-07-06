import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Local directory & reference library`,
      description: 'A local directory and a reference library, held together by one clean rhythm. Discover places, download the guides that explain them.',
      openGraphTitle: `${slot4BrandConfig.siteName} — Local directory & reference library`,
      openGraphDescription: 'Discover verified local entries and downloadable references through one connected surface.',
      keywords: ['local directory', 'reference library', 'places nearby', 'downloadable guides', 'discovery'],
    },
    hero: {
      badge: `Live on ${slot4BrandConfig.siteName}`,
      title: ['A calmer way', `to discover ${slot4BrandConfig.siteName}.`],
      description: 'One connected surface for verified local entries and downloadable reference material — find a place, download the guide that explains it.',
      primaryCta: { label: 'Explore directory', href: '/listing' },
      secondaryCta: { label: 'Reference library', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, references…',
      focusLabel: 'Focus',
      featureCardBadge: 'now trending',
      featureCardTitle: 'The latest entry from the directory.',
      featureCardDescription: 'Newest entries stay at the front of the experience without disturbing the underlying data flow.',
    },
    intro: {
      badge: 'About the platform',
      title: 'Built for reading, browsing and connecting different kinds of content.',
      paragraphs: [
        'This site pairs a local directory with a reference library so entries and the guides that explain them live in the same place.',
        'Instead of separating discovery from reading, the platform keeps them side-by-side with consistent navigation and easier exploration.',
        'Whether you start with a listing or a reference guide, you can keep discovering related content without friction.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Directory entries paired with reference guides that explain them.',
        'Connected sections for local records, references, and roster profiles.',
        'A cleaner browsing rhythm designed to make exploration feel easier.',
        'Lightweight interactions that keep the experience fast and readable.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listing' },
      secondaryLink: { label: 'Open the reference shelf', href: '/pdf' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'A single surface for every place, listing and reference guide worth keeping.',
      description: 'Move between the directory and the reference library without breaking your rhythm.',
      primaryCta: { label: 'Explore directory', href: '/listing' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest entries in this section.',
    },
  },
  about: {
    badge: '/ Our story',
    title: 'A calmer, clearer way to explore places and references.',
    description: `${slot4BrandConfig.siteName} is a local directory and a reference library, sharing one clean rhythm. It exists to make discovery feel less like a search-engine result and more like a well-kept shelf.`,
    paragraphs: [
      'Directories that only list phone numbers get old fast. We keep every local entry next to the guide that explains what it does, so decisions get easier.',
      'Reference material shouldn’t hide behind a download button either — every guide previews inline so you know what you’re getting before it lands on your machine.',
    ],
    values: [
      {
        title: 'Verified over verbose',
        description: 'We prioritise verified details — address, hours, contact — over marketing copy, so entries stay useful long after they publish.',
      },
      {
        title: 'Directory + library',
        description: 'A local entry can hand you the guide that explains it. That pairing is the whole point of the platform.',
      },
      {
        title: 'Reading-first pace',
        description: 'We focus on clean navigation, quiet metadata, and a calmer reading rhythm — not endless carousels.',
      },
    ],
  },
  contact: {
    eyebrow: `/ Contact ${slot4BrandConfig.siteName}`,
    title: 'A support page routed through the right lane, not one generic bucket.',
    description: 'Tell us what you are trying to submit, correct, or launch. We will route it through the right lane instead of forcing every request into the same support inbox.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search local entries, reference material, and topics across the site.',
    },
    hero: {
      badge: '/ Search the platform',
      title: 'Find local entries, references and topics faster.',
      description: 'Use keywords, categories and content types to search every active section of the site.',
      placeholder: 'Search by keyword, topic, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit new content — a local entry or reference guide.',
    },
    locked: {
      badge: '/ Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'Use your account to open the submission workspace and add a local record or reference guide to the platform.',
    },
    hero: {
      badge: '/ Submission workspace',
      title: 'Add an entry to the platform.',
      description: 'Choose what you are submitting, add the details, and prepare a clean record with links, summary and body content.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: '/ Member access',
      title: 'Welcome back to your workspace.',
      description: 'Sign in to continue browsing, managing submissions, and adding new entries to the platform.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Get started',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: '/ Get started',
      title: 'Create your account and start contributing.',
      description: 'Create an account to open the submission workspace and add entries or reference material to the platform.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More reading',
      fallbackTitle: 'Entry details',
    },
    listing: {
      relatedTitle: 'More directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Visual details',
    },
    profile: {
      relatedTitle: 'Suggested reading',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
