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
import { useMainStore } from "~/stores/main"
import { onMounted, ref } from "vue"
import { AdvancedMarker } from "vue3-google-map"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
  mapId?: number
}

interface Pin {
  id: number
  name: string
  description: string
  formatted_address: string
  icon: string
  color: string
  position: {
    lat: number
    lng: number
  }
}

const props = defineProps<Props>()
const pins = ref<Pin[]>([])
const store = useMainStore()

const dummyPin: Pin = {
  id: -1,
  name: "",
  description: "",
  formatted_address: "",
  icon: "mdi-home-outline",
  color: "",
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

const addPin = async (pin: Pin) => {
  try {
    const response = await $fetch("/api/point", {
      method: "POST",
      body: {
        name: pin.name,
        description: pin.description,
        address: pin.formatted_address,
        lat: pin.position.lat,
        lng: pin.position.lng,
        color: pin.color,
        icon: pin.icon,
        map_id: Number(props.mapId),
        visible: 1
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })
  
    if ("id" in response.body) {
      pins.value = [...pins.value, { ...pin, id: (response.body as { id: number }).id }]
    }
  } catch (error) {
    console.error("Failed to add pin :", error)
  }
}

const deletePin = async (pin: Pin) => {
  try {
    await $fetch("/api/point", {
      method: "DELETE",
      body: { id: pin.id },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })
    pins.value = pins.value.filter(p => p.id !== pin.id)
  } catch (error) {
    console.error("Failed to delete pin :", error)
  }
}

const editPin = async (pin: Pin) => {
  try {
    await $fetch("/api/point", {
      method: "PUT",
      body: {
        id: pin.id,
        name: pin.name,
        description: pin.description,
        address: pin.formatted_address,
        lat: pin.position.lat,
        lng: pin.position.lng,
        color: pin.color,
        icon: pin.icon,
        map_id: Number(props.mapId),
        visible: 1
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })
    
    const index = pins.value.findIndex(p => p.id === pin.id)
    if (index !== -1) {
      pins.value[index] = pin
    }
  } catch (error) {
    console.error("Failed to edit pin :", error)
  }
}

defineExpose({
  addPin,
  deletePin,
  editPin,
  pins,
})

onMounted(async () => {
  try {
    const response = await $fetch("/api/point", {
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
      query: { map_id: props.mapId },
    })
    
    if ("points" in response.body) {
      const { points } = response.body
      pins.value = points.map((point: any) => ({
        id: point.id,
        name: point.name,
        description: point.description,
        formatted_address: point.address,
        icon: point.icon,
        color: point.color,
        position: {
          lat: point.lat,
          lng: point.lng
        }
      }))
    }
  } catch (error) {
    console.error("Failed to fetch pins :", error)
  }
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
