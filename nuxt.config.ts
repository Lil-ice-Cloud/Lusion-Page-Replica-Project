// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-08',

  // Opt into Nuxt 4 behaviour (app/ as srcDir, new fetch/data defaults, etc.)
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',
  spaLoadingTemplate: 'spa-loading-template.html',
  devtools: { enabled: true },

  // CSS lives under app/assets/ now — Nuxt resolves ~ from srcDir (app/)
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Bebas+Neue&family=Barlow:wght@300;400&display=swap',
        },
      ],
    },
  },

  vite: {
    server: {
      allowedHosts: true,
    }
  },

  modules: ['@tresjs/nuxt'],
})