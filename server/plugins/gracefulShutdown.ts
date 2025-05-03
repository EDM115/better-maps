import db from "../api/db"

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("close", () => {
    db.close()
    console.log("Database connection closed")
  })
})
