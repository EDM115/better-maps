import cookie from "cookiejs"

import { defineStore } from "pinia"

export const useMainStore = defineStore("main", {
  state: () => ({
    theme: "dark",
    user: {
      id: null as number | null,
      username: null as string | null,
      token: null as string | null,
      role: null as string | null,
    },
  }),
  getters: {
    getTheme(state): string {
      return state.theme
    },
    getUser(state): { id: number | null; username: string | null; token: string | null; role: string | null } {
      return state.user
    },
    isUserEmpty(state): boolean {
      return state.user.id === null && state.user.username === null && state.user.token === null && state.user.role === null
    },
  },
  actions: {
    createCookie(name: string, value: string, days: number) {
      cookie(name, value, days)

      return value
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
    setTheme(theme: string) {
      this.theme = theme
      this.createCookie("theme", theme, 30)
    },
    setUser(user: { id: number | null; username: string | null; token: string | null; role: string | null }) {
      this.user = user
      this.createCookie("user", encodeURI(JSON.stringify(user)), 1)
    },
    logout() {
      this.user = {
        id: null,
        username: null,
        token: null,
        role: null,
      }
      cookie.remove("user")
    },
    initStore() {
      this.initTheme()
      this.initUser()
    },
  },
})

export default useMainStore
