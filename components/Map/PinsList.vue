<template>
  <v-list>
    <v-list-item
      v-for="(pin, index) in pins"
      :key="index"
      :title="pin.name"
      :subtitle="pin.formatted_address"
    >
      <template #prepend>
        <v-icon
          :icon="pin.icon"
          :color="getIconColor(pin.icon)"
        />
      </template>
      <div style="white-space: pre-wrap; font-size: 0.9em;">
        {{ pin.description }}
      </div>
      <template #append>
        <v-btn
          icon="mdi-pencil"
          :disabled="editMode"
          @click="() => emit('edit', pin)"
        />
        <v-btn
          icon="mdi-delete"
          :disabled="editMode"
          @click="() => showDeleteDialog(pin)"
        />
      </template>
    </v-list-item>
  </v-list>

  <v-dialog
    v-model="showDialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Confirm Delete
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this pin?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          text
          @click="confirmDelete"
        >
          Delete
        </v-btn>
        <v-btn
          text
          @click="showDialog = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Pin {
  id: number
  name: string
  description: string
  formatted_address: string
  icon: string
  color: string
  position: {
    lat: number
    lng: number
  }
}

const emit = defineEmits<{
  (e: "edit", pin: Pin): void
  (e: "delete", pin: Pin): void
}>()

defineProps<{
  pins: Pin[]
  editMode?: boolean
}>()

const iconColors = {
  "mdi-home-outline": "#4CAF50",
  "mdi-cart-outline": "#2196F3",
  "mdi-book-open-variant-outline": "#9C27B0",
  "mdi-bag-personal-outline": "#FF9800",
  "mdi-food-outline": "#F44336",
}

const getIconColor = (icon: string) => iconColors[icon as keyof typeof iconColors] || "#000000"

const showDialog = ref(false)
const pinToDelete = ref<Pin | null>(null)

const showDeleteDialog = (pin: Pin) => {
  pinToDelete.value = pin
  showDialog.value = true
}

const confirmDelete = () => {
  if (pinToDelete.value) {
    emit('delete', pinToDelete.value)
    pinToDelete.value = null
  }
  showDialog.value = false
}
</script>
