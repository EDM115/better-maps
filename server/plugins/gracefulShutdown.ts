import db from "../api/db"

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("close", () => {
    db.close()
    console.log("Database connection closed")
  })

  if (import.meta.dev) {
    const exitHandler = () => {
      db.close()
      console.log("Database connection closed (dev)")
      process.exit(0)
    }

    process.once("SIGINT", exitHandler)
    process.once("SIGTERM", exitHandler)
  }
})
