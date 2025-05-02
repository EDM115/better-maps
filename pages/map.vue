<template>
  <MapDisplay
    v-if="display"
    class="h-100 pa-4"
  />
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { computed, onMounted, ref } from "vue"

const store = useMainStore()
const router = useRouter()
const isUserLoggedIn = computed(() => !store.isUserEmpty)
const display = ref(false)

onMounted(() => {
  if (!isUserLoggedIn.value) {
    router.push("/")
  } else {
    display.value = true
  }
})
</script>
