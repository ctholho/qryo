// import prefetchPlugin from '@akronym/vite-plugin-qryo'

let apiUrl = 'http://localhost:8055'
let appUrl = 'http://localhost:3000'

// using gitpod
if (process.env.WORKSPACE_HOST) {
  apiUrl = 'https://8055-' + process.env.WORKSPACE_HOST
  appUrl = 'https://3000-' + process.env.WORKSPACE_HOST
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  telemetry: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiUrl,
      appUrl,
    }
  },
  vite: {
    plugins: [
      // prefetchPlugin(),
    ],
    server: {
      // strictPort: true,
      hmr: true,
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
