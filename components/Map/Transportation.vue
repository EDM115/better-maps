<script setup lang="ts">
import { ref, inject, watch, type Ref } from "vue"

interface MapRef {
  map: google.maps.Map
}

const mapRef = inject<Ref<MapRef>>("map")
const showTransit = ref(false)

watch(showTransit, (show) => {
  if (mapRef?.value?.map) {
    mapRef.value.map.setOptions({
      styles: show
        ? []
        : [{ featureType: "transit", stylers: [{ visibility: "off" }] }],
    })
  }
})
</script>

<template>
  <v-switch
    v-model="showTransit"
    label="Show Public Transport"
    color="primary"
    class="mt-4"
  />
</template>

