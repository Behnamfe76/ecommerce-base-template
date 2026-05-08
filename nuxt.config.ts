// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    '@nuxt/hints',
    '@nuxt/devtools',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxt/a11y'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  hints: {
    devtools: true,

    // Enable or configure individual features
    // if you feel overwhelmed by logs, you can disable some features and fix things step by step.
    features: {
      // Defaults to true for each feature
      hydration: true
    }
  },

  i18n: {
    strategy: 'no_prefix',
    langDir: 'locales',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'en',
        dir: 'ltr',
        file: 'en.ts',
        language: 'en-US',
        name: 'English'
      },
      {
        code: 'fa',
        dir: 'rtl',
        file: 'fa.ts',
        language: 'fa-IR',
        name: 'فارسی'
      }
    ]
  }
})
