<template>
  <v-row v-if="smAndUp">
    <v-col cols="8">
      <v-card>
        <GoogleMap
          v-if="isClient"
          ref="mapRef"
          :api-key="GOOGLE_MAPS_API_KEY ?? ''"
          :map-id="mapId"
          :center="center"
          :zoom="zoom"
          style="width: 100%; height: 85vh"
          @map-loaded="mapRef = $event"
        >
          <template v-if="mapRef?.map">
            <MapPin
              ref="mapPinRef"
              :map="mapRef.map"
              :center="center"
              :map-id="Number(mapId)"
              :icons="icons"
              @pin-selected="(pinId) => selectedPin = pinId"
            />
          </template>
        </GoogleMap>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card class="pa-4">
        <MapSearch
          v-if="mapRef?.map"
          ref="mapSearchRef"
          :map="mapRef.map"
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
          v-if="mapRef?.map"
          :map="mapRef.map"
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
            v-if="mapRef?.map"
            ref="mapSearchRef"
            :map="mapRef.map"
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
            v-if="mapRef?.map"
            :map="mapRef.map"
            :show="mapShowTransit"
          />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card class="flex-grow-1">
      <GoogleMap
        v-if="isClient"
        ref="mapRef"
        :api-key="GOOGLE_MAPS_API_KEY ?? ''"
        :map-id="mapId"
        :center="center"
        :zoom="zoom"
        style="width: 100%; height: 90vh"
        @map-loaded="mapRef = $event"
      >
        <template v-if="mapRef?.map">
          <MapPin
            ref="mapPinRef"
            :map="mapRef.map"
            :center="center"
            :map-id="Number(mapId)"
            :icons="icons"
            @pin-selected="(pinId) => selectedPin = pinId"
          />
        </template>
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
import { GoogleMap } from "vue3-google-map"

import type { Icon } from "./consts"

interface MapRef {
  map: google.maps.Map;
}

type Props = {
  initialMap: {
    id: number;
    start_lat: number;
    start_lng: number;
    start_zoom: number;
    country: string;
    show_transit: boolean;
  };
  initialIcons: Icon[];
}

const props = defineProps<Props>()

const { smAndUp } = useVDisplay()

const drawer = ref(false)
const mapRef = ref<MapRef>()
const mapPinRef = ref()
const mapSearchRef = ref()
const center = ref({
  lat: props.initialMap.start_lat,
  lng: props.initialMap.start_lng,
})
const zoom = ref(props.initialMap.start_zoom)
const mapId = ref(String(props.initialMap.id))
const translateX = ref("80vw")
const mapCountry = ref(props.initialMap.country)
const mapShowTransit = ref(props.initialMap.show_transit)
const selectedPin = ref<number | null>(null)
const icons = ref<Icon[]>([...props.initialIcons])

watch(drawer, (val) => {
  translateX.value = val
    ? "0"
    : "80vw"
})

const isClient = ref(false)
const GOOGLE_MAPS_API_KEY = ref<string | null>(null)

if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  GOOGLE_MAPS_API_KEY.value = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
}

onMounted(async () => {
  isClient.value = true
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
