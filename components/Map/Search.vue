<template>
  <v-autocomplete
    v-model="selectedPlace"
    :items="searchResults"
    :loading="loading"
    placeholder="Search places..."
    item-title="name"
    item-value="place_id"
    return-object
    clearable
    @update:search="handleSearch"
  >
    <template #item="{ item }">
      <v-list-item
        :title="item.raw.name"
        :subtitle="item.raw.formatted_address"
        @click="selectedPlace = item.raw"
      />
    </template>
  </v-autocomplete>

  <v-form
    v-if="selectedPlace"
    class="mt-4"
  >
    <v-text-field
      v-model="placeDetails.name"
      label="Name"
      readonly
    />
    <v-text-field
      v-model="placeDetails.formatted_address"
      label="Address"
      readonly
    />
    <v-textarea
      v-model="placeDetails.description"
      label="Description"
      rows="2"
    />
    <v-select
      v-model="placeDetails.icon"
      :items="iconOptions"
      label="Icon"
      item-title="label"
      item-value="value"
    >
      <template #prepend>
        <v-icon
          :color="getIconColor(placeDetails.icon)"
          class="mr-2"
        >
          {{ placeDetails.icon }}
        </v-icon>
      </template>
    </v-select>
    <v-btn
      color="primary"
      class="mt-4"
      block
      @click="addPin"
    >
      Add Pin
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
}

interface Place {
  name: string
  formatted_address: string
  place_id: string
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
}

interface PlaceDetails {
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
const emit = defineEmits<{
  (e: "add-marker", details: PlaceDetails): void
}>()

const loading = ref(false)
const searchResults = ref<Place[]>([])
const selectedPlace = ref<Place | null>(null)
const placeService = ref<google.maps.places.PlacesService>()

const placeDetails = ref<PlaceDetails>({
  name: "",
  description: "",
  formatted_address: "",
  icon: "mdi-home-outline",
  position: { lat: 0, lng: 0 }
})

const iconOptions = [
  { label: "House", value: "mdi-home-outline", color: "#4CAF50" },
  { label: "Cart", value: "mdi-cart-outline", color: "#2196F3" },
  { label: "Book", value: "mdi-book-open-variant-outline", color: "#9C27B0" },
  { label: "Bag", value: "mdi-bag-personal-outline", color: "#FF9800" },
  { label: "Food", value: "mdi-food-outline", color: "#F44336" }
]

const getIconColor = (icon: string) => iconOptions.find(option => option.value === icon)?.color || "#000000"

const addPin = () => {
  if (!selectedPlace.value || !placeDetails.value.icon) return

  const pinData = {
    ...placeDetails.value,
    formatted_address: selectedPlace.value.formatted_address
  }
  
  emit('add-marker', pinData)
  selectedPlace.value = null
  placeDetails.value = {
    name: "",
    description: "",
    formatted_address: "",
    icon: "mdi-home-outline",
    position: { lat: 0, lng: 0 }
  }
  searchResults.value = []
}

const handleSearch = (search: string) => {
  if (!props.map || !placeService.value || !search) return
  
  loading.value = true
  const request = {
    query: search,
    bounds: props.map.getBounds()
  }

  placeService.value.textSearch(request, (results, status) => {
    loading.value = false
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      searchResults.value = results.map(place => ({
        name: place.name || "",
        formatted_address: place.formatted_address || "",
        place_id: place.place_id || "",
        geometry: {
          location: {
            lat: () => place.geometry?.location?.lat() || 0,
            lng: () => place.geometry?.location?.lng() || 0
          }
        }
      }))
    } else {
      searchResults.value = []
    }
  })
}

watch(selectedPlace, (place) => {
  if (place) {
    placeDetails.value = {
      name: place.name,
      description: "",
      formatted_address: place.formatted_address,
      icon: "mdi-home-outline",
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    }
  }
})

onMounted(() => {
  if (!props.map) return
  placeService.value = new google.maps.places.PlacesService(props.map)
})
</script>
