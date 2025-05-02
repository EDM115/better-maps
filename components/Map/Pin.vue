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
    <v-list :items="listPins" />
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
const listPins = ref<Array<{ title: string; value: number }>>(
  pins.value.map((pin) => ({
    title: pin.lat.toString(),
    value: pin.lng,
  }))
)

const addPin = (event: google.maps.MapMouseEvent) => {
  console.log("🚀 ~ addPin ~ event :", event)
  if (event.latLng) {
    pins.value.push({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
  }
}
</script>
