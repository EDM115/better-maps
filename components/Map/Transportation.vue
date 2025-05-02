<template>
  <v-switch
    v-model="showTransit"
    label="Show Public Transport"
    color="primary"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

interface Props {
  map?: google.maps.Map
}

const props = defineProps<Props>()
const showTransit = ref(false)

watch(showTransit, (show) => {
  if (props.map) {
    props.map.setOptions({
      styles: show
        ? []
        : [{ featureType: "transit", stylers: [{ visibility: "off" }] }],
    })
  }
})
</script>

