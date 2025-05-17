<template>
  <h1 class="mb-4">
    {{ $t("admin.title") }}
  </h1>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("admin.users.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list>
          <v-list-item
            v-for="user in users"
            :key="user.id"
          >
            <div class="d-flex align-center ga-4">
              <v-list-item-title>{{ user.username }}</v-list-item-title>
              <v-select
                v-model="user.role"
                :disabled="user.id === store.getUser.id"
                :items="['user', 'admin']"
                density="compact"
                :label="$t('admin.users.role')"
                style="min-width: 150px"
              />
              <v-select
                v-if="maps.length > 0"
                v-model="user.map_id"
                :items="maps"
                item-title="name"
                item-value="id"
                density="compact"
                :label="$t('admin.users.map')"
                style="min-width: 200px"
              />
            </div>
            <template #append>
              <v-btn
                color="primary"
                class="ml-2"
                size="small"
                icon="mdi-pencil"
                @click="updateUser(user.id, user.role, user.map_id)"
              />
              <v-btn
                :disabled="user.id === store.getUser.id"
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="showUserDeleteDialog(user)"
              />
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-form
          class="pl-4 pb-4"
          @submit.prevent="addUser"
        >
          <v-row>
            <v-col
              cols="12"
              :sm="3"
            >
              <v-text-field
                v-model="newUser.username"
                :label="$t('admin.users.username')"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="3"
            >
              <v-text-field
                v-model="newUser.password"
                :label="$t('admin.users.password')"
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
                :label="$t('admin.users.role')"
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
                :label="$t('admin.users.map')"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="2"
            >
              <v-btn
                color="primary"
                icon="mdi-account-plus-outline"
                type="submit"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("admin.maps.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list>
          <v-list-item
            v-for="map in maps"
            :key="map.id"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="map.name"
                  density="compact"
                  hide-details
                  :label="$t('admin.maps.name')"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="map.start_lat"
                  density="compact"
                  hide-details
                  type="number"
                  step="0.000001"
                  :label="$t('admin.maps.latitude')"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="map.start_lng"
                  density="compact"
                  hide-details
                  type="number"
                  step="0.000001"
                  :label="$t('admin.maps.longitude')"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="map.start_zoom"
                  density="compact"
                  hide-details
                  type="number"
                  min="1"
                  max="20"
                  :label="$t('admin.maps.zoom')"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="map.country"
                  density="compact"
                  hide-details
                  :label="$t('admin.maps.country')"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="map.show_transit"
                  density="compact"
                  hide-details
                  :label="$t('admin.maps.show-transit')"
                />
              </v-col>
              <v-col
                cols="12"
                class="d-flex justify-end"
              >
                <v-btn
                  color="primary"
                  class="mr-2"
                  icon="mdi-pencil"
                  @click="updateMap(map.id, map.name, map.start_lat, map.start_lng, map.start_zoom, map.country, map.show_transit)"
                />
              </v-col>
            </v-row>
            <template #subtitle>
              {{ $t("admin.maps.users") }} : {{ (mapUsers[map.id] || []).map(u => u.name).join(', ') }}
            </template>
            <template #append>
              <v-btn
                icon="mdi-delete"
                :disabled="maps.length <= 1"
                color="error"
                variant="text"
                @click="triggerShowMapDeleteDialog(map)"
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
                :label="$t('admin.maps.name')"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="2"
            >
              <v-text-field
                v-model="newMap.start_lat"
                :label="$t('admin.maps.latitude')"
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
                :label="$t('admin.maps.longitude')"
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
                :label="$t('admin.maps.zoom')"
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
                :label="$t('admin.maps.country')"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-switch
                v-model="newMap.show_transit"
                :label="$t('admin.maps.show-transit')"
              />
            </v-col>
            <v-col
              cols="12"
              sm="1"
            >
              <v-btn
                color="primary"
                icon="mdi-map-marker-plus-outline"
                type="submit"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("admin.icons.title") }}</v-expansion-panel-title>
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
              :label="$t('admin.icons.name')"
              class="mx-2"
              @change="updateIcon(icon.id, $event, icon.color, icon.icon)"
            />
            <template #append>
              <div class="d-flex align-center gap-2">
                <v-text-field
                  v-model="icon.icon"
                  density="compact"
                  hide-details
                  :label="$t('admin.icons.icon')"
                  prefix="mdi-"
                />
                <v-color-picker
                  v-model="icon.color"
                  hide-inputs
                  mode="hex"
                />
                <v-btn
                  color="primary"
                  size="small"
                  icon="mdi-pencil"
                  @click="validateAndUpdateIcon(icon.id, icon.name, icon.color, icon.icon)"
                />
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  @click="triggerShowIconDeleteDialog(icon)"
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
                :label="$t('admin.icons.name')"
                required
              />
            </v-col>
            <v-col
              cols="12"
              :sm="4"
            >
              <v-text-field
                v-model="newIcon.icon"
                :label="$t('admin.icons.icon')"
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
                icon="mdi-shape-square-rounded-plus"
                type="submit"
                :disabled="!isValidIcon"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog
    v-model="showDeleteDialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('admin.users.delete-title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('admin.users.delete-description') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          :text="$t('admin.users.delete-confirm')"
          @click="deleteUser"
        />
        <v-btn
          color="secondary"
          :text="$t('admin.users.delete-cancel')"
          @click="showDeleteDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="showMapDeleteDialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('admin.maps.delete-title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('admin.maps.delete-description') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          :text="$t('admin.maps.delete-confirm')"
          @click="deleteMap"
        />
        <v-btn
          color="secondary"
          :text="$t('admin.maps.delete-cancel')"
          @click="showMapDeleteDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="showIconDeleteDialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('admin.icons.delete-title') }}
      </v-card-title>
      <v-card-text>
        {{ $t('admin.icons.delete-description') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          :text="$t('admin.icons.delete-confirm')"
          @click="deleteIcon"
        />
        <v-btn
          color="secondary"
          :text="$t('admin.icons.delete-cancel')"
          @click="showIconDeleteDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
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

const showDeleteDialog = ref(false)
const showMapDeleteDialog = ref(false)
const showIconDeleteDialog = ref(false)

const userToDelete = ref<number | null>(null)
const mapToDelete = ref<number | null>(null)
const iconToDelete = ref<number | null>(null)

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
  showDeleteDialog.value = false
  await fetchData()
}

const showUserDeleteDialog = (user: User) => {
  userToDelete.value = user.id
  showDeleteDialog.value = true
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
  showMapDeleteDialog.value = false
  await fetchData()
}

const triggerShowMapDeleteDialog = (map: Map) => {
  mapToDelete.value = map.id
  showMapDeleteDialog.value = true
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

const deleteIcon = async () => {
  if (iconToDelete.value === null) {
    return
  }

  await $fetch("/api/admin/icon", {
    method: "DELETE",
    body: { id: iconToDelete.value, admin_id: store.getUser.id },
    headers: {
      Authorization: `Bearer ${store.getUser.token}`,
    },
  })
  showIconDeleteDialog.value = false
  await fetchData()
}

const triggerShowIconDeleteDialog = (icon: Icon) => {
  iconToDelete.value = icon.id
  showIconDeleteDialog.value = true
}

onMounted(async () => {
  await fetchData()
})
</script>
