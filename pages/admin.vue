<template>
  <v-container class="flex-column justify-center h-100">
    <v-row
      align="center"
      align-content="center"
      justify="center"
      :class="[smAndUp ? 'flex-row' : 'flex-column', 'h-100']"
    >
      <v-col
        align="center"
        class="align-content-center"
      >
        <AdminSettings />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useMainStore } from "~/stores/main"
import { nextTick, onMounted } from "vue"
import { useDisplay } from "vuetify"

const store = useMainStore()
const router = useRouter()
const { smAndUp } = useDisplay()

onMounted(async () => {
  await nextTick()

  if (store.isUserEmpty || (!store.isUserEmpty && store.getUser.role !== "admin")) {
    router.push("/")
  }
})
</script>
