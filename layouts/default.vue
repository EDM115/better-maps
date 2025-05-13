<template>
  <v-app>
    <v-main>
      <NuxtRouteAnnouncer />
      <LayoutNavBar />
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useI18n, useLocaleHead } from "#imports"
import { useMainStore } from "~/stores/main"
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"
import { onMounted } from "vue"
import { useTheme } from "vuetify"

const i18nHead = useLocaleHead()
const { t, setLocale } = useI18n()

useHead({
  title: t("main.title"),
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: t("main.description") },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/images/logo.png" }],
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
})

useSeoMeta({
  title: t("main.title"),
  ogTitle: t("main.title"),
  description: t("main.description"),
  ogDescription: t("main.description"),
  ogImage: "/images/logo.png",
  ogUrl: "https://maps.edm115.dev",
  ogLocale: "fr_FR",
})

polyfillCountryFlagEmojis()

const store = useMainStore()
const vuetifyTheme = useTheme()

onMounted(() => {
  store.initStore()
  store.setTheme(store.getTheme)
  vuetifyTheme.global.name.value = store.getTheme
  setLocale(store.getI18n)
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  filter: blur(0.5rem);
  opacity: 0;
  transform: translateY(-20px);
}
</style>
