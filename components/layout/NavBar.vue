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
        <v-img
          src="/images/logo.webp"
          alt="Better Maps"
          :draggable="false"
          min-height="40"
          max-height="40"
          min-width="40"
          max-width="40"
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
    <!-- <v-btn
      :prepend-icon="accountIcon"
      :text="accountText"
      variant="tonal"
      @click="handleConnect"
    /> -->
    <v-btn
      id="animateTheme"
      :icon="iconTheme"
      @click="toggleTheme"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useMainStore } from "~/stores/main"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

const router = useRouter()
const store = useMainStore()
const vuetifyTheme = useTheme()

const accountIcon = ref("mdi-login")
// const accountText = computed(() => (store.getUser ? "Déconnexion" : "Connexion"))
// const connected = computed(() => store.getUser)
const theme = ref(store.getTheme)
const iconTheme = computed(() => (vuetifyTheme.name.value === "light" ? "mdi-weather-night" : "mdi-weather-sunny"))

const { smAndUp } = useDisplay()

/* watch(connected, (value) => {
  accountIcon.value = value ? "mdi-logout" : "mdi-login"
}) */

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark"
  store.setTheme(theme.value)
  vuetifyTheme.global.name.value = theme.value
}

onMounted(() => {
  store.setTheme(store.getTheme)
  vuetifyTheme.global.name.value = store.getTheme
})

/* function handleConnect() {
  if (connected.value) {
    store.logout()
    router.push("/")
  } else {
    router.push("/login")
  }
} */
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
