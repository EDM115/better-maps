import db from "@@/server/api/db"

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("close", () => {
    db.close()
    console.log("Database connection closed")
  })
})
