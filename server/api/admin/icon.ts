import db from "@@/server/api/db"

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({
      status: 405, message: "Method not allowed",
    })
  }

  switch (event.method) {
    case "GET": {
      // oxlint-disable-next-line no-unsafe-type-assertion
      const icons = db.prepare(`
        SELECT * FROM Icon
        ORDER BY sort_order ASC, id ASC
      `)
        .all() as {
        id: number;
        name: string;
        color: string;
        icon: string;
        visible: number;
        sort_order: number;
      }[]

      const normalizedIcons = icons.map((icon) => ({
        ...icon,
        visible: Boolean(icon.visible),
        sort_order: icon.sort_order ?? 0,
      }))

      return {
        status: 200,
        body: {
          success: "Icons retrieved",
          icons: normalizedIcons,
        },
      }
    }
    case "POST": {
      const {
        name, color, icon, visible, sort_order,
      } = await readBody(event)

      if (!name || !color || !icon) {
        throw createError({
          status: 400, message: "Missing required fields",
        })
      }

      const dbVisible = visible === false ? 0 : 1
      const dbSortOrder = typeof sort_order === "number" ? sort_order : 0

      const newIcon = db.prepare(`
        INSERT INTO Icon (name, color, icon, visible, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `)
        .run(name, color, icon, dbVisible, dbSortOrder)

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
        id, name, color, icon, visible, sort_order,
      } = await readBody(event)

      if (!id || !name || !color || !icon) {
        throw createError({
          status: 400, message: "Missing required fields",
        })
      }

      const dbVisible = visible === false ? 0 : 1
      const dbSortOrder = typeof sort_order === "number" ? sort_order : 0

      db.prepare(`
        UPDATE Icon
        SET name = ?, color = ?, icon = ?, visible = ?, sort_order = ?
        WHERE id = ?
      `)
        .run(name, color, icon, dbVisible, dbSortOrder, id)

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
