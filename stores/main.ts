import cookie from "cookiejs"

import { defineStore } from "pinia"

export const useMainStore = defineStore("main", {
  state: () => ({
    theme: "dark",
  }),
  getters: {
    getTheme(state): string {
      return state.theme
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
    setTheme(theme: string) {
      this.theme = this.createCookie("theme", theme, 30)
    },
    initStore() {
      this.initTheme()
    },
  },
})

export default useMainStore
