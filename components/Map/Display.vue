<template>
  <v-row v-if="smAndUp">
    <v-col cols="8">
      <v-card>
        <GoogleMap
          v-if="GOOGLE_MAPS_API_KEY"
          ref="mapRef"
          :api-key="GOOGLE_MAPS_API_KEY"
          :map-id="mapId"
          :center="center"
          :zoom="zoom"
          style="width: 100%; height: 85vh"
          @map-loaded="mapRef = $event"
        >
          <MapPin
            ref="mapPinRef"
            :map="mapRef?.map"
            :center="center"
          />
        </GoogleMap>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card class="pa-4">
        <MapSearch
          :map="mapRef?.map"
          :center="center"
          @add-marker="(details) => mapPinRef?.addPin(details)"
        />
        <MapPinsList :pins="mapPinRef?.pins || []" />
        <MapTransportation :map="mapRef?.map" />
      </v-card>
    </v-col>
  </v-row>

  <div
    v-else
    class="d-flex"
  >
    <v-navigation-drawer 
      v-model="drawer"
      location="right"
      temporary
      floating
      mobile
      :style="{ width: '80vw', transform: 'translateX(' + translateX + ')' }"
    >
      <v-list>
        <v-list-item>
          <MapSearch
            :map="mapRef?.map"
            :center="center"
          />
        </v-list-item>
        <v-list-item>
          <MapTransportation :map="mapRef?.map" />
        </v-list-item>
        <v-list-item>
          <MapPin
            :map="mapRef?.map"
            :center="center"
          />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card class="flex-grow-1">
      <GoogleMap
        v-if="GOOGLE_MAPS_API_KEY"
        ref="mapRef"
        :api-key="GOOGLE_MAPS_API_KEY"
        :center="center"
        :zoom="zoom"
        :map-id="mapId"
        style="width: 100%; height: 90vh"
        @map-loaded="mapRef = $event"
      />
      <v-btn
        icon="mdi-menu"
        class="floating-btn"
        @click="drawer = !drawer"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { computedAsync } from "@vueuse/core"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay } from "vuetify"
import { GoogleMap } from "vue3-google-map"

interface MapRef {
  map: google.maps.Map
}

type Props = {
  setHasLoaded?: (loaded: boolean) => void
}

const props = defineProps<Props>()

const store = useMainStore()
const config = useRuntimeConfig()
const { smAndUp } = useDisplay()

const [ latitude, longitude, zoomLevel ] = config.public.startingPoint.split(",").map(Number)

const drawer = ref(false)
const mapRef = ref<MapRef>()
const mapPinRef = ref()
const center = ref({ lat: latitude, lng: longitude })
const zoom = ref(zoomLevel)
const mapId = "MAP_ID"
const translateX = ref("80vw")

watch(drawer, val => {
  translateX.value = val ? '0' : '80vw'
})

const user = computed(() => store.getUser)

const GOOGLE_MAPS_API_KEY = computedAsync(async () => {
  const response = await $fetch("/api/googleMaps", {
    headers: { Authorization: `Bearer ${user.value.token}` },
  })

  return response.body.apiKey
})

onMounted(() => {
  if (props.setHasLoaded) {
    props.setHasLoaded(true)
  }
})
</script>

<style>
.floating-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}
</style>
