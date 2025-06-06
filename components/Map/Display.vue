<template>
  <v-row v-if="smAndUp">
    <v-col cols="8">
      <v-card>
        <GoogleMap
          v-if="hasApiKey"
          ref="mapRef"
          :api-key="GOOGLE_MAPS_API_KEY ?? ''"
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
            :map-id="Number(mapId)"
            :icons="icons"
            @pin-selected="(pinId) => selectedPin = pinId"
          />
        </GoogleMap>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card class="pa-4">
        <MapSearch
          ref="mapSearchRef"
          :map="mapRef?.map"
          :center="center"
          :country="mapCountry"
          :icons="icons"
          @add-marker="(details) => mapPinRef?.addPin(details)"
          @update-marker="(details) => mapPinRef?.editPin(details)"
        />
        <MapPinsList
          :pins="mapPinRef?.pins || []"
          :edit-mode="mapSearchRef?.editMode"
          :selected-pin-id="selectedPin"
          :icons="icons"
          @edit="(pin) => mapSearchRef?.startEditing(pin)"
          @delete="(pin) => mapPinRef?.deletePin(pin)"
          @toggle-visibility="(pin) => mapPinRef?.togglePinVisibility(pin)"
        />
        <MapOptions
          :map="mapRef?.map"
          :show="mapShowTransit"
        />
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
            ref="mapSearchRef"
            :map="mapRef?.map"
            :center="center"
            :country="mapCountry"
            :icons="icons"
            @add-marker="(details) => mapPinRef?.addPin(details)"
            @update-marker="(details) => mapPinRef?.editPin(details)"
          />
        </v-list-item>
        <v-list-item>
          <MapPinsList
            :pins="mapPinRef?.pins || []"
            :edit-mode="mapSearchRef?.editMode"
            :selected-pin-id="selectedPin"
            :icons="icons"
            @edit="(pin) => mapSearchRef?.startEditing(pin)"
            @delete="(pin) => mapPinRef?.deletePin(pin)"
            @toggle-visibility="(pin) => mapPinRef?.togglePinVisibility(pin)"
          />
        </v-list-item>
        <v-list-item>
          <MapOptions
            :map="mapRef?.map"
            :show="mapShowTransit"
          />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card class="flex-grow-1">
      <GoogleMap
        v-if="hasApiKey"
        ref="mapRef"
        :api-key="GOOGLE_MAPS_API_KEY ?? ''"
        :map-id="mapId"
        :center="center"
        :zoom="zoom"
        style="width: 100%; height: 90vh"
        @map-loaded="mapRef = $event"
      >
        <MapPin
          ref="mapPinRef"
          :map="mapRef?.map"
          :center="center"
          :map-id="Number(mapId)"
          :icons="icons"
          @pin-selected="(pinId) => selectedPin = pinId"
        />
      </GoogleMap>
      <v-btn
        icon="mdi-menu"
        class="floating-btn"
        base-color="secondary"
        @click="drawer = !drawer"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { computed, onMounted, ref, watch } from "vue"
import { useDisplay } from "vuetify"
import { GoogleMap } from "vue3-google-map"

import type { Icon } from "./consts"

interface MapRef {
  map: google.maps.Map
}

type Props = {
  setHasLoaded?: (loaded: boolean)=> void
}

const props = defineProps<Props>()

const store = useMainStore()
const { smAndUp } = useDisplay()

const drawer = ref(false)
const mapRef = ref<MapRef>()
const mapPinRef = ref()
const mapSearchRef = ref()
const center = ref({ lat: 0, lng: 0 })
const zoom = ref(0)
const mapId = ref(String(0))
const translateX = ref("80vw")
const mapCountry = ref("")
const mapShowTransit = ref(false)
const selectedPin = ref<number | null>(null)
const icons = ref<Icon[]>([])

watch(drawer, (val) => {
  translateX.value = val ? "0" : "80vw"
})

const user = computed(() => store.getUser)

const hasApiKey = ref(false)
const GOOGLE_MAPS_API_KEY = ref<string | null>(null)

const fetchGoogleMapsApiKey = async (token: string) => {
  const response = await $fetch("/api/googleMaps", {
    headers: { Authorization: `Bearer ${token}` },
  })

  GOOGLE_MAPS_API_KEY.value = response.body.apiKey
  hasApiKey.value = true
}

const fetchMapData = async (userId: number | null) => {
  const response = await $fetch("/api/map", {
    headers: { Authorization: `Bearer ${user.value.token}` },
    query: { user_id: userId },
  })

  mapId.value = String(response.body.map.id)
  center.value = { lat: response.body.map.start_lat, lng: response.body.map.start_lng }
  zoom.value = response.body.map.start_zoom
  mapCountry.value = response.body.map.country
  mapShowTransit.value = response.body.map.show_transit
}

const fetchIcons = async () => {
  const response = await $fetch("/api/icon", {
    headers: { Authorization: `Bearer ${user.value.token}` },
  })

  icons.value = response.body.icons
}

watch(
  () => user.value,
  async (newUser) => {
    if (newUser && newUser.token) {
      await fetchGoogleMapsApiKey(newUser.token)
      await fetchMapData(newUser.id)
      await fetchIcons()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (!store.isUserEmpty) {
    await fetchGoogleMapsApiKey(store.getUser.token ?? "")
    await fetchMapData(store.getUser.id ?? null)
    await fetchIcons()
  }

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
