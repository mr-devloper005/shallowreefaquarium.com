import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Local directory · Reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local directory · Reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Search', href: '/search' },
    },
  },
  footer: {
    tagline: 'A local directory and reference library, held together by one clean rhythm.',
    description: `${slot4BrandConfig.siteName} keeps places nearby and the guides that explain them side-by-side — a directory next to a reference shelf, one connected surface.`,
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listing' },
          { label: 'Reference Library', href: '/pdf' },
          { label: 'Field Notes', href: '/article' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'One clean surface for places and references.',
  },
  commonLabels: {
    readMore: 'Read',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
