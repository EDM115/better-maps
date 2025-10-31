<template>
  <v-container class="flex-column justify-center h-100">
    <v-row
      align="center"
      align-content="center"
      justify="center"
      :class="[smAndUp ? 'flex-row' : 'flex-column', 'h-100']"
    >
      <v-col
        align="center"
        class="align-content-center"
      >
        <NuxtImg
          src="/images/logo.webp"
          :width="smAndUp ? '500px' : Math.floor(width * 0.7) + 'px'"
          :height="smAndUp ? '500px' : Math.floor(width * 0.7) + 'px'"
          alt="Better Maps"
          :draggable="false"
          preload
        />
      </v-col>
      <v-col align="center">
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const {
  smAndUp,
  width,
} = useVDisplay()
</script>
