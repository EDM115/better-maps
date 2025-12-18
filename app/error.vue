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
                sizes="300px"
                alt="Better Maps"
                :placeholder="[150, 150, 50, 5]"
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
              {{ $t("error.redirect-to-home") }}
            </NuxtLink>
          </v-row>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>
