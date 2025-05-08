<template>
  <div>
    <v-skeleton-loader
      v-if="!hasLoaded"
      type="image"
      class="h-100"
      style="background-color: rgb(var(--v-background-color));"
    />
    <MapDisplay
      v-show="hasLoaded"
      class="h-100 pa-4"
      :set-has-loaded="setHasLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { nextTick, onMounted, ref } from "vue"

const store = useMainStore()
const router = useRouter()
const hasLoaded = ref(false)

const setHasLoaded = (loaded: boolean) => {
  hasLoaded.value = loaded
}

onMounted(async () => {
  await nextTick()

  if (store.isUserEmpty) {
    router.push("/")
  }
})
</script>

<style>
.v-skeleton-loader__image {
  height: 80% !important;
  border-radius: 32px !important;
  margin: 1em !important;
}
</style>
