<script setup lang="ts">
import { ref, inject, type Ref } from "vue"
import { AdvancedMarker } from "vue3-google-map"

interface MapRef {
  map: google.maps.Map
}

const pins = ref<Array<{ lat: number; lng: number }>>([])
const mapRef = inject<Ref<MapRef>>("map")
const center = inject<Ref<{ lat: number; lng: number }>>("center")

const addPin = (event: google.maps.MapMouseEvent) => {
  if (event.latLng) {
    pins.value.push({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
  }
}

</script>

<template>
  <div>
    <v-btn
      color="primary"
      @click="() => mapRef?.map?.addListener('click', addPin)"
    >
      Add Pins
    </v-btn>
    <AdvancedMarker
      v-for="(pin, index) in pins"
      :key="index"
      :options="{ position: pin }"
    />
  </div>
</template>
