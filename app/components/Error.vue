<template>
  <v-alert
    v-if="!close"
    class="mx-auto"
    :color="color ?? 'error'"
    closable
    variant="elevated"
    width="80%"
    @click:close="close = true"
  >
    <v-tooltip
      location="top"
      :text="$t('error.more-infos')"
    >
      <template #activator="{ props }">
        <v-btn
          v-if="issue"
          v-bind="props"
          :color="color ?? 'error'"
          class="mr-4"
          icon="mdi-information-outline"
          variant="flat"
          @click="more = !more"
        />
        <v-btn
          v-else
          v-bind="props"
          :color="color ?? 'error'"
          class="mr-4"
          icon="mdi-information-outline"
          variant="flat"
          readonly
        />
      </template>
    </v-tooltip>
    {{ message }}
    <div v-if="more">
      <v-divider class="my-4" />
      {{ issue }}
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
defineProps<{
  color?: string;
  issue?: string;
  message: string;
}>()

const more = ref(false)
const close = ref(false)
</script>

<style scoped>
.v-alert {
  margin: 1em 0;
}
</style>
