<template>
  <h1 class="text-center my-4">
    {{ $t('login.title') }}
  </h1>
  <Error
    v-if="errorMessage"
    :issue="issueMessage"
    :message="errorMessage"
    :color="messageColor"
  />
  <v-form
    ref="form"
    @submit.prevent="submit"
  >
    <v-row>
      <v-col>
        <v-text-field
          v-model="state.username"
          class="input-field mx-auto"
          :label="$t('login.username')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          class="input-field mx-auto"
          :label="$t('login.password')"
        >
          <template #append-inner>
            <v-icon
              tabindex="-1"
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        class="text-center"
      >
        <v-btn
          color="primary"
          :text="$t('login.login')"
          type="submit"
          variant="elevated"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
import { useMainStore } from "~/stores/main"
import { nextTick, onMounted, ref, reactive } from "vue"

const router = useRouter()
const store = useMainStore()

const errorMessage = ref("")
const issueMessage = ref("")
const messageColor = ref("error")
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const initialState = {
  username: "",
  password: "",
}

const state = reactive({ ...initialState })

function clear() {
  Object.assign(state, initialState)
}

// oxlint-disable-next-line no-explicit-any
function handleError(error: any) {
  messageColor.value = "error"
  errorMessage.value = error.data?.message ?? error
  issueMessage.value = error.data?.statusMessage ?? ""
}

// oxlint-disable-next-line no-explicit-any
async function login(event: any) {
  errorMessage.value = ""

  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(event),
    })

    store.setUser(result.body.user)
    router.push("/map")
  } catch (error) {
    handleError(error)
  }
}

async function submit() {
  await login(state)

  clear()
}

onMounted(async () => {
  await nextTick()

  if (!store.isUserEmpty) {
    router.push("/map")
  }
})
</script>

<style scoped>
.input-field {
  width: 100%;
  max-width: 80%;
}
</style>
