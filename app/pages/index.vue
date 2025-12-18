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
        <NuxtImg
          src="/images/logo.webp"
          sizes="500px sm:70svw lg:500px"
          alt="Better Maps"
          :draggable="false"
          :placeholder="[150, 150, 50, 5]"
          preload
        />
      </v-col>
      <v-col align="center">
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { smAndUp } = useVDisplay()

const store = useMainStore()

onMounted(async () => {
  if (store.getUser !== null) {
    await navigateTo("/map", { redirectCode: 302 })
  }
})
</script>
