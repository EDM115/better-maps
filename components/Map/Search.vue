<script setup lang="ts">
import { ref, inject, onMounted, type Ref } from "vue"

interface MapRef {
  map: google.maps.Map
}

const mapRef = inject<Ref<MapRef>>("map")
const center = inject<Ref<{ lat: number; lng: number }>>("center")
const searchBox = ref<google.maps.places.SearchBox>()
const searchInput = ref<HTMLInputElement>()

onMounted(() => {
  if (!mapRef?.value?.map) return

  searchBox.value = new google.maps.places.SearchBox(searchInput.value!)
  mapRef.value.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput.value!)

  searchBox.value.addListener("places_changed", () => {
    const places = searchBox.value!.getPlaces()

    if (!places || places.length === 0) return

    const place = places[0]

    if (!place.geometry || !place.geometry.location) return

    mapRef.value.map.setCenter(place.geometry.location)

    if (center?.value) {
      center.value.lat = place.geometry.location.lat()
      center.value.lng = place.geometry.location.lng()
    }
  })
})
</script>

<template>
  <input
    ref="searchInput"
    type="text"
    class="search-input"
    placeholder="Search places..."
  >
</template>

<style scoped>
.search-input {
  box-sizing: border-box;
  border: 1px solid transparent;
  width: 240px;
  height: 32px;
  padding: 0 12px;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  outline: none;
  text-overflow: ellipsis;
  margin: 10px;
  background: white;
}
</style>
