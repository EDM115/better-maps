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
import {
  getIconColor,
  type Icon,
} from "./consts"

interface Props {
  map?: google.maps.Map;
  center?: {
    lat: number; lng: number;
  };
  country?: string;
  icons: Icon[];
}

interface PlaceItem {
  name: string;
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface PlaceDetails {
  name: string;
  description: string;
  formatted_address: string;
  icon: number;
  color: string;
  position: {
    lat: number;
    lng: number;
  };
  favorite: boolean;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "add-marker", details: PlaceDetails): void;
  (e: "update-marker", details: PlaceDetails): void;
}>()
const config = useRuntimeConfig()

const loading = ref(false)
const editMode = ref(false)
const editingPin = ref<PlaceDetails | null>(null)
const searchResults = ref<PlaceItem[]>([])
const selectedPlace = ref<PlaceItem | null>(null)
const searchQuery = ref("")
const searchDebounced = refDebounced(searchQuery, 500, { maxWait: 1500 })
const didSearch = ref(false)

let sessionToken: google.maps.places.AutocompleteSessionToken | null = null

const placeDetails = ref<PlaceDetails>({
  name: "",
  description: "",
  formatted_address: "",
  icon: props.icons.length > 0
    ? props.icons[0]?.id ?? 0
    : -1,
  color: "",
  position: {
    lat: 0, lng: 0,
  },
  favorite: false,
})

function resetPlace() {
  selectedPlace.value = null
  placeDetails.value = {
    name: "",
    description: "",
    formatted_address: "",
    icon: props.icons.length > 0
      ? props.icons[0]?.id ?? 0
      : -1,
    color: "",
    position: {
      lat: 0, lng: 0,
    },
    favorite: false,
  }

  sessionToken = null
}

const addPin = () => {
  if (!selectedPlace.value || !placeDetails.value.icon) {
    return
  }

  emit("add-marker", placeDetails.value)
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

async function handleSearch(search: string) {
  if (!search) {
    return
  }

  didSearch.value = false
  loading.value = true

  const {
    AutocompleteSuggestion, AutocompleteSessionToken,
  }
    = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary

  if (!sessionToken) {
    sessionToken = new AutocompleteSessionToken()
  }

  const region
    = (props.country || config.public.country || "").toString()
      .toUpperCase()
  const request: google.maps.places.AutocompleteRequest = {
    input: search,
    locationBias: props.map?.getBounds(),
    includedRegionCodes: region
      ? [region]
      : undefined,
    sessionToken,
  }

  try {
    const { suggestions }
      = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

    const results: PlaceItem[] = suggestions.map((s) => {
      const p = s.placePrediction
      const main
        = p?.mainText?.text || p?.text?.text || ""
      const secondary = p?.secondaryText?.text || ""

      return {
        name: main,
        formatted_address: secondary,
        place_id: p?.placeId || "",
        geometry: {
          location: {
            lat: () => 0,
            lng: () => 0,
          },
        },
      }
    })

    await Promise.all(results.map(async (r, i) => {
      const pred = suggestions[i]?.placePrediction

      if (!pred) {
        return
      }

      const place = pred.toPlace()

      await place.fetchFields({
        fields: [ "location", "displayName", "formattedAddress" ],
      })
      const loc = place.location
      const lat: number = loc?.lat() ?? 0
      const lng: number = loc?.lng() ?? 0

      if (typeof lat === "number" && typeof lng === "number") {
        r.geometry.location.lat = () => lat
        r.geometry.location.lng = () => lng
      }

      r.name = place.displayName ?? r.name
      r.formatted_address = place.formattedAddress ?? r.formatted_address
    }))

    searchResults.value = results
  } catch (err) {
    console.error(err)
    searchResults.value = []
  } finally {
    didSearch.value = true
    loading.value = false
  }
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

    sessionToken = null
  }
})

onMounted(async () => {
  if (typeof window === "undefined") {
    return
  }

  await google.maps.importLibrary("places")
})

defineExpose({
  startEditing,
  editMode,
})
</script>
