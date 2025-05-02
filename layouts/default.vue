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
import { useMainStore } from "~/stores/main"
import { onMounted } from "vue"
import { useTheme } from "vuetify"

useHead({
  title: "Better Maps",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "A quick way to add pin-points to a map, with details, filters and more. Made for my gf" },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/images/logo.png" }],
})

const store = useMainStore()
const vuetifyTheme = useTheme()

onMounted(() => {
  store.initStore()
  vuetifyTheme.global.name.value = store.getTheme
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
