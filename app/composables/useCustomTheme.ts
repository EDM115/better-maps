export function useCustomTheme() {
  const vtheme = useVTheme()
  const store = useMainStore()

  function changeTheme(theme: "dark" | "light") {
    vtheme.change(theme)
    store.setTheme(theme)
  }

  function toggleTheme() {
    changeTheme(store.getTheme === "dark"
      ? "light"
      : "dark")
  }

  return {
    changeTheme,
    toggleTheme,
  }
}
