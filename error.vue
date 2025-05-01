<template>
  <v-app>
    <v-main>
      <LayoutNavBar />
      <v-container
        class="fill-height"
      >
        <v-col align="center">
          <v-row
            align="center"
            align-content="center"
            justify="center"
          >
            <NuxtLink to="/">
              <NuxtImg
                src="/images/logo.webp"
                width="300px"
                height="300px"
                alt="Better Maps"
                preload
              />
            </NuxtLink>
          </v-row>
          <v-row
            align="center"
            align-content="center"
            justify="center"
          >
            <NuxtLink to="/">
              Redirection vers la page d'accueil...
            </NuxtLink>
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"

onMounted(() => {
  const router = useRouter()

  router.push("/")
})
</script>
