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
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
interface Pin {
  name: string
  description: string
  formatted_address: string
  icon: string
  position: {
    lat: number
    lng: number
  }
}

defineProps<{
  pins: Pin[]
}>()

const iconColors = {
  "mdi-home-outline": "#4CAF50",
  "mdi-cart-outline": "#2196F3",
  "mdi-book-open-variant-outline": "#9C27B0",
  "mdi-bag-personal-outline": "#FF9800",
  "mdi-food-outline": "#F44336",
}

const getIconColor = (icon: string) => iconColors[icon as keyof typeof iconColors] || "#000000"
</script>
