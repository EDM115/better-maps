import db from "@/server/api/db"

import jwt from "jsonwebtoken"

// eslint-disable-next-line consistent-return
export default defineEventHandler(async (event) => {
  if ((/^\/api(\/(?!login).*)?$/).test(event.node.req.url ?? "")) {
    const authHeader = event.node.req.headers.authorization

    if (!authHeader) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }))
    }

    const [ , token ] = authHeader.split(" ")

    try {
      // eslint-disable-next-line import-x/no-named-as-default-member
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? "secret") as { id: number }

      event.context.auth = { userId: payload.id }
    } catch {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }))
    }

    if ((/^\/api\/admin(\/.*)?$/).test(event.node.req.url ?? "")) {
      const { admin_id } = event.method === "GET"
        ? await getQuery(event) as { admin_id: number | undefined }
        : await readBody(event) as { admin_id: number | undefined }

      if (!admin_id) {
        return sendError(event, createError({
          statusCode: 403,
          statusMessage: "Admin ID is required",
        }))
      }

      const admin = db.prepare(`
          SELECT * FROM User
          WHERE id = ? AND role = 'admin'
        `).get(admin_id)

      if (!admin) {
        return sendError(event, createError({
          statusCode: 403,
          statusMessage: "Admin not found or insufficient permissions",
        }))
      }
    }
  }
})
