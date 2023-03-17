const apiUrl = 'https://8055-' + process.env.WORKSPACE_HOST
const appUrl = 'https://3000-' + process.env.WORKSPACE_HOST
const appHost = '3000-' + process.env.WORKSPACE_HOST

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: true,
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
      // strictPort: true,
      hmr: false,
      // Configure Vite for HMR with Gitpod.
      // hmr: process.env.GITPOD_WORKSPACE_URL
      //   ? {
      //       // Due to port fowarding, we have to replace
      //       // 'https' with the forwarded port, as this
      //       // is the URI created by Gitpod.
      //       host: process.env.GITPOD_WORKSPACE_URL.replace("https://", "3000-"),
      //       protocol: "wss",
      //       clientPort: 443,
      //       port: 443,
      //     }
      //   : true
    }
  }
})

/*

wscat -c "wss://3000-ctholho-offlinefirstcru-rulkb0h478u.ws-eu90.gitpod.io"

wscat -c "ws://localhost:24678"

*/