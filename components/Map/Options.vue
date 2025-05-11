<template>
  <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-title>Options de la carte</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-switch
          v-model="showTransit"
          label="Afficher les transports en commun"
          color="primary"
          class="mb-4"
        />
        <!--<div class="d-flex flex-column gap-2">
          <v-switch
            v-for="icon in iconOptions"
            :key="icon.value"
            v-model="visibleIcons[icon.value]"
            :label="icon.label"
            :color="icon.color"
            @update:model-value="updateIconVisibility"
          />
        </div> -->
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { iconOptions } from "./consts"

interface Props {
  map?: google.maps.Map
  show: boolean
}

const emit = defineEmits<{
  (e: "update-icon-visibility", visibleIcons: Record<string, boolean>): void
}>()

const props = defineProps<Props>()
const showTransit = ref(props.show)
const transitLayer = ref<google.maps.TransitLayer | null>(null)

const visibleIcons = ref(Object.fromEntries(
  iconOptions.map(icon => [icon.value, true])
))

const updateIconVisibility = () => {
  emit("update-icon-visibility", visibleIcons.value)
}

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

