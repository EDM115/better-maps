function ssrSafe() {
  return import.meta.client
    && typeof window !== "undefined"
    && typeof localStorage !== "undefined"
}

export const useMainStore = defineStore("main", () => {
  type User = {
    id: number,
    username: string,
    token: string,
    role: string,
    map_id: number,
  } | null

  const i18n = ref<"fr" | "en">("fr")
  const theme = ref<"dark" | "light">("dark")
  const user = ref<User>(null)

  const getI18n = computed(() => i18n.value)
  const getTheme = computed(() => theme.value)
  const getUser = computed(() => user.value)

  function initI18n() {
    if (!ssrSafe()) {
      return
    }

    // oxlint-disable-next-line no-unsafe-type-assertion
    const storedI18n = localStorage.getItem("i18n") as "fr" | "en" | null

    setI18n(storedI18n ?? "fr")
  }

  function initTheme() {
    if (!ssrSafe()) {
      return
    }

    // oxlint-disable-next-line no-unsafe-type-assertion
    const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null

    if (storedTheme) {
      setTheme(storedTheme)
    }
  }

  function initUser() {
    if (!ssrSafe()) {
      return
    }

    const storedUser = localStorage.getItem("user")

    if (storedUser && storedUser.length > 0) {
      try {
        setUser(JSON.parse(decodeURI(storedUser)))
      } catch (e) {
        console.error("Error parsing user data :", e)
      }
    }
  }

  function setI18n(i18nParam: "fr" | "en") {
    if (!ssrSafe()) {
      return
    }

    i18n.value = i18nParam
    localStorage.setItem("i18n", i18n.value)
  }

  function setTheme(themeParam: "dark" | "light") {
    if (!ssrSafe()) {
      return
    }

    theme.value = themeParam
    localStorage.setItem("theme", theme.value)
  }

  function setUser(userParam: User) {
    if (!ssrSafe()) {
      return
    }

    user.value = userParam
    localStorage.setItem("user", encodeURI(JSON.stringify(user.value)))
  }

  function logout() {
    if (!ssrSafe()) {
      return
    }

    user.value = null
    localStorage.removeItem("user")
  }

  function initStore() {
    initI18n()
    initTheme()
    initUser()
  }

  return {
    i18n,
    theme,
    user,
    getI18n,
    getTheme,
    getUser,
    setI18n,
    setTheme,
    setUser,
    logout,
    initStore,
  }
})

export default useMainStore
