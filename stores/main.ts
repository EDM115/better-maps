import cookie from "cookiejs"

import { defineStore } from "pinia"

export const useMainStore = defineStore("main", {
  state: () => ({
    i18n: "fr" as "fr" | "en",
    theme: "dark",
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
    getTheme(state): string {
      return state.theme
    },
    getUser(state): { id: number | null; username: string | null; token: string | null; role: string | null; map_id: number | null } {
      return state.user
    },
    isUserEmpty(state): boolean {
      return state.user.id === null && state.user.username === null && state.user.token === null && state.user.role === null && state.user.map_id === null
    },
  },
  actions: {
    createCookie(name: string, value: string, days: number) {
      cookie(name, value, days)

      return value
    },
    initI18n() {
      const storedI18n = cookie.get("i18n_lang")
      if (storedI18n) {
        this.i18n = String(storedI18n) as "fr" | "en"
      } else {
        this.i18n = "fr"
      }
    },
    initTheme() {
      let storedTheme = cookie.get("theme")

      if (storedTheme) {
        if (typeof storedTheme === "boolean") {
          storedTheme = "dark"
        }

        this.setTheme(storedTheme)
      }
    },
    initUser() {
      const storedUser = cookie.get("user") as string

      if (storedUser.length > 0) {
        try {
          this.setUser(JSON.parse(decodeURI(storedUser)))
        } catch (e) {
          console.error("Error parsing user cookie :", e)
        }
      }
    },
    setI18n(i18n: "fr" | "en") {
      this.i18n = i18n
    },
    setTheme(theme: string) {
      this.theme = theme
      this.createCookie("theme", theme, 30)
    },
    setUser(user: { id: number | null; username: string | null; token: string | null; role: string | null; map_id: number | null }) {
      this.user = user
      this.createCookie("user", encodeURI(JSON.stringify(user)), 1)
    },
    logout() {
      this.user = {
        id: null,
        username: null,
        token: null,
        role: null,
        map_id: null,
      }
      cookie.remove("user")
    },
    initStore() {
      this.initI18n()
      this.initTheme()
      this.initUser()
    },
  },
})

export default useMainStore
