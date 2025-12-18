<template>
  <v-app-bar
    class="px-8 force-ssr"
    color="secondary"
    elevation="6"
    floating
    rounded="b-xl"
  >
    <template #prepend>
      <NuxtLink
        :to="store.getUser ? '/map' : '/'"
        class="flex items-center"
      >
        <NuxtImg
          src="/images/logo.webp"
          alt="Better Maps"
          :draggable="false"
          height="40px"
          width="40px"
          sizes="40px"
          :placeholder="[10, 10, 50, 5]"
          preload
        />
      </NuxtLink>
    </template>
    <v-app-bar-title v-if="smAndUp">
      <NuxtLink
        :to="store.getUser ? '/map' : '/'"
        class="text-h6"
      >
        Better Maps
      </NuxtLink>
      <NuxtLink
        to="/admin"
      >
        <v-btn
          v-if="store.getUser?.role === 'admin'"
          icon="mdi-shield-account-outline"
          :variant="router.currentRoute.value.path === '/admin' ? 'outlined' : 'text'"
        />
      </NuxtLink>
    </v-app-bar-title>
    <v-app-bar-title v-else>
      <NuxtLink
        to="/admin"
      >
        <v-btn
          v-if="store.getUser?.role === 'admin'"
          icon="mdi-shield-account-outline"
          :variant="router.currentRoute.value.path === '/admin' ? 'outlined' : 'text'"
        />
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
        class="small-list"
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
      :icon="iconTheme"
      @click="toggleTheme"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
const router = useRouter()
const store = useMainStore()
const { toggleTheme } = useCustomTheme()
const { smAndUp } = useVDisplay()
const {
  t,
  locales,
  setLocale,
} = useI18n()

const i18nSwitch = ref(false)
const userLocale = computed(() => store.getI18n)
const accountIcon = ref("mdi-login")
const connected = computed(() => store.getUser !== null)
const accountText = computed(() => (connected.value
  ? t("navbar.disconnect")
  : t("navbar.connect")))
const iconTheme = computed(() => (store.getTheme === "light"
  ? "mdi-weather-night"
  : "mdi-weather-sunny"))

watch(connected, (value) => {
  accountIcon.value = value
    ? "mdi-logout"
    : "mdi-login"
})

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

async function handleConnect() {
  if (connected.value) {
    store.logout()
  }

  await navigateTo("/")
}
</script>

<style scoped>
.force-ssr {
  position: fixed;
  top: 0;
  left: 0;
  transform: translateY(0px);
  width: 100%;
}

.small-list :deep(.v-list-item__content) {
  min-width: 0px !important;
}

.small-list :deep(.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line) {
  padding-inline-end: 0px !important;
  padding-inline-start: 16px !important;
}
</style>
