<template>
  <v-autocomplete
    v-model="selectedPlace"
    :items="searchResults"
    :loading="loading"
    placeholder="Search places..."
    item-title="name"
    return-object
    clearable
    @update:search="handleSearch"
  />

  <v-form
    v-if="selectedPlace"
    class="mt-4"
  >
    <v-text-field
      v-model="placeDetails.name"
      label="Name"
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
      <template #item="{ item }">
        <v-icon
          :color="getIconColor(item.raw.value)"
          class="mr-2"
        >
          {{ item.raw.value }}
        </v-icon>
        {{ item.raw.label }}
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

const searchInput = ref<HTMLInputElement | null>(null)
const searchBox = ref<google.maps.places.SearchBox | null>(null)

const placeDetails = ref<PlaceDetails>({
  name: "",
  description: "",
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
  emit('add-marker', placeDetails.value)
  selectedPlace.value = null
}

const handleSearch = (search: string) => {
  if (!searchBox.value || !props.map) return
  loading.value = true
  searchBox.value.setBounds(props.map.getBounds()!)
  searchBox.value.set("input", search)
  placeService.value!.getDetails({ placeId: search }, (place, status) => {
    loading.value = false
    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
      searchResults.value = [{
        name: place.name || "",
        geometry: place.geometry as { location: { lat: () => number; lng: () => number; } }
      }]
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

onMounted(() => {
  if (!props.map) {
    return
  }

  searchBox.value = new google.maps.places.SearchBox(searchInput.value!)
  props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput.value!)

  searchBox.value.addListener("places_changed", () => {
    const places = searchBox.value!.getPlaces()

    if (!places || places.length === 0) {
      return
    }

    const [ place ] = places

    if (!place.geometry || !place.geometry.location) {
      return
    }

    props.map!.setCenter(place.geometry.location)

    if (props.center) {
      props.center.lat = place.geometry.location.lat()
      props.center.lng = place.geometry.location.lng()
    }
  })
})
</script>
