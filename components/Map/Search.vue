<template>
  <v-autocomplete
    v-model="selectedPlace"
    v-model:search="searchQuery"
    :items="searchResults"
    :loading="loading"
    :placeholder="$t('map.search.placeholder')"
    item-title="name"
    item-value="place_id"
    return-object
    clearable
    hide-no-data
    @blur="loading = false"
  >
    <template #item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
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
      :label="$t('map.search.name')"
    />
    <v-text-field
      v-model="placeDetails.formatted_address"
      :label="$t('map.search.address')"
      class="mt-2"
    />
    <v-textarea
      v-model="placeDetails.description"
      :label="$t('map.search.description')"
      class="mt-2"
      rows="3"
    />
    <v-select
      v-model="placeDetails.icon"
      :items="props.icons"
      :label="$t('map.search.icon')"
      item-title="name"
      item-value="id"
      class="mt-2"
    >
      <template #prepend>
        <v-icon
          :icon="props.icons.find(icon => icon.id === placeDetails.icon)?.icon || 'mdi-dots-horizontal'"
          :color="getIconColor(placeDetails.icon, props.icons)"
          class="mr-2"
        />
      </template>
    </v-select>
    <v-switch
      v-model="placeDetails.favorite"
      :label="$t('map.search.favorite')"
      color="primary"
      class="mt-4"
    />
    <div class="d-flex flex-column gap-2 mt-4">
      <v-btn
        v-if="editMode"
        color="warning"
        block
        style="margin-bottom: 0.5em;"
        @click="cancelEdit"
      >
        {{ $t('map.search.cancel') }}
      </v-btn>
      <v-btn
        color="primary"
        block
        @click="editMode ? updatePin() : addPin()"
      >
        {{ editMode ? $t('map.search.edit-pin') : $t('map.search.add-pin') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { refDebounced } from "@vueuse/core"
import { nextTick, ref, watch } from "vue"

import { getIconColor, type Icon } from "./consts"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
  country?: string
  icons: Icon[]
}

interface Place {
  name: string
  formatted_address: string
  place_id: string
  geometry: {
    location: {
      lat: ()=> number
      lng: ()=> number
    }
  }
}

interface PlaceDetails {
  name: string
  description: string
  formatted_address: string
  icon: number
  color: string
  position: {
    lat: number
    lng: number
  }
  favorite: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "add-marker", details: PlaceDetails): void
  (e: "update-marker", details: PlaceDetails): void
}>()
const config = useRuntimeConfig()

const loading = ref(false)
const editMode = ref(false)
const editingPin = ref<PlaceDetails | null>(null)
const searchResults = ref<Place[]>([])
const selectedPlace = ref<Place | null>(null)
const placeService = ref<google.maps.places.PlacesService>()
const autocompleteService = ref<google.maps.places.AutocompleteService>()
const searchQuery = ref("")
const searchDebounced = refDebounced(searchQuery, 500, { maxWait: 1500 })
const didSearch = ref(false)

const placeDetails = ref<PlaceDetails>({
  name: "",
  description: "",
  formatted_address: "",
  icon: props.icons.length > 0 ? props.icons[0].id : -1,
  color: "",
  position: { lat: 0, lng: 0 },
  favorite: false,
})

function resetPlace() {
  selectedPlace.value = null
  placeDetails.value = {
    name: "",
    description: "",
    formatted_address: "",
    icon: props.icons.length > 0 ? props.icons[0].id : -1,
    color: "",
    position: { lat: 0, lng: 0 },
    favorite: false,
  }
}

const addPin = () => {
  if (!selectedPlace.value || !placeDetails.value.icon) {
    return
  }

  const pinData = placeDetails.value

  emit("add-marker", pinData)
  resetPlace()
  searchResults.value = []
}

const updatePin = () => {
  if (!selectedPlace.value || !placeDetails.value.icon || !editingPin.value) {
    return
  }

  const updatedPin = {
    ...editingPin.value,
    ...placeDetails.value,
  }

  emit("update-marker", updatedPin)
  editingPin.value = null
  editMode.value = false
  resetPlace()
  searchResults.value = []
}

const cancelEdit = () => {
  editMode.value = false
  editingPin.value = null
  resetPlace()
}

const startEditing = (pin: PlaceDetails) => {
  editMode.value = true
  editingPin.value = pin
  placeDetails.value = { ...pin }
  selectedPlace.value = {
    name: pin.name,
    formatted_address: pin.formatted_address,
    place_id: "",
    geometry: {
      location: {
        lat: () => pin.position.lat,
        lng: () => pin.position.lng,
      },
    },
  }
}

const handleSearch = async (search: string) => {
  if (!autocompleteService.value || !search) {
    return
  }

  const currentSearch = search

  didSearch.value = false
  const request: google.maps.places.AutocompletionRequest = {
    input: search,
    locationBias: props.map?.getBounds() || undefined,
    componentRestrictions: { country: props.country ?? config.public.country },
  }

  autocompleteService.value?.getPlacePredictions(request, async (predictions, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
      const results = predictions.map((prediction) => ({
        name: prediction.structured_formatting.main_text || prediction.description,
        formatted_address: prediction.structured_formatting.secondary_text || "",
        place_id: prediction.place_id,
        geometry: {
          location: {
            lat: (): number => 0,
            lng: (): number => 0,
          },
        },
      }))

      results.forEach((result) => {
        placeService.value?.getDetails({ placeId: result.place_id }, (detail, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK && detail && detail.geometry) {
            result.geometry.location.lat = () => detail.geometry?.location?.lat() ?? 0
            result.geometry.location.lng = () => detail.geometry?.location?.lng() ?? 0
          }
        })
      })

      searchResults.value = results
    } else {
      searchResults.value = []
    }

    didSearch.value = true
    nextTick(() => {
      searchQuery.value = currentSearch
    })
  })
}

watch(searchQuery, (search) => {
  if (!editMode.value && search && search.length > 0 && !didSearch.value) {
    loading.value = true
  } else {
    loading.value = false
  }
})

watch(searchDebounced, async (search) => {
  await handleSearch(search)
  loading.value = false
})

watch(selectedPlace, (place) => {
  if (place) {
    placeDetails.value = {
      ...placeDetails.value,
      name: place.name,
      formatted_address: place.formatted_address,
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    }
  }
})

watch(() => props.map, (newMap) => {
  if (newMap) {
    placeService.value = new google.maps.places.PlacesService(newMap)
    autocompleteService.value = new google.maps.places.AutocompleteService()
  }
}, { immediate: true })

defineExpose({
  startEditing,
  editMode,
})
</script>
