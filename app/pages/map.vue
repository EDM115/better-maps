<template>
  <div>
    <v-skeleton-loader
      v-if="pending || !data"
      type="image"
      class="h-100"
      style="background-color: rgb(var(--v-background-color));"
    />
    <MapDisplay
      v-else
      class="h-100 pa-4"
      :initial-map="data.map"
      :initial-icons="data.icons"
    />
  </div>
</template>

<script setup lang="ts">
const store = useMainStore()

if (store.isUserEmpty) {
  await navigateTo("/", { redirectCode: 302 })
}

const {
  data, pending,
} = await useAsyncData("map-page-data", async () => {
  const token = store.getUser?.token
  const userId = store.getUser?.id

  if (!token || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const [ mapResponse, iconsResponse ] = await Promise.all([
    $fetch("/api/map", {
      headers: { Authorization: `Bearer ${token}` },
      query: { user_id: userId },
    }),
    $fetch("/api/icon", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])

  return {
    map: mapResponse.body.map,
    icons: iconsResponse.body.icons,
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
