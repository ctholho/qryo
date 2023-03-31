import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'


export default defineConfig({
  title: 'Qryo',
  description: 'Connect to CRUD APIs ... offline',
  lang: 'en-US',
  ignoreDeadLinks: true,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
  ],
  themeConfig: {
    logo: '/qryo_logo.svg',
    editLink: {
      pattern: 'https://github.com/akronym/qryo/tree/main/packages/:path',
      text: 'Edit this page with GitHub',
    },
    nav: [
     { text: 'API', link: '/qryo/' },
     { text: 'Guide', link: '/guide' },
    ],
    sidebar: [
      {
        items: [
          { text: 'Why', link: '/why' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Get started', link: '/get-started' },
          { text: 'Connect custom backend', link: '/connect-custom-backend' },
        ],
      },
      {
        text: 'Api',
        items: [
          { text: 'Qryo', link: '/qryo/' },
          { text: 'InDirectus', link: '/indirectus/' },
        ],
      }
    ],
    footer: {
      message: 'Released under the <a href="https://github.com/akronym/offline-crud/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2023-present <a href="https://github.com/orgs/akronym-org/dashboard">akronym</a> and all contributors'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/akronym/qryo' },
    ],
  },
  srcDir: '../packages',
  // rewrites: {
  //   '../packages/:pkg/src/(.*)': ':pkg/index.md'
  // },
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [
          resolve(__dirname, '..'),
        ],
      },
    },
    plugins: [
      // plugins
      UnoCSS(),
      Components({
        dirs: resolve(__dirname, './theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: '../docs/.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
      Icons({
        compiler: 'vue3',
        defaultStyle: 'display: inline-block',
      }),
    ],
  }
})
