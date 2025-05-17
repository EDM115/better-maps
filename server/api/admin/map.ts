import db from "../db"

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({ status: 405, message: "Method not allowed" })
  }

  switch (event.method) {
    case "GET": {
      const { get_all_users } = await getQuery(event) as { get_all_users?: boolean }

      if (get_all_users) {
        const maps = db.prepare(`
          SELECT * FROM Map
        `).all() as {
          id: number
          name: string
          start_lat: number
          start_lng: number
          start_zoom: number
          country: string
          show_transit: boolean
        }[]

        maps.forEach((map) => {
          map.show_transit = Boolean(map.show_transit)
        })

        const users = db.prepare(`
          SELECT id, username, map_id FROM User
        `).all() as {
          id: number
          username: string
          map_id: number
        }[]

        const getAllUsers: Record<number, { id: number, name: string }[]> = {}

        users.forEach((user) => {
          if (!getAllUsers[user.map_id]) {
            getAllUsers[user.map_id] = []
          }
          getAllUsers[user.map_id].push({ id: user.id, name: user.username })
        })

        return {
          status: 200,
          body: {
            success: "Maps and users retrieved",
            getAllUsers,
          },
        }
      } else {
        const maps = db.prepare(`
          SELECT * FROM Map
        `).all() as {
          id: number
          name: string
          start_lat: number
          start_lng: number
          start_zoom: number
          country: string
          show_transit: boolean
        }[]

        maps.forEach((map) => {
          map.show_transit = Boolean(map.show_transit)
        })

        return {
          status: 200,
          body: {
            success: "Maps retrieved",
            maps,
          },
        }
      }
    }
    case "POST": {
      const { name, start_lat, start_lng, start_zoom, country, show_transit } = await readBody(event) as {
        name: string
        start_lat: number
        start_lng: number
        start_zoom: number
        country: string
        show_transit: boolean
      }

      if (!name || !start_lat || !start_lng || !start_zoom || !country || !show_transit) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      const newMap = db.prepare(`
        INSERT INTO Map (name, start_lat, start_lng, start_zoom, country, show_transit)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, start_lat, start_lng, start_zoom, country, show_transit)

      return {
        status: 201,
        body: {
          success: "Map created",
          id: newMap.lastInsertRowid,
        },
      }
    }
    case "PUT": {
      const { id, name, start_lat, start_lng, start_zoom, country, show_transit } = await readBody(event) as {
        id: number
        name: string
        start_lat: number
        start_lng: number
        start_zoom: number
        country: string
        show_transit: boolean
      }

      if (!id || !name || !start_lat || !start_lng || !start_zoom || !country || !show_transit) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      db.prepare(`
        UPDATE Map
        SET name = ?, start_lat = ?, start_lng = ?, start_zoom = ?, country = ?, show_transit = ?
        WHERE id = ?
      `).run(name, start_lat, start_lng, start_zoom, country, show_transit, id)

      return {
        status: 200,
        body: {
          success: "Map updated",
        },
      }
    }
    case "DELETE": {
      const { id } = await readBody(event) as { id: number }

      if (!id) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      db.prepare(`
        DELETE FROM Map
        WHERE id = ?
      `).run(id)

      return {
        status: 200,
        body: {
          success: "Map deleted",
        },
      }
    }
    default: {
      throw createError({ status: 405, message: "Method not allowed" })
    }
  }
})
