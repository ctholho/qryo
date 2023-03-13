const apiUrl = 'https://8055-' + process.env.WORKSPACE_HOST
const appUrl = 'https://3000-' + process.env.WORKSPACE_HOST
const appHost = '3000-' + process.env.WORKSPACE_HOST

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-directus',
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiUrl,
      appUrl,
    }
  },
  directus: {
    url: apiUrl,
  },
  vite: {
    server: {
      hmr: {
        protocol: 'wss',
        host: appHost,
      }
    }
  }
})
