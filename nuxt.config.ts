export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui"
  ],
  devtools: {
    enabled: true,
    timeline: { enabled: true },
    vueDevTools: true
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  css: [ "~/assets/styles/main.scss" ],
  devServer: {
    port: 8888
  },
  future: {
    typescriptBundlerResolution: true
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
        prefetchOn: { interaction: true, visibility: false }
      }
    },
    normalizeComponentNames: true,
    sharedPrerenderData: true,
    typedPages: true,
    viewTransition: true,
    writeEarlyHints: true
  },
  compatibilityDate: "2024-11-01",
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true
    },
    esbuild: {
      options: {
        target: "esnext"
      }
    },
    minify: true,
    rollupConfig: {
      output: {
        compact: true,
        /* manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.split("node_modules/").pop()?.split("/")[0]
          }

          return id.toString().split("/")[0]
        }, */
        validate: true
      }
    }
  },
  vite: {
    clearScreen: false
  },
  typescript: {
    typeCheck: true
  },
  eslint: {
    config: {
      autoInit: false,
      standalone: false
    }
  }
})
