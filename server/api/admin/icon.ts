import db from "@@/server/api/db"

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  switch (event.method) {
    case "GET": {
      const icons = db.prepare(`
        SELECT * FROM Icon
      `)
        .all() as {
        id: number;
        name: string;
        color: string;
        icon: string;
      }[]

      return {
        status: 200,
        body: {
          success: "Icons retrieved",
          icons,
        },
      }
    }
    case "POST": {
      const {
        name, color, icon,
      } = await readBody(event)

      if (!name || !color || !icon) {
        throw createError({
          status: 400, message: "Missing required fields",
        })
      }

      const newIcon = db.prepare(`
        INSERT INTO Icon (name, color, icon)
        VALUES (?, ?, ?)
      `)
        .run(name, color, icon)

      return {
        status: 201,
        body: {
          success: "Icon created",
          id: newIcon.lastInsertRowid,
        },
      }
    }
    case "PUT": {
      const {
        id, name, color, icon,
      } = await readBody(event)

      if (!id || !name || !color || !icon) {
        throw createError({
          status: 400, message: "Missing required fields",
        })
      }

      db.prepare(`
        UPDATE Icon
        SET name = ?, color = ?, icon = ?
        WHERE id = ?
      `)
        .run(name, color, icon, id)

      return {
        status: 200,
        body: {
          success: "Icon updated",
        },
      }
    }
    case "DELETE": {
      const { id } = await readBody(event)

      if (!id) {
        throw createError({
          status: 400, message: "Missing required fields",
        })
      }

      db.prepare(`
        DELETE FROM Icon
        WHERE id = ?
      `)
        .run(id)

      return {
        status: 200,
        body: {
          success: "Icon deleted",
        },
      }
    }
    default: {
      throw createError({
        status: 405, message: "Method not allowed",
      })
    }
  }
})
