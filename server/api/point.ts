import db from "@@/server/api/db"

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  switch (event.method) {
    case "GET": {
      const {
        map_id, point_id,
      } = getQuery(event)

      if (point_id) {
        // oxlint-disable-next-line no-unsafe-type-assertion
        const point = db.prepare(`
          SELECT * FROM Point
          WHERE id = ?
          AND map_id = ?
        `)
          .get(point_id, map_id) as {
            id: number;
            name: string;
            description: string;
            address: string;
            lat: number;
            lng: number;
            color: string;
            icon: number;
            map_id: number;
            visible: boolean;
            favorite: boolean;
          } | undefined

        if (!point) {
          throw createError({
            status: 404,
            message: "Point not found",
          })
        }

        point.visible = Boolean(point.visible)
        point.favorite = Boolean(point.favorite)

        return {
          status: 200,
          body: {
            success: "Point retrieved",
            point,
          },
        }
      } else {
        // oxlint-disable-next-line no-unsafe-type-assertion
        const points = db.prepare(`
          SELECT * FROM Point
          WHERE map_id = ?
          ORDER BY sort_order ASC, id ASC
        `)
          .all(map_id) as {
          id: number;
          name: string;
          description: string;
          address: string;
          lat: number;
          lng: number;
          color: string;
            icon: number;
          map_id: number;
          visible: boolean;
          favorite: boolean;
            sort_order: number;
        }[]

        points.forEach((point) => {
          point.visible = Boolean(point.visible)
          point.favorite = Boolean(point.favorite)
        })

        return {
          status: 200,
          body: {
            success: "Points retrieved",
            points,
          },
        }
      }
    } case "POST": {
      const {
        name, description, address, lat, lng, color, icon, map_id, visible, favorite, sort_order,
      } = await readBody(event)

      if (!name || !address || !lat || !lng || !icon || !map_id) {
        throw createError({
          status: 400, message: "Required fields missing",
        })
      }

      const dbVisible = visible
        ? 1
        : 0
      const dbFavorite = favorite
        ? 1
        : 0
      const dbSortOrder = typeof sort_order === "number" ? sort_order : 0

      const newPoint = db.prepare(`
        INSERT INTO Point (name, description, address, lat, lng, color, icon, map_id, visible, favorite, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
        .run(
          name,
          description,
          address,
          lat,
          lng,
          color,
          icon,
          map_id,
          dbVisible,
          dbFavorite,
          dbSortOrder,
        )

      return {
        status: 201,
        body: {
          success: "Point created",
          id: newPoint.lastInsertRowid,
        },
      }
    } case "PUT": {
      const {
        id, name, description, address, lat, lng, color, icon, visible, favorite, sort_order,
      } = await readBody(event)

      if (!id || !name || !address || !lat || !lng || !icon) {
        throw createError({
          status: 400, message: "Required fields missing",
        })
      }

      const dbVisible = visible
        ? 1
        : 0
      const dbFavorite = favorite
        ? 1
        : 0
      const dbSortOrder = typeof sort_order === "number" ? sort_order : 0

      db.prepare(`
        UPDATE Point
        SET name = ?, description = ?, address = ?, lat = ?, lng = ?, color = ?, icon = ?, visible = ?, favorite = ?, sort_order = ?
        WHERE id = ?
      `)
        .run(
          name,
          description,
          address,
          lat,
          lng,
          color,
          icon,
          dbVisible,
          dbFavorite,
          dbSortOrder,
          id,
        )

      return {
        status: 200,
        body: {
          success: "Point updated",
        },
      }
    } case "DELETE": {
      const { id } = await readBody(event)

      if (!id) {
        throw createError({
          status: 400, message: "Required fields missing",
        })
      }

      db.prepare(`
        DELETE FROM Point
        WHERE id = ?
      `)
        .run(id)

      return {
        status: 200,
        body: {
          success: "Point deleted",
        },
      }
    } default: {
      throw createError({
        status: 405, message: "Method not allowed",
      })
    }
  }
})
