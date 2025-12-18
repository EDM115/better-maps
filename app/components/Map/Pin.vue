<template>
  <div>
    <AdvancedMarker
      v-for="(pin, index) in filteredPins"
      :key="index"
      :options="{
        position: pin.position,
        map: index < pins.length ? props.map : null
      }"
      @click="() => handlePinClick(pin)"
    >
      <template #content>
        <div
          v-if="pin.visible"
          :class="pin.favorite ? 'pin-content pin-favorite' : 'pin-content'"
          :style="{ backgroundColor: darkBackgroundColor }"
        >
          <v-icon
            :icon="props.icons.find(icon => icon.id === pin.icon)?.icon || 'mdi-dots-horizontal'"
            :color="getIconColor(pin.icon, props.icons)"
            size="large"
          />
        </div>
      </template>
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
import {
  AdvancedMarker,
  InfoWindow,
} from "vue3-google-map"

import {
  getIconColor,
  type Pin,
  type Icon,
} from "./consts"

interface Props {
  map?: google.maps.Map;
  center?: {
    lat: number;
    lng: number;
  };
  mapId?: number;
  icons: Icon[];
}

type ApiPointResponse = {
  id: number;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  color: string;
  icon: number;
  visible: boolean;
  favorite: boolean;
}

const store = useMainStore()
const theme = useVTheme()
const { t } = useI18n()

const props = defineProps<Props>()

const dummyPin: Pin = {
  id: -1,
  name: t("map.pin.dummy-pin"),
  description: "",
  formatted_address: "",
  icon: -1,
  color: "#F8F8F2",
  position: {
    lat: 0, lng: 0,
  },
  visible: true,
  favorite: false,
}

const pins = ref<Pin[]>([])
const filteredPins = computed(() => [
  ...pins.value.filter((p) => p.visible),
  dummyPin,
])

const darkBackgroundColor = ref(theme.computedThemes.value.dark?.colors.background)

const selectedPin = ref<Pin | null>(null)
const showInfoWindow = ref(false)
const pixelOffset = ref<google.maps.Size | null>(null)

const emit = defineEmits<{
  (e: "pin-selected", pinId: number | null): void;
}>()

const handlePinClick = (pin: Pin) => {
  if (pin.id === -1) {
    return
  }

  if (typeof window !== "undefined" && typeof (window as unknown as { google?: unknown }).google !== "undefined") {
    pixelOffset.value = new google.maps.Size(0, -34)
  }

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
        Authorization: `Bearer ${store.getUser?.token}`,
      },
    })

    if ("id" in response.body) {
      pins.value = [
        ...pins.value, {
          ...pin, id: (response.body as { id: number }).id, visible: true, favorite: pin.favorite,
        },
      ]
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
        Authorization: `Bearer ${store.getUser?.token}`,
      },
    })
    pins.value = pins.value.filter((p) => p.id !== pin.id)
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
        visible: pin.visible,
        favorite: pin.favorite,
      },
      headers: {
        Authorization: `Bearer ${store.getUser?.token}`,
      },
    })

    const index = pins.value.findIndex((p) => p.id === pin.id)

    if (index !== -1) {
      pins.value[index] = pin
    }
  } catch (error) {
    console.error("Failed to edit pin :", error)
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
        Authorization: `Bearer ${store.getUser?.token}`,
      },
    })

    const index = pins.value.findIndex((p) => p.id === pin.id)

    if (index !== -1) {
      pins.value[index] = {
        ...pin, visible: !pin.visible,
      }
    }
  } catch (error) {
    console.error("Failed to update pin visibility :", error)
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
        Authorization: `Bearer ${store.getUser?.token}`,
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
    console.error("Failed to fetch pins :", error)
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

    if (typeof window !== "undefined" && typeof (window as unknown as { google?: unknown }).google !== "undefined") {
      pixelOffset.value = new google.maps.Size(0, -34)
    }
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
