<template>
  <div>
    <AdvancedMarker
      v-for="(pin, index) in [...pins, dummyPin]"
      :key="index"
      :options="{
        position: pin.position,
        map: index < pins.length ? props.map : null
      }"
    >
      <div class="pin-content">
        <v-icon
          :icon="pin.icon"
          :color="getIconColor(pin.icon)"
          size="large"
        />
      </div>
    </AdvancedMarker>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { AdvancedMarker } from "vue3-google-map"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
}

interface Pin {
  name: string
  description: string
  formatted_address: string
  icon: string
  position: {
    lat: number
    lng: number
  }
}

const props = defineProps<Props>()
const pins = ref<Pin[]>([])

const dummyPin: Pin = {
  name: "",
  description: "",
  formatted_address: "",
  icon: "mdi-home-outline",
  position: { lat: 0, lng: 0 },
}

const iconColors = {
  "mdi-home-outline": "#4CAF50",
  "mdi-cart-outline": "#2196F3",
  "mdi-book-open-variant-outline": "#9C27B0",
  "mdi-bag-personal-outline": "#FF9800",
  "mdi-food-outline": "#F44336",
}

const getIconColor = (icon: string) => iconColors[icon as keyof typeof iconColors] || "#000000"

const addPin = (pin: Pin) => {
  pins.value = [ ...pins.value, pin ]
}

defineExpose({
  addPin,
  pins,
})
</script>

<style scoped>
.pin-content {
  background: rgb(var(--v-theme-surface-bright));
  border-radius: 1em;
  padding: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
