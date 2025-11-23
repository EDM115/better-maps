export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-svgo",
    "vuetify-nuxt-module",
  ],
  ssr: true,
  devtools: {
    enabled: false,
    timeline: { enabled: false },
  },
  app: {
    pageTransition: {
      name: "page", mode: "out-in",
    },
  },
  css: ["~/assets/styles/main.scss"],
  runtimeConfig: {
    "public": {
      country: process.env.COUNTRY,
      startingPoint: process.env.STARTING_POINT,
    },
  },
  sourcemap: {
    client: true,
    server: true,
  },
  devServer: {
    port: 8888,
  },
  future: { typescriptBundlerResolution: true },
  experimental: {
    asyncContext: true,
    browserDevtoolsTiming: true,
    buildCache: true,
    clientFallback: true,
    clientNodeCompat: true,
    crossOriginPrefetch: true,
    defaults: { nuxtLink: {
      prefetch: true,
      prefetchOn: {
        interaction: true, visibility: false,
      },
    } },
    entryImportMap: true,
    extractAsyncDataHandlers: true,
    inlineRouteRules: true,
    normalizeComponentNames: true,
    parseErrorData: true,
    sharedPrerenderData: true,
    typedPages: true,
    typescriptPlugin: true,
    viewTransition: true,
    viteEnvironmentApi: true,
  },
  compatibilityDate: "2025-10-15",
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    esbuild: { options: { target: "esnext" } },
    minify: true,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
      cssMinify: "lightningcss",
    },
    clearScreen: false,
    css: {
      preprocessorMaxWorkers: true,
    },
  },
  typescript: {
    tsConfig: { compilerOptions: {
      allowArbitraryExtensions: true,
      disableSizeLimit: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      incremental: true,
      noErrorTruncation: true,
      preserveWatchOutput: true,
      removeComments: true,
    } },
    typeCheck: false,
  },
  eslint: { config: {
    autoInit: false,
    standalone: false,
  } },
  fonts: {
    defaults: {
      preload: true,
      subsets: ["latin"],
      weights: ["300 700"],
    },
    devtools: false,
    processCSSVariables: true,
    provider: "google",
  },
  i18n: {
    baseUrl: "/",
    // oxlint-disable-next-line no-unsafe-type-assertion
    defaultLocale: process.env.DEFAULT_UI_LANG as "en" | "fr" | undefined,
    detectBrowserLanguage: {
      // oxlint-disable-next-line no-unsafe-type-assertion
      fallbackLocale: process.env.DEFAULT_UI_LANG as "en" | "fr" | undefined,
      useCookie: false,
    },
    experimental: { typedOptionsAndMessages: "all" },
    locales: [
      {
        code: "en", name: "English", language: "en-US",
      },
      {
        code: "fr", name: "Français", language: "fr-FR",
      },
    ],
    strategy: "no_prefix",
  },
  image: { quality: 100 },
  svgo: {
    autoImportPath: "./public/images",
    defaultImport: "component",
    dts: true,
    svgoConfig: { multipass: true },
  },
  vuetify: {
    moduleOptions: {
      prefixComposables: true,
      ssrClientHints: {
        reloadOnFirstRequest: true,
        viewportSize: true,
        prefersColorScheme: true,
        prefersColorSchemeOptions: { cookieName: "theme" },
      },
    },
    vuetifyOptions: {
      directives: true,
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
