<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { computedAsync } from "@vueuse/core"
import { computed, ref } from "vue"
import { GoogleMap } from "vue3-google-map"

interface MapRef {
  map: google.maps.Map
}

const store = useMainStore()
const mapRef = ref<MapRef>()
const center = ref({ lat: 49.4290201, lng: 1.104705 })
const zoom = ref(12.25)
const mapId = "MAP_ID"

const user = computed(() => store.getUser)

const GOOGLE_MAPS_API_KEY = computedAsync(async () => {
  const response = await $fetch("/api/googleMaps", {
    headers: { Authorization: `Bearer ${user.value.token}` },
  })

  return response.body.apiKey
})
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-card>
        <GoogleMap
          v-if="GOOGLE_MAPS_API_KEY"
          ref="mapRef"
          :api-key="GOOGLE_MAPS_API_KEY"
          :map-id="mapId"
          :center="center"
          :zoom="zoom"
          style="width: 100%; height: 80vh"
        >
          <slot />
        </GoogleMap>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card class="pa-4">
        <MapSearch
          :map="mapRef?.map"
          :center="center"
        />
        <MapTransportation :map="mapRef?.map" />
        <MapPin
          :map="mapRef?.map"
          :center="center"
        />
      </v-card>
    </v-col>
  </v-row>
</template>
