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
        <AdminSettings
          v-if="data"
          :initial-users="data.users"
          :initial-maps="data.maps"
          :initial-icons="data.icons"
          :initial-map-users="data.mapUsers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
type User = {
  id: number;
  username: string;
  role: string;
  map_id: number;
}

type AdminMap = {
  id: number;
  name: string;
  start_lat: number;
  start_lng: number;
  start_zoom: number;
  country: string;
  show_transit: boolean;
}

type AdminIcon = {
  id: number;
  name: string;
  color: string;
  icon: string;
}

const store = useMainStore()

const { smAndUp } = useVDisplay()

const { data } = await useAsyncData<{
  users: User[];
  maps: AdminMap[];
  icons: AdminIcon[];
  mapUsers: Record<number, {
    id: number; name: string;
  }[]>;
}>("admin-page-data", async () => {
  const token = store.getUser?.token
  const adminId = store.getUser?.id

  if (!token || !adminId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const [ usersData, mapsData, iconsData, mapUsersData ] = await Promise.all([
    $fetch<{ body: { users?: User[] } }>("/api/admin/user", {
      params: { admin_id: adminId },
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<{ body: {
      maps?: AdminMap[];
      getAllUsers?: Record<number, {
        id: number; name: string;
      }[]>;
    }; }>("/api/admin/map", {
      params: { admin_id: adminId },
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<{ body: { icons?: AdminIcon[] } }>("/api/admin/icon", {
      params: { admin_id: adminId },
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<{ body: {
      getAllUsers?: Record<number, {
        id: number; name: string;
      }[]>;
      maps?: AdminMap[];
    }; }>("/api/admin/map", {
      params: {
        admin_id: adminId, get_all_users: true,
      },
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])

  return {
    users: usersData.body.users ?? [],
    maps: mapsData.body.maps ?? [],
    icons: iconsData.body.icons ?? [],
    mapUsers: mapUsersData.body.getAllUsers ?? {},
  }
})

onMounted(async () => {
  if (store.getUser === null || store.getUser.role !== "admin") {
    await navigateTo("/", { redirectCode: 403 })
  }
})
</script>
