function ssrSafe() {
  return import.meta.client
    && typeof window !== "undefined"
    && typeof localStorage !== "undefined"
}

export const useMainStore = defineStore("main", {
  state: () => ({
    i18n: "fr" as "fr" | "en",
    theme: "dark" as "dark" | "light",
    user: {
      id: null as number | null,
      username: null as string | null,
      token: null as string | null,
      role: null as string | null,
      map_id: null as number | null,
    },
  }),
  getters: {
    getI18n(state): "fr" | "en" {
      return state.i18n
    },
    getTheme(state): "dark" | "light" {
      return state.theme
    },
    getUser(state): {
      id: number | null; username: string | null; token: string | null; role: string | null; map_id: number | null;
    } {
      return state.user
    },
    isUserEmpty(state): boolean {
      return state.user.id === null
        && state.user.username === null
        && state.user.token === null
        && state.user.role === null
        && state.user.map_id === null
    },
  },
  actions: {
    initI18n() {
      if (!ssrSafe()) {
        return
      }

      // oxlint-disable-next-line no-unsafe-type-assertion
      const storedI18n = localStorage.getItem("i18n") as "fr" | "en" | null

      if (storedI18n) {
        this.i18n = storedI18n
      } else {
        this.i18n = "fr"
      }
    },
    initTheme() {
      if (!ssrSafe()) {
        return
      }

      // oxlint-disable-next-line no-unsafe-type-assertion
      let storedTheme = localStorage.getItem("theme") as "dark" | "light" | null

      if (storedTheme) {
        this.setTheme(storedTheme)
      }
    },
    initUser() {
      if (!ssrSafe()) {
        return
      }

      const storedUser = localStorage.getItem("user")

      if (storedUser && storedUser.length > 0) {
        try {
          this.setUser(JSON.parse(decodeURI(storedUser)))
        } catch (e) {
          console.error("Error parsing user cookie :", e)
        }
      }
    },
    setI18n(i18n: "fr" | "en") {
      if (!ssrSafe()) {
        return
      }

      this.i18n = i18n
      localStorage.setItem("i18n", i18n)
    },
    setTheme(theme: "dark" | "light") {
      if (!ssrSafe()) {
        return
      }

      this.theme = theme
      localStorage.setItem("theme", theme)
    },
    setUser(user: {
      id: number | null; username: string | null; token: string | null; role: string | null; map_id: number | null;
    }) {
      if (!ssrSafe()) {
        return
      }

      this.user = user
      localStorage.setItem("user", encodeURI(JSON.stringify(user)))
    },
    logout() {
      if (!ssrSafe()) {
        return
      }

      this.user = {
        id: null,
        username: null,
        token: null,
        role: null,
        map_id: null,
      }
      localStorage.removeItem("user")
    },
    initStore() {
      this.initI18n()
      this.initTheme()
      this.initUser()
    },
  },
})

export default useMainStore
