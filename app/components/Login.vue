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
    <v-row>
      <v-col
        class="text-center"
      >
        <NuxtLink
          target="_blank"
          to="https://github.com/EDM115/better-maps#readme"
        >
          <v-btn
            prepend-icon="mdi-github"
            color="warning"
            variant="tonal"
            theme="dark"
            :text="$t('login.github')"
          />
        </NuxtLink>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
type ErrorType = {
  data?: {
    message: string;
    statusMessage: string;
  };
} | string

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

function handleError(error: ErrorType) {
  messageColor.value = "error"

  if (typeof error === "string") {
    errorMessage.value = error
    issueMessage.value = ""

    return
  }

  errorMessage.value = error.data?.message ?? "An unknown error occurred."
  issueMessage.value = error.data?.statusMessage ?? ""
}

async function login(event: typeof state) {
  errorMessage.value = ""

  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(event),
    })

    store.setUser(result.body.user)
    router.push("/map")
  } catch (error) {
    handleError(error as ErrorType)
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
