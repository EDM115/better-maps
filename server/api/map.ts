import db from "./db"

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({ status: 405, message: "Méthode non autorisée" })
  }

  const { user_id } = await getQuery(event) as { user_id: string }

  if (!user_id) {
    throw createError({ status: 400, message: "User ID is required" })
  }

  const map = db.prepare(`
    SELECT * FROM Map
    WHERE id IN (
      SELECT map_id FROM UserMap WHERE user_id = ?
    )
  `).get(user_id) as {
    id: number
    name: string
    start_lat: number
    start_lng: number
    start_zoom: number
  } | undefined

  if (!map) {
    throw createError({
      status: 404,
      message: "Map not found",
    })
  }

  return {
      status: 200,
      body: {
        success: "Map retrieved",
        map,
      },
    } 
})
