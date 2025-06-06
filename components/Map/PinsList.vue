<template>
  <v-expansion-panels
    v-model="activePanel"
    flat
  >
    <v-expansion-panel value="true">
      <v-expansion-panel-title>
        {{ $t("map.pins-list.pins").replace("X", String(pins.length)) }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list
          :class="{
            'scrollable-list': smAndUp,
            'px-0': smAndUp
          }"
        >
          <v-list-item
            v-for="(pin, index) in pins"
            :key="index"
            :ref="(el) => { if (selectedPinId === pin.id && el instanceof Object) selectedItem = el as ComponentPublicInstance }"
            :title="pin.name"
            :subtitle="pin.formatted_address"
            :class="{
              'disabled-pin': !pin.visible,
              'highlighted-pin': selectedPinId === pin.id
            }"
            style="padding: 0.2em;"
          >
            <template #prepend>
              <div
                :class="pin.favorite ? 'pin-content pin-favorite' : 'pin-content'"
                :style="{
                  backgroundColor: darkBackgroundColor,
                  borderRadius: '0.5em',
                  padding: '0.2em',
                  marginRight: '0.5em',
                  cursor: 'pointer',
                  opacity: pin.visible ? 1 : 0.5
                }"
                @click="togglePinVisibility(pin)"
              >
                <v-icon
                  :icon="icons.find(icon => icon.id === pin.icon)?.icon || 'mdi-dots-horizontal'"
                  :color="getIconColor(pin.icon, icons)"
                />
              </div>
            </template>
            <div style="white-space: pre-wrap; font-size: 0.9em;">
              {{ pin.description }}
            </div>
            <template #append>
              <v-col>
                <v-row>
                  <v-btn
                    icon="mdi-pencil"
                    color="primary"
                    size="small"
                    style="margin-bottom: 0.5em;"
                    :disabled="editMode"
                    @click="() => emit('edit', pin)"
                  />
                </v-row>
                <v-row>
                  <v-btn
                    icon="mdi-delete"
                    color="error"
                    size="small"
                    :disabled="editMode"
                    @click="() => showDeleteDialog(pin)"
                  />
                </v-row>
              </v-col>
            </template>
          </v-list-item>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog
    v-model="showDialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('map.pins-list.delete-title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('map.pins-list.delete-description') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          :text="$t('map.pins-list.delete-confirm')"
          @click="confirmDelete"
        />
        <v-btn
          color="secondary"
          :text="$t('map.pins-list.delete-cancel')"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"
import type { ComponentPublicInstance } from "vue"

import { getIconColor, type Pin, type Icon } from "./consts"

const { smAndUp } = useDisplay()
const theme = useTheme()

const darkBackgroundColor = ref(theme.computedThemes.value.dark.colors.background)
const activePanel = ref(0)

const emit = defineEmits<{
  (e: "edit", pin: Pin): void
  (e: "delete", pin: Pin): void
  (e: "toggle-visibility", pin: Pin): void
}>()

defineProps<{
  pins: Pin[]
  editMode?: boolean
  selectedPinId?: number | null
  icons: Icon[]
}>()

const showDialog = ref(false)
const pinToDelete = ref<Pin | null>(null)

const selectedItem = ref<ComponentPublicInstance | null>(null)

watch(() => selectedItem.value, (el) => {
  if (el && activePanel.value === 0) {
    setTimeout(() => {
      el.$el?.scrollIntoView({ behavior: "smooth", block: smAndUp.value ? "center" : "nearest" })
    }, 100)
  }
})

const showDeleteDialog = (pin: Pin) => {
  pinToDelete.value = pin
  showDialog.value = true
}

const confirmDelete = () => {
  if (pinToDelete.value) {
    emit("delete", pinToDelete.value)
    pinToDelete.value = null
  }
  showDialog.value = false
}

const togglePinVisibility = (pin: Pin) => {
  emit("toggle-visibility", pin)
}
</script>

<style scoped>
.disabled-pin {
  opacity: 0.7;
}

.highlighted-pin {
  background-color: rgba(var(--v-theme-secondary), 0.5);
  border-radius: 0.5em !important;
}

.scrollable-list {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.pin-content {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0.5em;
  border-radius: 1em;
}

.pin-favorite {
  border: 4px solid rgb(var(--v-theme-warning));
}
</style>
