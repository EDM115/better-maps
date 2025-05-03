import db from "./db"

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({ status: 405, message: "Méthode non autorisée" })
  }

  switch (event.method) {
    case "GET": {
      const { map_id, point_id } = await getQuery(event) as { map_id: number, point_id: number | undefined }

      if (point_id) {
        const point = db.prepare(`
          SELECT * FROM Point
          WHERE id = ?
          AND map_id = ?
        `).get(point_id, map_id) as {
          id: number
          name: string
          description: string
          address: string
          lat: number
          lng: number
          color: string
          icon: string
          map_id: number
          visible: number
        } | undefined

        if (!point) {
          throw createError({
            status: 404,
            message: "Point non trouvé",
          })
        }

        return {
          status: 200,
          body: {
            success: "Point récupéré",
            point,
          },
        }
      } else {
        const points = db.prepare(`
          SELECT * FROM Point
          WHERE map_id = ?
        `).all(map_id) as {
          id: number
          name: string
          description: string
          address: string
          lat: number
          lng: number
          color: string
          icon: string
          map_id: number
          visible: number
        }[]

        return {
          status: 200,
          body: {
            success: "Points récupérés",
            points,
          },
        }
      }
    } case "POST": {
      const { name, description, address, lat, lng, color, icon, map_id, visible } = await readBody(event) as {
        name: string
        description: string
        address: string
        lat: number
        lng: number
        color: string
        icon: string
        map_id: number
        visible: number
      }

      if (!name || !address || !lat || !lng || !icon || !map_id) {
        throw createError({ status: 400, message: "Champs requis manquants" })
      }

      const newPoint = db.prepare(`
        INSERT INTO Point (name, description, address, lat, lng, color, icon, map_id, visible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        name,
        description,
        address,
        lat,
        lng,
        color,
        icon,
        map_id,
        visible,
      )

      return {
        status: 201,
        body: {
          success: "Point créé",
          id: newPoint.lastInsertRowid,
        },
      }
    } case "PUT": {
      const { id, name, description, address, lat, lng, color, icon, visible } = await readBody(event) as {
        id: number
        name: string
        description: string
        address: string
        lat: number
        lng: number
        color: string
        icon: string
        visible: number
      }

      if (!id || !name || !address || !lat || !lng || !icon) {
        throw createError({ status: 400, message: "Champs requis manquants" })
      }

      db.prepare(`
        UPDATE Point
        SET name = ?, description = ?, address = ?, lat = ?, lng = ?, color = ?, icon = ?, visible = ?
        WHERE id = ?
      `).run(
        name,
        description,
        address,
        lat,
        lng,
        color,
        icon,
        visible,
        id,
      )

      return {
        status: 200,
        body: {
          success: "Point mis à jour",
        },
      }
    } case "DELETE": {
      const { id } = await readBody(event) as { id: number }

      if (!id) {
        throw createError({ status: 400, message: "Champs requis manquants" })
      }

      db.prepare(`
        DELETE FROM Point
        WHERE id = ?
      `).run(id)

      return {
        status: 200,
        body: {
          success: "Point supprimé",
        },
      }
    } default: {
      throw createError({ status: 405, message: "Méthode non autorisée" })
    }
  }
})
