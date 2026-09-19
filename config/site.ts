export const SiteConfig = {
  site: {
    name: 'My Site',
    title: 'My Site',
    description: '...',
  },

  seo: {
    title: {
      default: 'My Site',
      template: '%s | My Site',
    },
    description: '...',
    keywords: [],
    image: '/og-image.png',
  },

  appearance: {
    theme: 'system',

    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
    },

    favicon: {
      light: '/favicon-light.ico',
      dark: '/favicon-dark.ico',
    },
  },
}