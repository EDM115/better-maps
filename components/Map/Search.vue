<template>
  <v-text-field
    ref="searchInput"
    placeholder="Search places..."
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

interface Props {
  map?: google.maps.Map
  center?: { lat: number; lng: number }
}

const props = defineProps<Props>()
const searchBox = ref<google.maps.places.SearchBox>()
const searchInput = ref<HTMLInputElement>()

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
