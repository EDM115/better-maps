<template>
  <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("map.options.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-switch
          v-model="showTransit"
          :label="$t('map.options.show-transit')"
          color="primary"
          class="mb-4"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
interface Props {
  map?: google.maps.Map;
  show: boolean;
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

