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
      <div
        v-if="pin.visible"
        class="pin-content"
        :style="{ backgroundColor: darkBackgroundColor }"
      >
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
import { onMounted, ref, watch } from "vue"
import { AdvancedMarker } from "vue3-google-map"
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
        visible: true
      },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    })

    if ("id" in response.body) {
      pins.value = [ ...pins.value, { ...pin, id: (response.body as { id: number }).id, visible: true }]
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
  }
})
</script>

<style scoped>
.pin-content {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0.5em;
  border-radius: 1em;
}
</style>
