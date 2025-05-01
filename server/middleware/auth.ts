import jwt from "jsonwebtoken"

// eslint-disable-next-line consistent-return
export default defineEventHandler((event) => {
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
  }
})
