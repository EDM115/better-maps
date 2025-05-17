<template>
  <h1>Settings</h1>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>User Management</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list>
          <v-list-item
            v-for="user in users"
            :key="user.id"
          >
            <v-list-item-title>{{ user.username }}</v-list-item-title>
            <template #append>
              <v-select
                v-model="user.role"
                :items="['user', 'admin']"
                density="compact"
                class="mx-2"
                style="min-width: 100px"
                @update:model-value="updateUser(user.id, $event, user.map_id)"
              />
              <v-select
                v-if="maps.length > 1"
                v-model="user.map_id"
                :items="maps"
                item-title="name"
                item-value="id"
                density="compact"
                class="mx-2"
                style="min-width: 150px"
                @update:model-value="updateUser(user.id, user.role, $event)"
              />
              <v-btn
                v-if="user.id !== store.getUser.id"
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="deleteUser(user.id)"
              />
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-form @submit.prevent="addUser">
          <v-row>
            <v-col
              cols="12"
              :sm="3"
            >
              <v-text-field
                v-model="newUser.username"
                label="Username"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="3"
            >
              <v-text-field
                v-model="newUser.password"
                label="Password"
                type="password"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-select
                v-model="newUser.role"
                :items="['user', 'admin']"
                label="Role"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-select
                v-model="newUser.map_id"
                :items="maps"
                item-title="name"
                item-value="id"
                label="Map"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-btn
                color="primary"
                block
                type="submit"
              >
                Add User
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>Map Management</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list>
          <v-list-item
            v-for="map in maps"
            :key="map.id"
          >
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  v-model="map.name"
                  density="compact"
                  hide-details
                  label="Name"
                  @change="updateMap(map.id, $event, map.start_lat, map.start_lng, map.start_zoom, map.country, map.show_transit)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="2"
              >
                <v-text-field
                  v-model="map.start_lat"
                  density="compact"
                  hide-details
                  type="number"
                  step="0.000001"
                  label="Latitude"
                  @change="updateMap(map.id, map.name, $event, map.start_lng, map.start_zoom, map.country, map.show_transit)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="2"
              >
                <v-text-field
                  v-model="map.start_lng"
                  density="compact"
                  hide-details
                  type="number"
                  step="0.000001"
                  label="Longitude"
                  @change="updateMap(map.id, map.name, map.start_lat, $event, map.start_zoom, map.country, map.show_transit)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="1"
              >
                <v-text-field
                  v-model="map.start_zoom"
                  density="compact"
                  hide-details
                  type="number"
                  min="1"
                  max="20"
                  label="Zoom"
                  @change="updateMap(map.id, map.name, map.start_lat, map.start_lng, $event, map.country, map.show_transit)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="1"
              >
                <v-text-field
                  v-model="map.country"
                  density="compact"
                  hide-details
                  label="Country"
                  @change="updateMap(map.id, map.name, map.start_lat, map.start_lng, map.start_zoom, $event, map.show_transit)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="1"
              >
                <v-switch
                  v-model="map.show_transit"
                  density="compact"
                  hide-details
                  label="Transit"
                  @change="updateMap(map.id, map.name, map.start_lat, map.start_lng, map.start_zoom, map.country, $event)"
                />
              </v-col>
            </v-row>
            <template #subtitle>
              Users: {{ (mapUsers[map.id] || []).map(u => u.name).join(', ') }}
            </template>
            <template #append>
              <v-btn
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="deleteMap(map.id)"
              />
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-form @submit.prevent="addMap">
          <v-row>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="newMap.name"
                label="Name"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="2"
            >
              <v-text-field
                v-model="newMap.start_lat"
                label="Latitude"
                type="number"
                step="0.000001"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="2"
            >
              <v-text-field
                v-model="newMap.start_lng"
                label="Longitude"
                type="number"
                step="0.000001"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-text-field
                v-model="newMap.start_zoom"
                label="Zoom"
                type="number"
                min="1"
                max="20"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-text-field
                v-model="newMap.country"
                label="Country"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-switch
                v-model="newMap.show_transit"
                label="Transit"
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-btn
                color="primary"
                block
                type="submit"
              >
                Add
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>Icons Management</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list>
          <v-list-item
            v-for="icon in icons"
            :key="icon.id"
          >
            <template #prepend>
              <v-icon
                :icon="'mdi-' + icon.icon"
                :color="icon.color"
              />
            </template>
            <v-text-field
              v-model="icon.name"
              density="compact"
              hide-details
              label="Name"
              class="mx-2"
              @change="updateIcon(icon.id, $event, icon.color, icon.icon)"
            />
            <template #append>
              <div class="d-flex align-center">
                <v-text-field
                  v-model="icon.icon"
                  density="compact"
                  hide-details
                  label="Icon"
                  class="mx-2"
                  prefix="mdi-"
                  @change="validateAndUpdateIcon(icon.id, icon.name, icon.color, $event)"
                />
                <v-color-picker
                  v-model="icon.color"
                  hide-inputs
                  mode="hex"
                  @update:model-value="updateIcon(icon.id, icon.name, $event, icon.icon)"
                />
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  @click="deleteIcon(icon.id)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-form @submit.prevent="addIcon">
          <v-row>
            <v-col
              cols="12"
              :sm="4"
            >
              <v-text-field
                v-model="newIcon.name"
                label="Name"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="4"
            >
              <v-text-field
                v-model="newIcon.icon"
                label="Icon"
                prefix="mdi-"
                required
                :error="!isValidIcon"
                :error-messages="isValidIcon ? undefined : 'Invalid icon name'"
                @update:model-value="validateIcon"
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-color-picker
                v-model="newIcon.color"
                mode="hex"
                hide-inputs
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-btn
                color="primary"
                block
                type="submit"
                :disabled="!isValidIcon"
              >
                Add Icon
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { useMainStore } from "~/stores/main"
import { ref, onMounted } from "vue"

type User = {
  id: number
  username: string
  role: string
  map_id: number
}

type Map = {
  id: number
  name: string
  start_lat: number
  start_lng: number
  start_zoom: number
  country: string
  show_transit: boolean
}

type Icon = {
  id: number
  name: string
  color: string
  icon: string
}

const config = useRuntimeConfig()
const store = useMainStore()

const users = ref<User[]>([])
const maps = ref<Map[]>([])
const icons = ref<Icon[]>([])
const mapUsers = ref<Record<number, { id: number, name: string }[]>>({})

const newUser = ref({ username: "", password: "", role: "user", map_id: 0 })
const newMap = ref({ name: "", start_lat: 0, start_lng: 0, start_zoom: 2, country: "", show_transit: false })
const newIcon = ref({ name: "", color: "#FF0000", icon: "" })
const isValidIcon = ref(false)

const resetNewUser = () => {
  const resetValue = { username: "", password: "", role: "user", map_id: 0 }

  newUser.value = resetValue
}

const resetNewMap = () => {
  const [lat, lng, zoom] = config.public.startingPoint.split(",").map(Number)
  const resetValue = { name: "", start_lat: lat, start_lng: lng, start_zoom: zoom, country: config.public.country, show_transit: false }

  newMap.value = resetValue
}

const resetNewIcon = () => {
  const resetValue = { name: "", color: "#FF0000", icon: "" }

  newIcon.value = resetValue
}

const updateMapUsersMap = async () => {
  const mapUsersData = await $fetch("/api/admin/map", {
    params: { admin_id: store.getUser.id, get_all_users: true },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })

  if ("getAllUsers" in mapUsersData.body) {
    mapUsers.value = mapUsersData.body.getAllUsers
  } else {
    mapUsers.value = {}
  }
}

const fetchData = async () => {
  const [ usersData, mapsData, iconsData ] = await Promise.all([
    $fetch("/api/admin/user", {
      params: { admin_id: store.getUser.id },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    }),
    $fetch("/api/admin/map", {
      params: { admin_id: store.getUser.id },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    }),
    $fetch("/api/admin/icon", {
      params: { admin_id: store.getUser.id },
      headers: {
        Authorization: `Bearer ${store.getUser.token}`,
      },
    }),
  ])

  if ("users" in usersData.body) {
    users.value = usersData.body.users
  } else {
    users.value = []
  }
  if ("maps" in mapsData.body) {
    maps.value = mapsData.body.maps
  } else {
    maps.value = []
  }
  if ("icons" in iconsData.body) {
    icons.value = iconsData.body.icons
  } else {
    icons.value = []
  }
  await updateMapUsersMap()
}

const addUser = async () => {
  await $fetch("/api/admin/user", {
    method: "POST",
    body: { ...newUser.value, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  resetNewUser()
  await fetchData()
}

const updateUser = async (userId: number, role: string, mapId: number) => {
  await $fetch("/api/admin/user", {
    method: "PUT",
    body: { id: userId, role, map_id: mapId, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

const deleteUser = async (userId: number) => {
  await $fetch("/api/admin/user", {
    method: "DELETE",
    body: { id: userId, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

const addMap = async () => {
  await $fetch("/api/admin/map", {
    method: "POST",
    body: { ...newMap.value, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  resetNewMap()
  await fetchData()
}

const updateMap = async (mapId: number, name: string, startLat: number, startLng: number, startZoom: number, country: string, showTransit: boolean) => {
  await $fetch("/api/admin/map", {
    method: "PUT",
    body: { id: mapId, name, start_lat: startLat, start_lng: startLng, start_zoom: startZoom, country, show_transit: showTransit, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

const deleteMap = async (mapId: number) => {
  await $fetch("/api/admin/map", {
    method: "DELETE",
    body: { id: mapId, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

const validateIcon = (iconName: string) => {
  try {
    const iconElement = document.createElement("v-icon")

    iconElement.setAttribute("icon", `mdi-${iconName}`)
    document.body.appendChild(iconElement)
    document.body.removeChild(iconElement)

    isValidIcon.value = true
  } catch {
    isValidIcon.value = false
  }
}

const updateIcon = async (iconId: number, name: string, color: string, icon: string) => {
  await $fetch(`/api/admin/icon`, {
    method: "PUT",
    body: { id: iconId, name, color, icon, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

const validateAndUpdateIcon = async (iconId: number, name: string, color: string, icon: string) => {
  validateIcon(icon)

  if (isValidIcon.value) {
    await updateIcon(iconId, name, color, icon)
  }
}

const addIcon = async () => {
  if (!isValidIcon.value) {
    return
  }

  await $fetch("/api/admin/icon", {
    method: "POST",
    body: { ...newIcon.value, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  resetNewIcon()
  await fetchData()
}

const deleteIcon = async (iconId: number) => {
  await $fetch(`/api/admin/icon`, {
    method: "DELETE",
    body: { id: iconId, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  await fetchData()
}

onMounted(async () => {
  await fetchData()
})
</script>
