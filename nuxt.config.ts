export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "vuetify-nuxt-module",
  ],
  ssr: false,
  devtools: {
    enabled: true,
    timeline: { enabled: true },
    vueDevTools: true,
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  css: [ "~/assets/styles/main.scss" ],
  sourcemap: {
    client: false,
    server: false,
  },
  devServer: {
    port: 8888,
  },
  future: {
    typescriptBundlerResolution: true,
  },
  experimental: {
    asyncContext: true,
    buildCache: true,
    clientFallback: true,
    clientNodeCompat: true,
    crossOriginPrefetch: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: { interaction: true, visibility: false },
      },
    },
    normalizeComponentNames: true,
    sharedPrerenderData: true,
    typedPages: true,
    viewTransition: true,
    writeEarlyHints: true,
  },
  compatibilityDate: "2024-11-01",
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    minify: true,
    rollupConfig: {
      output: {
        compact: true,
        validate: true,
      },
    },
  },
  vite: {
    clearScreen: false,
  },
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      autoInit: false,
      standalone: false,
    },
  },
  vuetify: {
    /* moduleOptions: {
      styles: {
        configFile: "~/assets/styles/main.scss",
      },
    }, */
    vuetifyOptions: {
      labComponents: true,
      locale: {
        fallback: "en",
        locale: "fr",
      },
      localeMessages: [ "en", "fr" ],
      theme: {
        defaultTheme: "dark",
        themes: {
          dark: {
            colors: {
              accent: "#53B9C8",
              background: "#020613",
              error: "#EE3124",
              info: "#53B9C8",
              primary: "#EE3124",
              secondary: "#2646CB",
              success: "#50FA7B",
              text: "#F8F8F2",
              warning: "#F5A249",
            },
            dark: true,
          },
          light: {
            colors: {
              accent: "#379DAD",
              background: "#DFDFD2",
              error: "#EE3124",
              info: "#379DAD",
              primary: "#EE3124",
              secondary: "#803EDF",
              success: "#3CD863",
              text: "#070B1A",
              warning: "#FFB86C",
            },
            dark: false,
          },
        },
      },
    },
  },
})
