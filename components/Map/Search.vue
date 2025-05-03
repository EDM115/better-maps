<template>
  <v-autocomplete
    v-model="selectedPlace"
    v-model:search="searchQuery"
    :items="searchResults"
    :loading="loading"
    placeholder="Search places..."
    item-title="name"
    item-value="place_id"
    return-object
    clearable
    hide-no-data
    @update:search="searchQuery && searchQuery.length > 0 ? loading = true : loading = false"
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
      class="mt-2"
      readonly
    />
    <v-textarea
      v-model="placeDetails.description"
      label="Description"
      class="mt-2"
      rows="2"
    />
    <v-select
      v-model="placeDetails.icon"
      :items="iconOptions"
      label="Icon"
      item-title="label"
      item-value="value"
      class="mt-2"
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
import { refDebounced } from "@vueuse/core"
import { ref, watch } from "vue"

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
const autocompleteService = ref<google.maps.places.AutocompleteService>()
const searchQuery = ref("")
const searchDebounced = refDebounced(searchQuery, 500, { maxWait: 1500 })

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
  if (!autocompleteService.value || !search) return
  searchQuery.value = search

  loading.value = true
  const request: google.maps.places.AutocompletionRequest = {
    input: search,
    locationBias: props.map?.getBounds() || undefined,
    componentRestrictions: { country: 'fr' }
  }

  autocompleteService.value?.getPlacePredictions(request, (predictions, status) => {
    loading.value = false
    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
      searchResults.value = predictions.map(prediction => ({
        name: prediction.structured_formatting.main_text || prediction.description,
        formatted_address: prediction.structured_formatting.secondary_text || "",
        place_id: prediction.place_id,
        geometry: {
          location: {
            lat: () => 0,
            lng: () => 0
          }
        }
      }))
      searchResults.value.forEach(result => {
        placeService.value?.getDetails({ placeId: result.place_id }, (detail, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK && detail && detail.geometry) {
            result.geometry.location.lat = () => detail.geometry?.location?.lat() ?? 0;
            result.geometry.location.lng = () => detail.geometry?.location?.lng() ?? 0;
          }
        });
      });
    } else {
      searchResults.value = []
    }
  })
}

watch(searchDebounced, (search) => {
  handleSearch(search)
})

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
  autocompleteService.value = new google.maps.places.AutocompleteService()
})
</script>
