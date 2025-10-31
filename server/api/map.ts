import db from "@@/server/api/db"

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  const { user_id } = getQuery(event)

  if (!user_id) {
    throw createError({
      status: 400, message: "User ID is required",
    })
  }

  const map = db.prepare(`
    SELECT * FROM Map
    WHERE id IN (
      SELECT map_id FROM User WHERE id = ?
    )
  `)
    .get(user_id) as {
      id: number;
      name: string;
      start_lat: number;
      start_lng: number;
      start_zoom: number;
      country: string;
      show_transit: boolean;
    } | undefined

  if (!map) {
    throw createError({
      status: 404,
      message: "Map not found",
    })
  }

  map.show_transit = Boolean(map.show_transit)

  return {
    status: 200,
    body: {
      success: "Map retrieved",
      map,
    },
  }
})
