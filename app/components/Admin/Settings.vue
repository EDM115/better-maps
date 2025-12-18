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
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-list-item-title>{{ user.username }}</v-list-item-title>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="user.role"
                    :disabled="user.id === store.getUser?.id"
                    :items="['user', 'admin']"
                    density="compact"
                    :label="$t('admin.users.role')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-if="maps.length > 0"
                    v-model="user.map_id"
                    :items="maps"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    :label="$t('admin.users.map')"
                  />
                </v-col>
              </v-row>
            </v-container>
            <template #append>
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  size="small"
                  icon="mdi-pencil"
                  @click="updateUser(user.id, user.role, user.map_id)"
                />
                <v-btn
                  :disabled="user.id === store.getUser?.id"
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  @click="showUserDeleteDialog(user)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-container>
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
                  :error="!newUser.username.trim()"
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
                  :error="!newUser.password.trim()"
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
                  :disabled="!newUser.username.trim() || !newUser.password.trim()"
                  type="submit"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
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
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="map.name"
                    density="compact"
                    hide-details
                    required
                    :error="!map.name.trim()"
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
                    required
                    :error="!map.start_lat"
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
                    required
                    :error="!map.start_lng"
                    :label="$t('admin.maps.longitude')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="map.start_zoom"
                    density="compact"
                    hide-details
                    type="number"
                    min="2"
                    max="21"
                    required
                    :error="!map.start_zoom || map.start_zoom < 2 || map.start_zoom > 21"
                    :label="$t('admin.maps.zoom')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="map.country"
                    density="compact"
                    hide-details
                    placeholder="2 letters, lowercase (ex : fr, en)"
                    required
                    :error="!map.country.trim()"
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
                >
                  <v-row class="align-center">
                    <v-col cols="auto">
                      {{ $t("admin.maps.users") }} : {{ (mapUsers[map.id] || []).map(u => u.name).join(', ') }}
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto">
                      <v-btn
                        color="primary"
                        class="mr-2"
                        icon="mdi-pencil"
                        :disabled="!map.name.trim() || !map.start_lat || !map.start_lng || !map.start_zoom || map.start_zoom < 2 || map.start_zoom > 21 || !map.country.trim()"
                        @click="updateMap(map.id, map.name, map.start_lat, map.start_lng, map.start_zoom, map.country, map.show_transit)"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
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
        <v-container>
          <v-form @submit.prevent="addMap">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newMap.name"
                  :label="$t('admin.maps.name')"
                  required
                  :error="!newMap.name.trim()"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newMap.start_lat"
                  :label="$t('admin.maps.latitude')"
                  type="number"
                  step="0.000001"
                  required
                  :error="!newMap.start_lat"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newMap.start_lng"
                  :label="$t('admin.maps.longitude')"
                  type="number"
                  step="0.000001"
                  required
                  :error="!newMap.start_lng"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newMap.start_zoom"
                  :label="$t('admin.maps.zoom')"
                  type="number"
                  min="2"
                  max="21"
                  required
                  :error="!newMap.start_zoom || newMap.start_zoom < 2 || newMap.start_zoom > 21"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newMap.country"
                  :label="$t('admin.maps.country')"
                  placeholder="2 letters, lowercase (ex : fr, en)"
                  required
                  :error="!newMap.country.trim()"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="newMap.show_transit"
                  :label="$t('admin.maps.show-transit')"
                />
              </v-col>
              <v-col
                cols="12"
                class="d-flex justify-end"
              >
                <v-btn
                  color="primary"
                  icon="mdi-map-marker-plus-outline"
                  type="submit"
                  :disabled="!newMap.name.trim() || !newMap.start_lat || !newMap.start_lng || !newMap.start_zoom || newMap.start_zoom < 2 || newMap.start_zoom > 21 || !newMap.country.trim()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
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
            <v-text-field
              v-model="icon.name"
              density="compact"
              hide-details
              :label="$t('admin.icons.name')"
              class="mx-2"
              required
              :error="!icon.name.trim()"
            />
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-row class="align-center">
                    <v-col cols="auto">
                      <v-icon
                        :ref="el => {
                          if (!el) {
                            delete editIconRefs[icon.id]
                            return
                          }
                          editIconRefs[icon.id] = (el as any).$el ?? el
                        }"
                        :icon="icon.icon"
                        :color="icon.color"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="icon.icon"
                        density="compact"
                        :label="$t('admin.icons.icon')"
                        :error="!isValidEditIcons[icon.id]"
                        required
                        @update:model-value="value => validateIcon(value, icon.id)"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-color-picker
                    v-model="icon.color"
                    hide-inputs
                    mode="hex"
                  />
                </v-col>
              </v-row>
            </v-container>
            <template #append>
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  size="small"
                  icon="mdi-pencil"
                  :disabled="!isValidEditIcons[icon.id] || !icon.name.trim()"
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
            <v-divider class="my-4" />
          </v-list-item>
        </v-list>
        <v-divider class="my-2" />
        <v-container>
          <v-form @submit.prevent="addIcon">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newIcon.name"
                  :label="$t('admin.icons.name')"
                  required
                  :error="!newIcon.name.trim()"
                />
              </v-col>
              <v-col cols="12">
                <v-row class="align-center px-3">
                  <v-icon
                    ref="testIcon"
                    v-model="newIcon.icon"
                    :icon="newIcon.icon"
                    class="mr-4"
                    size="32"
                    :color="newIcon.color"
                  />
                  <v-text-field
                    v-model="newIcon.icon"
                    :label="$t('admin.icons.icon')"
                    required
                    :error="!isValidNewIcon"
                    @update:model-value="validateIcon"
                  />
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-color-picker
                  v-model="newIcon.color"
                  mode="hex"
                  hide-inputs
                />
              </v-col>
              <v-col
                cols="12"
                class="d-flex justify-end"
              >
                <v-btn
                  color="primary"
                  icon="mdi-shape-square-rounded-plus"
                  type="submit"
                  :disabled="!isValidNewIcon || !newIcon.name.trim()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-card class="mt-4">
    <v-card-title>{{ $t('admin.backup.title') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn
            color="success"
            prepend-icon="mdi-file-delimited-outline"
            :loading="exporting"
            @click="downloadBackup('csv')"
          >
            {{ $t('admin.backup.export-csv') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="success"
            prepend-icon="mdi-code-json"
            :loading="exporting"
            @click="downloadBackup('json')"
          >
            {{ $t('admin.backup.export-json') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="success"
            prepend-icon="mdi-database-export-outline"
            :loading="exporting"
            @click="downloadBackup('sql')"
          >
            {{ $t('admin.backup.export-sql') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="success"
            prepend-icon="mdi-database-arrow-down-outline"
            :loading="exporting"
            @click="downloadBackup('sqlite')"
          >
            {{ $t('admin.backup.export-sqlite') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

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
import type { VIcon } from "vuetify/components"

type User = {
  id: number;
  username: string;
  role: string;
  map_id: number;
}

type Map = {
  id: number;
  name: string;
  start_lat: number;
  start_lng: number;
  start_zoom: number;
  country: string;
  show_transit: boolean;
}

type Icon = {
  id: number;
  name: string;
  color: string;
  icon: string;
}

type Props = {
  initialUsers?: User[];
  initialMaps?: Map[];
  initialIcons?: Icon[];
  initialMapUsers?: Record<number, {
    id: number;
    name: string;
  }[]>;
}

const config = useRuntimeConfig()
const store = useMainStore()

const props = defineProps<Props>()

const users = ref<User[]>(props.initialUsers ?? [])
const maps = ref<Map[]>(props.initialMaps ?? [])
const icons = ref<Icon[]>(props.initialIcons ?? [])
const mapUsers = ref<Record<number, {
  id: number;
  name: string;
}[]>>(props.initialMapUsers ?? {})
const exporting = ref(false)

const showDeleteDialog = ref(false)
const showMapDeleteDialog = ref(false)
const showIconDeleteDialog = ref(false)

const userToDelete = ref<number | null>(null)
const mapToDelete = ref<number | null>(null)
const iconToDelete = ref<number | null>(null)

const testIcon = ref<InstanceType<typeof VIcon> | HTMLElement | null>(null)
const editIconRefs = reactive<Record<number, HTMLElement | null>>({})

const newUser = ref({
  username: "", password: "", role: "user", map_id: 0,
})
const newMap = ref({
  name: "", start_lat: 0, start_lng: 0, start_zoom: 2, country: "", show_transit: false,
})
const newIcon = ref({
  name: "", color: "#FF0000", icon: "",
})
const isValidNewIcon = ref(false)
const isValidEditIcons = reactive<Record<number, boolean>>({})

const resetNewUser = () => {
  const resetValue = {
    username: "", password: "", role: "user", map_id: 0,
  }

  newUser.value = resetValue
}

const resetNewMap = () => {
  const [ lat, lng, zoom ] = config.public.startingPoint.split(",")
    .map(Number)
  const resetValue = {
    name: "", start_lat: lat ?? 0, start_lng: lng ?? 0, start_zoom: zoom ?? 2, country: config.public.country, show_transit: false,
  }

  newMap.value = resetValue
}

const resetNewIcon = () => {
  const resetValue = {
    name: "", color: "#FF0000", icon: "",
  }

  newIcon.value = resetValue
}

const fetchData = async () => {
  const [ usersData, mapsData, iconsData, mapUsersData ] = await Promise.all([
    $fetch("/api/admin/user", {
      params: { admin_id: store.getUser?.id },
      headers: { Authorization: `Bearer ${store.getUser?.token}` },
    }),
    $fetch("/api/admin/map", {
      params: { admin_id: store.getUser?.id },
      headers: { Authorization: `Bearer ${store.getUser?.token}` },
    }),
    $fetch("/api/admin/icon", {
      params: { admin_id: store.getUser?.id },
      headers: { Authorization: `Bearer ${store.getUser?.token}` },
    }),
    $fetch("/api/admin/map", {
      params: {
        admin_id: store.getUser?.id, get_all_users: true,
      },
      headers: { Authorization: `Bearer ${store.getUser?.token}` },
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

  if ("getAllUsers" in mapUsersData.body) {
    mapUsers.value = mapUsersData.body.getAllUsers
  } else {
    mapUsers.value = {}
  }
}

const addUser = async () => {
  await $fetch("/api/admin/user", {
    method: "POST",
    body: {
      ...newUser.value, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  resetNewUser()
  await fetchData()
}

const updateUser = async (userId: number, role: string, mapId: number) => {
  await $fetch("/api/admin/user", {
    method: "PUT",
    body: {
      id: userId, role, map_id: mapId, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  await fetchData()
}

const deleteUser = async (userId: number) => {
  await $fetch("/api/admin/user", {
    method: "DELETE",
    body: {
      id: userId, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
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
    body: {
      ...newMap.value, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  resetNewMap()
  await fetchData()
}

const updateMap = async (mapId: number, name: string, startLat: number, startLng: number, startZoom: number, country: string, showTransit: boolean) => {
  await $fetch("/api/admin/map", {
    method: "PUT",
    body: {
      id: mapId, name, start_lat: startLat, start_lng: startLng, start_zoom: startZoom, country, show_transit: showTransit, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  await fetchData()
}

const deleteMap = async (mapId: number) => {
  await $fetch("/api/admin/map", {
    method: "DELETE",
    body: {
      id: mapId, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  showMapDeleteDialog.value = false
  await fetchData()
}

const triggerShowMapDeleteDialog = (map: Map) => {
  mapToDelete.value = map.id
  showMapDeleteDialog.value = true
}

const validateIcon = async (iconName: string, iconId?: number) => {
  const okBasic = iconName.startsWith("mdi-") && iconName.length >= 5

  if (!okBasic) {
    if (iconId !== undefined) {
      isValidEditIcons[iconId] = false
    } else {
      isValidNewIcon.value = false
    }

    return
  }

  let el: HTMLElement | null = null

  if (iconId !== undefined && editIconRefs[iconId] !== undefined) {
    el = editIconRefs[iconId]
  } else {
    el = testIcon.value instanceof HTMLElement
      ? testIcon.value
      : testIcon.value?.$el
  }

  await nextTick()

  if (!el) {
    if (iconId !== undefined) {
      isValidEditIcons[iconId] = false
    } else {
      isValidNewIcon.value = false
    }

    return
  }

  await nextTick()

  const content = window
    .getComputedStyle(el, "::before")
    .getPropertyValue("content")
    .replace(/"/g, "")

  const valid = Boolean(content) && content !== "none" && content !== "normal"

  if (iconId !== undefined) {
    isValidEditIcons[iconId] = valid
  } else {
    isValidNewIcon.value = valid
  }
}

const updateIcon = async (iconId: number, name: string, color: string, icon: string) => {
  await $fetch("/api/admin/icon", {
    method: "PUT",
    body: {
      id: iconId, name, color, icon, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  await fetchData()
}

const validateAndUpdateIcon = async (iconId: number, name: string, color: string, icon: string) => {
  validateIcon(icon)

  if (isValidEditIcons[iconId]) {
    await updateIcon(iconId, name, color, icon)
  }
}

const addIcon = async () => {
  if (!isValidNewIcon.value) {
    return
  }

  await $fetch("/api/admin/icon", {
    method: "POST",
    body: {
      ...newIcon.value, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
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
    body: {
      id: iconToDelete.value, admin_id: store.getUser?.id,
    },
    headers: {
      Authorization: `Bearer ${store.getUser?.token}`,
    },
  })
  showIconDeleteDialog.value = false
  await fetchData()
}

const triggerShowIconDeleteDialog = (icon: Icon) => {
  iconToDelete.value = icon.id
  showIconDeleteDialog.value = true
}

const downloadBackup = async (format: "csv" | "json" | "sql" | "sqlite") => {
  try {
    exporting.value = true
    const response = await $fetch("/api/admin/dbExport", {
      params: {
        format, admin_id: store.getUser?.id,
      },
      headers: { Authorization: `Bearer ${store.getUser?.token}` },
    })

    const binaryString = atob(response.body)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes])

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = response.filename
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Export failed :", error)
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  icons.value.forEach((icon) => {
    isValidEditIcons[icon.id] = true
  })
})
</script>
