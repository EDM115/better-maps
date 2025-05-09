<template>
  <div>
    <AdvancedMarker
      v-for="(pin, index) in [...pins, dummyPin]"
      :key="index"
      :options="{
        position: pin.position,
        map: index < pins.length ? props.map : null
      }"
      @click="() => handlePinClick(pin)"
    >
      <div
        v-if="pin.visible"
        :class="pin.favorite ? 'pin-content pin-favorite' : 'pin-content'"
        :style="{ backgroundColor: darkBackgroundColor }"
      >
        <v-icon
          :icon="pin.icon"
          :color="getIconColor(pin.icon)"
          size="large"
        />
      </div>
    </AdvancedMarker>

    <InfoWindow
      v-if="selectedPin && selectedPin.id !== -1"
      v-model="showInfoWindow"
      :options="{ 
        position: selectedPin.position,
        pixelOffset: pixelOffset,
      }"
      @closeclick="handleInfoWindowClose"
      @visible-changed="handleInfoWindowVisibility"
    >
      <div class="info-window-content">
        <h3>{{ selectedPin.name }}</h3>
        <p>{{ selectedPin.formatted_address }}</p>
        <p
          v-if="selectedPin.description"
          style="white-space: pre-wrap;"
        >
          {{ selectedPin.description }}
        </p>
      </div>
    </InfoWindow>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main"
import { onMounted, ref, watch } from "vue"
import { AdvancedMarker, InfoWindow } from "vue3-google-map"
import { useTheme } from "vuetify"

import { getIconColor, type Pin } from "./consts"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
  mapId?: number
}

type ApiPointResponse = {
  id: number
  name: string
  description: string
  address: string
  lat: number
  lng: number
  color: string
  icon: string
  visible: boolean
  favorite: boolean
}

const props = defineProps<Props>()
const pins = ref<Pin[]>([])
const store = useMainStore()
const theme = useTheme()

const darkBackgroundColor = ref(theme.computedThemes.value.dark.colors.background)

const dummyPin: Pin = {
  id: -1,
  name: "",
  description: "",
  formatted_address: "",
  icon: "mdi-home-outline",
  color: "",
  position: { lat: 0, lng: 0 },
  visible: true,
  favorite: false,
}

const selectedPin = ref<Pin | null>(null)
const showInfoWindow = ref(false)
const pixelOffset = ref<google.maps.Size | null>(null)

const emit = defineEmits<{
  (e: "pin-selected", pinId: number | null): void
}>()

const handlePinClick = (pin: Pin) => {
  if (pin.id === -1) {
    return
  }
  pixelOffset.value = new google.maps.Size(0, -34)
  selectedPin.value = pin
  showInfoWindow.value = true
  emit("pin-selected", pin.id)
}

const handleInfoWindowClose = () => {
  showInfoWindow.value = false
  selectedPin.value = null
  emit("pin-selected", null)
}

const handleInfoWindowVisibility = (visible: boolean) => {
  if (!visible) {
    selectedPin.value = null
    emit("pin-selected", null)
  }
}

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
        visible: true,
        favorite: pin.favorite,
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })

    if ("id" in response.body) {
      pins.value = [ ...pins.value, { ...pin, id: (response.body as { id: number }).id, visible: true, favorite: pin.favorite }]
    }
  } catch (error) {
    console.error("Échec de l'ajout du pin :", error)
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
    pins.value = pins.value.filter((p) => p.id !== pin.id)
  } catch (error) {
    console.error("Échec de la suppression du pin :", error)
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
        visible: pin.visible,
        favorite: pin.favorite,
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })

    const index = pins.value.findIndex((p) => p.id === pin.id)

    if (index !== -1) {
      pins.value[index] = pin
    }
  } catch (error) {
    console.error("Échec de l'édition du pin :", error)
  }
}

const togglePinVisibility = async (pin: Pin) => {
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
        map_id: props.mapId,
        visible: !pin.visible,
        favorite: pin.favorite,
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })

    const index = pins.value.findIndex((p) => p.id === pin.id)
    if (index !== -1) {
      pins.value[index] = { ...pin, visible: !pin.visible }
    }
  } catch (error) {
    console.error("Échec de la mise à jour de la visibilité du pin :", error)
  }
}

defineExpose({
  addPin,
  deletePin,
  editPin,
  togglePinVisibility,
  pins,
})

const fetchPins = async () => {
  if (!props.mapId) {
    return
  }

  try {
    const response = await $fetch("/api/point", {
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
      query: { map_id: props.mapId },
    })

    if ("points" in response.body) {
      const { points } = response.body

      pins.value = points.map((point: ApiPointResponse) => ({
        id: point.id,
        name: point.name,
        description: point.description,
        formatted_address: point.address,
        icon: point.icon,
        color: point.color,
        position: {
          lat: point.lat,
          lng: point.lng,
        },
        visible: point.visible,
        favorite: point.favorite,
      }))
    }
  } catch (error) {
    console.error("Échec de la récupération des pins :", error)
  }
}

watch(() => props.mapId, (newMapId) => {
  if (newMapId) {
    fetchPins()
  }
}, { immediate: true })

onMounted(() => {
  if (props.mapId) {
    fetchPins()
    pixelOffset.value = new google.maps.Size(0, -34)
  }
})
</script>

<style scoped>
.pin-content {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0.5em;
  border-radius: 1em;
}

.pin-favorite {
  border: 4px solid rgb(var(--v-theme-warning));
}

.info-window-container {
  margin-bottom: 10px;
}

.info-window-content {
  padding: 8px;
  max-width: 300px;
}

.info-window-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
}

.info-window-content p {
  margin: 4px 0;
  font-size: 0.9em;
}
</style>
