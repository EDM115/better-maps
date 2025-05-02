<template>
  <div>
    <v-btn
      color="primary"
      @click="() => props.map?.addListener('click', addPin)"
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

<script setup lang="ts">
import { ref } from "vue"
import { AdvancedMarker } from "vue3-google-map"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
}

const props = defineProps<Props>()
const pins = ref<Array<{ lat: number; lng: number }>>([])

const addPin = (event: google.maps.MapMouseEvent) => {
  if (event.latLng) {
    pins.value.push({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
  }
}
</script>
