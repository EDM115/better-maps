<template>
  <v-app-bar
    class="px-8"
    color="secondary"
    elevation="6"
    floating
    rounded="b-xl"
  >
    <template #prepend>
      <NuxtLink
        to="/"
        class="flex items-center"
      >
        <NuxtImg
          src="/images/logo.webp"
          alt="Better Maps"
          :draggable="false"
          height="40px"
          width="40px"
          preload
        />
      </NuxtLink>
    </template>
    <v-app-bar-title v-if="smAndUp">
      <NuxtLink
        to="/"
        class="text-h6"
      >
        Better Maps
      </NuxtLink>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
      v-if="connected"
      :prepend-icon="smAndUp ? accountIcon : undefined"
      :icon="smAndUp ? undefined : accountIcon"
      :text="smAndUp ? accountText : undefined"
      variant="outlined"
      @click="handleConnect"
    />
    <v-menu
      open-on-click
      open-on-focus
      open-on-hover
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-translate"
          @mouseleave="i18nSwitch = false"
          @mouseover="i18nSwitch = true"
        >
          <div v-if="i18nSwitch">
            {{ getFlagEmoji(userLocale) }}
          </div>
          <div v-else>
            <v-icon icon="mdi-translate" />
          </div>
        </v-btn>
      </template>
      <v-list
        @mouseleave="i18nSwitch = false"
        @mouseover="i18nSwitch = true"
      >
        <v-list-item
          v-for="l in locales"
          :key="l.name"
          :active="l.code === userLocale"
          :title="getFlagEmoji(l.code)"
          @click="switchLocale(l.code)"
        />
      </v-list>
    </v-menu>
    <v-btn
      id="animateTheme"
      :icon="iconTheme"
      @click="toggleTheme"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useI18n } from "#imports"
import { useMainStore } from "~/stores/main"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

const router = useRouter()
const store = useMainStore()
const vuetifyTheme = useTheme()

const { t, locales, setLocale } = useI18n()
const i18nSwitch = ref(false)
const userLocale = computed(() => store.getI18n)

const accountIcon = ref("mdi-login")
const accountText = computed(() => (store.isUserEmpty ? t("navbar.connect") : t("navbar.disconnect")))
const connected = computed(() => !store.isUserEmpty)
const theme = ref(store.getTheme)
const iconTheme = computed(() => (vuetifyTheme.name.value === "light" ? "mdi-weather-night" : "mdi-weather-sunny"))

const { smAndUp } = useDisplay()

watch(connected, (value) => {
  accountIcon.value = value ? "mdi-logout" : "mdi-login"
})

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark"
  store.setTheme(theme.value)
  vuetifyTheme.global.name.value = theme.value
}

const switchLocale = (newLocale: "fr" | "en") => {
  setLocale(newLocale)
  store.setI18n(newLocale)
}

const getFlagEmoji = (l: string): string => {
  switch (l) {
    case "en":
      return "🇺🇸"
    case "fr":
      return "🇫🇷"
    default:
      return "🌐"
  }
}

onMounted(() => {
  store.setTheme(store.getTheme)
  vuetifyTheme.global.name.value = store.getTheme
  switchLocale(store.getI18n)
})

function handleConnect() {
  if (connected.value) {
    store.logout()
  }
  router.push("/")
}
</script>

<style scoped>
#animateTheme:focus {
  animation: spin 0.5s ease-in-out 0s 1;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
