export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
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
  runtimeConfig: {
    public: {
      country: process.env.COUNTRY,
    },
  },
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
  },
  compatibilityDate: "2025-05-01",
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
    css: {
      preprocessorOptions: {
        sass: {
          api: "modern-compiler",
        },
        scss: {
          api: "modern-compiler",
        },
      },
      preprocessorMaxWorkers: 4,
    },
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
  i18n: {
    baseUrl: "/",
    defaultLocale: process.env.DEFAULT_UI_LANG as "en" | "fr" | undefined,
    detectBrowserLanguage: {
      cookieKey: "i18n_lang",
      fallbackLocale: process.env.DEFAULT_UI_LANG as "en" | "fr" | undefined,
      useCookie: true,
    },
    experimental: {
      typedOptionsAndMessages: "all",
    },
    lazy: true,
    locales: [
      { code: "en", name: "English" },
      { code: "fr", name: "Français" },
    ],
    strategy: "no_prefix",
    vueI18n: './i18n.config.ts',
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
              accent: "#F5A249",
              background: "#020613",
              error: "#EE3124",
              info: "#53B9C8",
              primary: "#53B9C8",
              secondary: "#2646CB",
              success: "#50FA7B",
              text: "#F8F8F2",
              warning: "#F5A249",
            },
            dark: true,
          },
          light: {
            colors: {
              accent: "#FFB86C",
              background: "#DFDFD2",
              error: "#EE3124",
              info: "#379DAD",
              primary: "#379DAD",
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
