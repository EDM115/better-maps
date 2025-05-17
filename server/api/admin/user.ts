import db from "../db"

import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

export default defineEventHandler(async (event) => {
  if (![ "GET", "POST", "PUT", "DELETE" ].includes(event.method)) {
    throw createError({ status: 405, message: "Method not allowed" })
  }

  switch (event.method) {
    case "GET": {
      const { user_id } = await getQuery(event) as { user_id: number | undefined }

      if (user_id) {
        const user = db.prepare(`
          SELECT * FROM User
          WHERE id = ?
        `).get(user_id) as {
          id: number
          username: string
          role: string
          map_id: number
        } | undefined

        if (!user) {
          throw createError({
            status: 404,
            message: "User not found",
          })
        }

        return {
          status: 200,
          body: {
            success: "User retrieved",
            user,
          },
        }
      } else {
        const users = db.prepare(`
          SELECT * FROM User
        `).all() as {
          id: number
          username: string
          role: string
          map_id: number
        }[]

        return {
          status: 200,
          body: {
            success: "Users retrieved",
            users,
          },
        }
      }
    }
    case "POST": {
      const { username, password, role, map_id } = await readBody(event) as {
        username: string
        password: string
        role: string
        map_id: number
      }

      if (!username || !map_id || !role || !password) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      const hashed = await bcrypt.hash(password, SALT_ROUNDS)

      const newUser = db.prepare(`
        INSERT INTO User (username, password, role, map_id)
        VALUES (?, ?, ?, ?)
      `).run(username, hashed, role, map_id)

      return {
        status: 201,
        body: {
          success: "User created",
          id: newUser.lastInsertRowid,
        },
      }
    }
    case "PUT": {
      const { id, role, map_id } = await readBody(event) as {
        id: number
        role: string
        map_id: number
      }

      if (!id || !map_id || !role) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      db.prepare(`
        UPDATE User
        SET map_id = ?, role = ?
        WHERE id = ?
      `).run(map_id, role, id)

      return {
        status: 200,
        body: {
          success: "User updated",
        },
      }
    }
    case "DELETE": {
      const { id } = await readBody(event) as { id: number }

      if (!id) {
        throw createError({ status: 400, message: "Missing required fields" })
      }

      db.prepare(`
        DELETE FROM User
        WHERE id = ?
      `).run(id)

      return {
        status: 200,
        body: {
          success: "User deleted",
        },
      }
    }
    default: {
      throw createError({ status: 405, message: "Method not allowed" })
    }
  }
})
