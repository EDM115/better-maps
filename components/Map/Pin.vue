<template>
  <div>
    <AdvancedMarker
      v-for="(pin, index) in pins"
      :key="index"
      :options="{ position: pin.position }"
    >
      <div class="pin-content">
        <v-icon 
          :icon="pin.icon"
          :color="getIconColor(pin.icon)"
        />
      </div>
    </AdvancedMarker>
    <v-list>
      <v-list-item
        v-for="(pin, index) in pins"
        :key="index"
        :title="pin.name"
        :subtitle="pin.description"
      >
        <template #prepend>
          <v-icon 
            :icon="pin.icon"
            :color="getIconColor(pin.icon)"
          />
        </template>
      </v-list-item>
    </v-list>
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
  icon: string
  position: {
    lat: number
    lng: number
  }
}

const props = defineProps<Props>()
const pins = ref<Pin[]>([])

const iconColors = {
  'mdi-home-outline': '#4CAF50',
  'mdi-cart-outline': '#2196F3',
  'mdi-book-open-variant-outline': '#9C27B0',
  'mdi-bag-personal-outline': '#FF9800',
  'mdi-food-outline': '#F44336'
}

const getIconColor = (icon: string) => iconColors[icon as keyof typeof iconColors] || '#000000'

const addPin = (pin: Pin) => {
  pins.value.push(pin)
}

defineExpose({
  addPin
})
</script>

<style scoped>
.pin-content {
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
