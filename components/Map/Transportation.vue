<template>
  <v-switch
    v-model="showTransit"
    label="Afficher les transports en commun"
    color="primary"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

interface Props {
  map?: google.maps.Map
  show: boolean
}

const props = defineProps<Props>()
const showTransit = ref(props.show)
const transitLayer = ref<google.maps.TransitLayer | null>(null)

watch(showTransit, (show) => {
  if (props.map) {
    if (show) {
      transitLayer.value = new google.maps.TransitLayer()
      transitLayer.value.setMap(props.map)
    } else {
      if (transitLayer.value) {
        transitLayer.value.setMap(null)
        transitLayer.value = null
      }
    }
  }
})
</script>

