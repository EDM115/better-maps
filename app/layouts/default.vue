<template>
  <v-app :theme="theme">
    <NuxtRouteAnnouncer />
    <LayoutNavBar />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"

const i18nHead = useLocaleHead()
const {
  t,
  setLocale,
} = useI18n()
const store = useMainStore()
const { changeTheme } = useCustomTheme()

const theme = computed(() => store.getTheme)

useHead({
  title: t("main.title"),
  meta: [
    {
      name: "darkreader-lock",
      content: "true",
    },
    {
      name: "description", content: t("main.description"),
    },
  ],
  link: [
    {
      rel: "icon", type: "image/webp", href: "/images/logo.webp",
    },
  ],
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang ?? "fr",
    translate: "no",
  },
})

useSeoMeta({
  title: t("main.title"),
  ogTitle: t("main.title"),
  description: t("main.description"),
  ogDescription: t("main.description"),
  ogImage: "/images/logo.webp",
  ogType: "website",
  ogUrl: "https://maps.edm115.dev",
  ogLocale: "fr_FR",
})

onMounted(() => {
  if (localStorage.getItem("theme") === "light") {
    changeTheme("light")
  } else {
    changeTheme("dark")
  }

  store.initStore()
  setLocale(store.getI18n)
  polyfillCountryFlagEmojis()
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
